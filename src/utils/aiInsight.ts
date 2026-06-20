import type { AIInsightResponse, QuizAnswers, FootprintBreakdown, SecondaryTip } from '../types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_OPENROUTER_MODEL = 'openai/gpt-4o-mini';
const AI_TIMEOUT_MS = 12000;
const VALID_CATEGORIES = ['transport', 'food', 'energy', 'consumption'] as const;

type InsightSource = 'gemini' | 'openrouter';

type AiEnv = {
    geminiApiKey?: string;
    openRouterApiKey?: string;
    openRouterModel?: string;
};

type GenerateInsightOptions = {
    env?: AiEnv;
    fetcher?: typeof fetch;
    timeoutMs?: number;
};

function getDefaultEnv(): AiEnv {
    return {
        geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
        openRouterApiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
        openRouterModel: import.meta.env.VITE_OPENROUTER_MODEL,
    };
}

function buildPrompt(answers: QuizAnswers, footprint: FootprintBreakdown): string {
    return `You are CarbonIQ's carbon insight engine.

Your task is to analyze a user's lifestyle quiz answers and calculated carbon footprint breakdown, then return one highly specific, personalized, highest-impact carbon reduction action.

Important rules:
- Return strict JSON only.
- Do not return markdown.
- Do not include explanation outside JSON.
- Prioritize the single highest-impact action based on the largest footprint category and the user's stated preference.
- Do not give a long generic list.
- The main recommendation must be concrete and achievable.
- Include only 2 secondary tips.
- All CO2 values are estimates for awareness, not scientific audit values.

Input:
Quiz Answers:
${JSON.stringify(answers, null, 2)}

Footprint Breakdown:
${JSON.stringify(footprint, null, 2)}

Return JSON in exactly this shape:
{
  "one_lever": {
    "category": "transport | food | energy | consumption",
    "action": "specific action the user can take",
    "savings_estimate_kg": number,
    "why_it_matters": "short reason tied to user's footprint"
  },
  "secondary_tips": [
    {
      "category": "transport | food | energy | consumption",
      "action": "specific secondary action",
      "savings_estimate_kg": number
    },
    {
      "category": "transport | food | energy | consumption",
      "action": "specific secondary action",
      "savings_estimate_kg": number
    }
  ]
}`;
}

function normalizeCategory(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const category = value.trim().toLowerCase();
    return VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number]) ? category : null;
}

function asPositiveNumber(value: unknown): number | null {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed) : null;
}

function extractJsonObject(text: string): unknown {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('No JSON object found');
    }

    return JSON.parse(text.slice(firstBrace, lastBrace + 1));
}

function readValue<T = unknown>(record: Record<string, unknown>, snakeKey: string, camelKey: string): T {
    return (record[snakeKey] ?? record[camelKey]) as T;
}

function normalizeTip(rawTip: unknown): SecondaryTip | null {
    if (!rawTip || typeof rawTip !== 'object') return null;

    const tip = rawTip as Record<string, unknown>;
    const category = normalizeCategory(tip.category);
    const action = tip.action;
    const savings = asPositiveNumber(readValue(tip, 'savings_estimate_kg', 'savingsEstimateKg'));

    if (!category || typeof action !== 'string' || action.trim().length < 6 || !savings) {
        return null;
    }

    return {
        category,
        action: action.trim(),
        savings_estimate_kg: savings,
    };
}

export function parseAIInsightText(text: string, source: InsightSource): AIInsightResponse {
    const parsed = extractJsonObject(text);
    if (!parsed || typeof parsed !== 'object') {
        throw new Error('AI response is not an object');
    }

    const root = parsed as Record<string, unknown>;
    const rawOneLever = readValue<Record<string, unknown> | undefined>(root, 'one_lever', 'oneLever');
    if (!rawOneLever || typeof rawOneLever !== 'object') {
        throw new Error('Missing one lever');
    }

    const category = normalizeCategory(rawOneLever.category);
    const action = rawOneLever.action;
    const savings = asPositiveNumber(readValue(rawOneLever, 'savings_estimate_kg', 'savingsEstimateKg'));
    const whyItMatters = readValue(rawOneLever, 'why_it_matters', 'whyItMatters');

    if (!category || typeof action !== 'string' || action.trim().length < 6 || !savings) {
        throw new Error('Invalid one lever');
    }

    if (typeof whyItMatters !== 'string' || whyItMatters.trim().length < 8) {
        throw new Error('Invalid one lever explanation');
    }

    const rawTips = readValue<unknown>(root, 'secondary_tips', 'secondaryTips');
    if (!Array.isArray(rawTips)) {
        throw new Error('Missing secondary tips');
    }

    const secondaryTips = rawTips.map(normalizeTip).filter((tip): tip is SecondaryTip => tip !== null).slice(0, 2);
    if (secondaryTips.length === 0) {
        throw new Error('Invalid secondary tips');
    }

    return {
        one_lever: {
            category,
            action: action.trim(),
            savings_estimate_kg: savings,
            why_it_matters: whyItMatters.trim(),
        },
        secondary_tips: secondaryTips,
        source,
        created_at: new Date().toISOString(),
    };
}

async function fetchWithTimeout(
    fetcher: typeof fetch,
    url: string,
    init: RequestInit,
    timeoutMs: number
): Promise<Response> {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetcher(url, { ...init, signal: controller.signal });
    } finally {
        globalThis.clearTimeout(timeout);
    }
}

