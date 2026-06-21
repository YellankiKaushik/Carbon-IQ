import { describe, expect, it, vi } from 'vitest';
import type { AIInsightResponse, Challenge, QuizAnswers } from '../types';
import { calculateFootprint } from './calculator';
import { generateOneLeverInsight, getFallbackInsight, parseAIInsightText } from './aiInsight';
import { applyChallengeCheckIn, createChallengeFromInsight } from './challengeLogic';
import { getLeaderboardWithUser } from './leaderboard';
import { createStoryCardData, createStoryFilename } from './storyData';
import { possessiveName, sanitizeDisplayName } from './profile';
import { useAppStore } from '../store/useAppStore';

const answers: QuizAnswers = {
    commute_mode: 'car',
    commute_days: '4-5',
    diet_type: 'mixed',
    home_energy_usage: 'moderate',
    shopping_frequency: 'monthly',
    travel_frequency: '1-2-year',
    reduction_preference: 'biggest-impact',
};

const validAIJson = JSON.stringify({
    one_lever: {
        category: 'transport',
        action: 'Replace two car commutes with public transport each week.',
        savings_estimate_kg: 180,
        why_it_matters: 'Transport is your largest footprint category, so this is the strongest lever.',
    },
    secondary_tips: [
        { category: 'food', action: 'Swap two meat-heavy meals for vegetarian meals.', savings_estimate_kg: 90 },
        { category: 'energy', action: 'Turn off idle appliances each evening.', savings_estimate_kg: 50 },
    ],
});

const openRouterAIJson = JSON.stringify({
    oneLever: {
        category: 'food',
        action: 'Replace two meat-heavy meals per week with plant-forward meals.',
        savingsEstimateKg: 150,
        whyItMatters: 'Food is a major part of this footprint, so meal swaps are practical and meaningful.',
    },
    secondaryTips: [
        { category: 'transport', action: 'Use public transport for one commute each week.', savingsEstimateKg: 80 },
        { category: 'energy', action: 'Reduce AC use by one hour on hot days.', savingsEstimateKg: 45 },
    ],
});

function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

describe('CarbonIQ calculator', () => {
    it('returns category totals and annual/monthly estimates', () => {
        const footprint = calculateFootprint(answers);

        expect(footprint.category_breakdown.transport).toBeGreaterThan(0);
        expect(footprint.category_breakdown.food).toBeGreaterThan(0);
        expect(footprint.category_breakdown.energy).toBeGreaterThan(0);
        expect(footprint.category_breakdown.consumption).toBeGreaterThan(0);
        expect(footprint.total_kg_co2_year).toBe(
            Object.values(footprint.category_breakdown).reduce((sum, value) => sum + value, 0)
        );
        expect(footprint.total_kg_co2_month).toBe(Math.round(footprint.total_kg_co2_year / 12));
    });

    it('identifies the biggest category and creates a monthly budget', () => {
        const footprint = calculateFootprint({ ...answers, diet_type: 'meat-heavy' });

        expect(footprint.biggest_category).toBe('food');
        expect(footprint.monthly_budget).toBe(Math.round(footprint.total_kg_co2_month * 0.8));
        expect(footprint.current_spend).toBe(footprint.total_kg_co2_month);
    });
});

describe('One Lever fallback', () => {
    it('returns a valid one lever insight when AI is unavailable', () => {
        const transportHeavyAnswers = {
            ...answers,
            commute_mode: 'ride-hailing',
            commute_days: '6-7',
            diet_type: 'plant-based',
        };
        const footprint = calculateFootprint(transportHeavyAnswers);
        const insight = getFallbackInsight(transportHeavyAnswers, footprint);

        expect(insight.source).toBe('fallback');
        expect(insight.one_lever.action).toContain('commutes');
        expect(insight.one_lever.savings_estimate_kg).toBeGreaterThan(0);
        expect(insight.secondary_tips).toHaveLength(2);
    });
});