async function requestGeminiInsight(
    answers: QuizAnswers,
    footprint: FootprintBreakdown,
    apiKey: string,
    fetcher: typeof fetch,
    timeoutMs: number
): Promise<AIInsightResponse> {
    const response = await fetchWithTimeout(fetcher, `${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(answers, footprint) }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
        }),
    }, timeoutMs);

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string' || !text.trim()) throw new Error('Gemini response missing text');

    return parseAIInsightText(text, 'gemini');
}

async function requestOpenRouterInsight(
    answers: QuizAnswers,
    footprint: FootprintBreakdown,
    apiKey: string,
    model: string,
    fetcher: typeof fetch,
    timeoutMs: number
): Promise<AIInsightResponse> {
    const response = await fetchWithTimeout(fetcher, OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'X-OpenRouter-Title': 'CarbonIQ',
        },
        body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: buildPrompt(answers, footprint) }],
            temperature: 0.4,
            max_tokens: 1024,
        }),
    }, timeoutMs);

    if (!response.ok) throw new Error(`OpenRouter API error: ${response.status}`);

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (typeof text !== 'string' || !text.trim()) throw new Error('OpenRouter response missing text');

    return parseAIInsightText(text, 'openrouter');
}

export function getFallbackInsight(
    _answers: QuizAnswers,
    footprint: FootprintBreakdown
): AIInsightResponse {
    const cat = footprint.biggest_category;
    const fallbackMap: Record<string, { action: string; savings: number; why: string; secondary: { category: string; action: string; savings_estimate_kg: number }[] }> = {
        transport: {
            action: 'Swap 2 car commutes per week for public transport, walking, cycling, or carpooling.',
            savings: 180,
            why: `Transport is your largest footprint category at ${footprint.category_percentages.transport}% of total emissions. Changing commute habits creates the biggest single impact.`,
            secondary: [
                { category: 'food', action: 'Replace 2 meat-heavy meals per week with plant-based meals.', savings_estimate_kg: 90 },
                { category: 'energy', action: 'Switch to energy-efficient appliances and reduce AC usage by 1 hour daily.', savings_estimate_kg: 60 },
            ],
        },
        food: {
            action: 'Switch 2 meat-heavy meals per week to plant-based or vegetarian meals.',
            savings: 150,
            why: `Food accounts for ${footprint.category_percentages.food}% of your footprint. Diet shifts have strong compounding effects on emissions.`,
            secondary: [
                { category: 'transport', action: 'Replace 1 car commute per week with public transport or cycling.', savings_estimate_kg: 90 },
                { category: 'consumption', action: 'Avoid one non-essential purchase per month and choose longer-lasting items.', savings_estimate_kg: 50 },
            ],
        },
        energy: {
            action: 'Reduce high AC/heating usage and switch off idle appliances daily.',
            savings: 120,
            why: `Home energy is ${footprint.category_percentages.energy}% of your footprint. Efficiency gains here are easy to sustain and save money.`,
            secondary: [
                { category: 'transport', action: 'Replace 2 car commutes per week with walking or public transport.', savings_estimate_kg: 180 },
                { category: 'food', action: 'Choose plant-based meals twice a week.', savings_estimate_kg: 90 },
            ],
        },
        consumption: {
            action: 'Avoid one non-essential purchase per month and choose longer-lasting items.',
            savings: 80,
            why: `Consumption is ${footprint.category_percentages.consumption}% of your footprint. Buying less and choosing quality reduces waste and emissions.`,
            secondary: [
                { category: 'transport', action: 'Replace 2 car commutes per week with public transport.', savings_estimate_kg: 180 },
                { category: 'food', action: 'Replace 2 meat-heavy meals per week with vegetarian options.', savings_estimate_kg: 90 },
            ],
        },
    };

    const fb = fallbackMap[cat] || fallbackMap.transport;

    return {
        one_lever: {
            category: cat,
            action: fb.action,
            savings_estimate_kg: fb.savings,
            why_it_matters: fb.why,
        },
        secondary_tips: fb.secondary,
        source: 'fallback',
        created_at: new Date().toISOString(),
    };
}

export async function generateOneLeverInsight(
    answers: QuizAnswers,
    footprint: FootprintBreakdown,
    options: GenerateInsightOptions = {}
): Promise<AIInsightResponse> {
    const env = { ...getDefaultEnv(), ...options.env };
    const fetcher = options.fetcher ?? fetch;
    const timeoutMs = options.timeoutMs ?? AI_TIMEOUT_MS;

    if (env.geminiApiKey) {
        try {
            return await requestGeminiInsight(answers, footprint, env.geminiApiKey, fetcher, timeoutMs);
        } catch {
            // Continue to OpenRouter, then static fallback. Never block the dashboard on AI failures.
        }
    }

    if (env.openRouterApiKey) {
        try {
            return await requestOpenRouterInsight(
                answers,
                footprint,
                env.openRouterApiKey,
                env.openRouterModel || DEFAULT_OPENROUTER_MODEL,
                fetcher,
                timeoutMs
            );
        } catch {
            // Fall through to deterministic insight.
        }
    }

    return getFallbackInsight(answers, footprint);
}

export function getDemoInsight(): AIInsightResponse {
    return {
        one_lever: {
            category: 'transport',
            action: 'Swap 2 car commutes per week for public transport or carpooling.',
            savings_estimate_kg: 180,
            why_it_matters: 'Transport is your largest footprint category, so changing this habit creates the biggest improvement.',
        },
        secondary_tips: [
            { category: 'food', action: 'Replace two meat-heavy meals per week with vegetarian meals.', savings_estimate_kg: 90 },
            { category: 'energy', action: 'Switch to energy-efficient appliances and reduce AC usage.', savings_estimate_kg: 60 },
        ],
        source: 'fallback',
        created_at: new Date().toISOString(),
    };
}