describe('AI provider fallback chain', () => {
    it('returns Gemini insight when Gemini succeeds', async () => {
        const footprint = calculateFootprint(answers);
        const fetcher = vi.fn().mockResolvedValue(jsonResponse({
            candidates: [{ content: { parts: [{ text: validAIJson }] } }],
        }));

        const insight = await generateOneLeverInsight(answers, footprint, {
            env: { geminiApiKey: 'gemini-key' },
            fetcher: fetcher as unknown as typeof fetch,
        });

        expect(insight.source).toBe('gemini');
        expect(insight.one_lever.category).toBe('transport');
        expect(fetcher).toHaveBeenCalledTimes(1);
    });

    it('uses OpenRouter when Gemini fails and OpenRouter succeeds', async () => {
        const footprint = calculateFootprint(answers);
        const fetcher = vi.fn()
            .mockResolvedValueOnce(jsonResponse({ error: 'bad gateway' }, 502))
            .mockResolvedValueOnce(jsonResponse({
                choices: [{ message: { content: openRouterAIJson } }],
            }));

        const insight = await generateOneLeverInsight(answers, footprint, {
            env: {
                geminiApiKey: 'gemini-key',
                openRouterApiKey: 'openrouter-key',
                openRouterModel: 'openai/gpt-4o-mini',
            },
            fetcher: fetcher as unknown as typeof fetch,
        });

        expect(insight.source).toBe('openrouter');
        expect(insight.one_lever.category).toBe('food');
        expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it('falls back when both AI providers fail', async () => {
        const footprint = calculateFootprint(answers);
        const fetcher = vi.fn()
            .mockResolvedValueOnce(jsonResponse({ error: 'gemini failed' }, 500))
            .mockResolvedValueOnce(jsonResponse({ error: 'openrouter failed' }, 500));

        const insight = await generateOneLeverInsight(answers, footprint, {
            env: { geminiApiKey: 'gemini-key', openRouterApiKey: 'openrouter-key' },
            fetcher: fetcher as unknown as typeof fetch,
        });

        expect(insight.source).toBe('fallback');
        expect(insight.one_lever.action).toBeTruthy();
    });

    it('uses static fallback when API keys are missing', async () => {
        const footprint = calculateFootprint(answers);
        const fetcher = vi.fn();

        const insight = await generateOneLeverInsight(answers, footprint, {
            env: { geminiApiKey: '', openRouterApiKey: '' },
            fetcher: fetcher as unknown as typeof fetch,
        });

        expect(insight.source).toBe('fallback');
        expect(fetcher).not.toHaveBeenCalled();
    });

    it('rejects invalid AI JSON so provider selection can continue', () => {
        expect(() => parseAIInsightText('not json', 'gemini')).toThrow();
        expect(() => parseAIInsightText('{"one_lever":{"category":"bad"}}', 'gemini')).toThrow();
    });

    it('parses an OpenRouter-style camelCase response correctly', () => {
        const insight = parseAIInsightText(`Here is the JSON:\n${openRouterAIJson}`, 'openrouter');

        expect(insight.source).toBe('openrouter');
        expect(insight.one_lever.category).toBe('food');
        expect(insight.one_lever.savings_estimate_kg).toBe(150);
        expect(insight.secondary_tips).toHaveLength(2);
    });
});

describe('challenge check-ins', () => {
    const insight: AIInsightResponse = {
        one_lever: {
            category: 'transport',
            action: 'Swap 2 car commutes per week for public transport or carpooling.',
            savings_estimate_kg: 180,
            why_it_matters: 'Transport is the biggest category.',
        },
        secondary_tips: [],
        source: 'fallback',
        created_at: '2026-06-20T00:00:00.000Z',
    };

    it('increments streak and CO2 saved for a valid check-in', () => {
        const challenge = createChallengeFromInsight(insight, new Date('2026-06-20T08:00:00.000Z'));
        const result = applyChallengeCheckIn(challenge, [], new Date('2026-06-21T08:00:00.000Z'));

        expect(result.success).toBe(true);
        expect(result.challenge?.streak_count).toBe(1);
        expect(result.challenge?.total_saved_kg).toBe(challenge.saving_per_checkin_kg);
        expect(result.checkIns).toHaveLength(1);
    });

    it('blocks duplicate same-day check-ins', () => {
        const challenge = createChallengeFromInsight(insight, new Date('2026-06-20T08:00:00.000Z'));
        const first = applyChallengeCheckIn(challenge, [], new Date('2026-06-21T08:00:00.000Z'));
        const second = applyChallengeCheckIn(first.challenge as Challenge, first.checkIns, new Date('2026-06-21T12:00:00.000Z'));

        expect(second.success).toBe(false);
        expect(second.challenge?.streak_count).toBe(1);
        expect(second.checkIns).toHaveLength(1);
    });
});

describe('leaderboard and story data', () => {
    it('sorts by total saved and highlights the current user', () => {
        const { entries, userRank } = getLeaderboardWithUser('You', 500, 7);

        expect(userRank).toBe(1);
        expect(entries[0].is_current_user).toBe(true);
        expect(entries.map((entry) => entry.total_saved_kg)).toEqual(
            [...entries.map((entry) => entry.total_saved_kg)].sort((a, b) => b - a)
        );
    });

    it('generates story card data from challenge state', () => {
        const challenge: Challenge = {
            id: 'challenge-test',
            source: 'one_lever',
            category: 'transport',
            action_description: 'Swap 2 commutes.',
            joined_at: '2026-06-20T00:00:00.000Z',
            streak_count: 3,
            total_saved_kg: 18,
            saving_per_checkin_kg: 6,
            status: 'active',
        };
        const insight = getFallbackInsight(answers, calculateFootprint(answers));
        const story = createStoryCardData(challenge, insight, 4, 4200, 'Kaushik');

        expect(story.total_saved_kg).toBe(18);
        expect(story.streak_count).toBe(3);
        expect(story.leaderboard_rank).toBe(4);
        expect(story.annual_footprint_kg).toBe(4200);
        expect(story.download_filename).toBe('carboniq-story-kaushik.png');
        expect(story.share_caption).toContain('18 kg CO2');
        expect(story.share_caption).toContain('carbon-iq-1994a.web.app');
    });
});

describe('personalization helpers and demo mode', () => {
    it('sanitizes display names and falls back to You', () => {
        expect(sanitizeDisplayName('  <Kaushik>   Yellanki  ')).toBe('Kaushik Yellanki');
        expect(sanitizeDisplayName('')).toBe('You');
        expect(possessiveName('You')).toBe('Your');
        expect(possessiveName('Kaushik')).toBe("Kaushik's");
    });

    it('creates clean story filenames with fallback', () => {
        expect(createStoryFilename('Kaushik Yellanki')).toBe('carboniq-story-kaushik-yellanki.png');
        expect(createStoryFilename('')).toBe('carboniq-story.png');
    });

    it('sets demo mode for sample dashboards and clears it on real calculation', () => {
        useAppStore.getState().resetAll();
        useAppStore.getState().loadDemoState();

        expect(useAppStore.getState().isDemoMode).toBe(true);
        expect(useAppStore.getState().footprint).not.toBeNull();

        useAppStore.getState().calculateQuizFootprint();

        expect(useAppStore.getState().isDemoMode).toBe(false);
        expect(useAppStore.getState().footprint).not.toBeNull();
    });
});
