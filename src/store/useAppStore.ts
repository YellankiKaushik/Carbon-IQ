import { create } from 'zustand';
import type {
    UserProfile,
    QuizAnswers,
    FootprintBreakdown,
    AIInsightResponse,
    Challenge,
    CheckIn,
    CheckInResult,
} from '../types';
import { calculateFootprint, getDemoFootprint } from '../utils/calculator';
import { generateOneLeverInsight, getDemoInsight } from '../utils/aiInsight';
import { applyChallengeCheckIn, createChallengeFromInsight } from '../utils/challengeLogic';
import { sanitizeDisplayName } from '../utils/profile';

interface AppState {
    user: UserProfile | null;
    setUserName: (name: string) => void;

    quizAnswers: Partial<QuizAnswers>;
    setQuizAnswer: (key: keyof QuizAnswers, value: string) => void;
    resetQuiz: () => void;

    footprint: FootprintBreakdown | null;
    calculateQuizFootprint: () => void;

    insight: AIInsightResponse | null;
    insightLoading: boolean;
    generateInsight: () => Promise<void>;
    retryInsight: () => Promise<void>;

    challenge: Challenge | null;
    joinChallenge: () => void;
    checkIn: () => CheckInResult;
    resetChallenge: () => void;

    checkIns: CheckIn[];

    currentPage: string;
    setPage: (page: string) => void;
    isDemoMode: boolean;
    setDemoMode: (value: boolean) => void;

    quizSubmitting: boolean;
    setQuizSubmitting: (v: boolean) => void;

    resetAll: () => void;
    loadDemoState: () => void;
    hydrate: () => void;
}

function loadFromStorage<T>(key: string, fallback: T): T {
    try {
        if (typeof localStorage === 'undefined') return fallback;
        const raw = localStorage.getItem(`carboniq_${key}`);
        if (raw) return JSON.parse(raw) as T;
    } catch {
        // Storage can fail in private browsing or corrupted demo state. Fall back safely.
    }
    return fallback;
}

function saveToStorage(key: string, value: unknown) {
    try {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(`carboniq_${key}`, JSON.stringify(value));
    } catch {
        // Demo continuity is helpful, but the app must still work without localStorage.
    }
}

function removeFromStorage(key: string) {
    try {
        if (typeof localStorage === 'undefined') return;
        localStorage.removeItem(`carboniq_${key}`);
    } catch {
        // Ignore storage cleanup failures.
    }
}

const demoAnswers: QuizAnswers = {
    commute_mode: 'car',
    commute_days: '4-5',
    diet_type: 'mixed',
    home_energy_usage: 'moderate',
    shopping_frequency: 'monthly',
    travel_frequency: '1-2-year',
    reduction_preference: 'biggest-impact',
};

export const useAppStore = create<AppState>((set, get) => ({
    user: null,
    setUserName: (name: string) => {
        const user: UserProfile = {
            id: 'current-user',
            display_name: sanitizeDisplayName(name),
            created_at: get().user?.created_at || new Date().toISOString(),
        };
        set({ user });
        saveToStorage('user', user);
    },

    quizAnswers: {},
    setQuizAnswer: (key, value) => {
        set((state) => {
            const quizAnswers = { ...state.quizAnswers, [key]: value };
            saveToStorage('quizAnswers', quizAnswers);
            return { quizAnswers };
        });
    },
    resetQuiz: () => {
        set({ quizAnswers: {}, footprint: null, insight: null, quizSubmitting: false, isDemoMode: false });
        removeFromStorage('quizAnswers');
        removeFromStorage('footprint');
        removeFromStorage('insight');
        saveToStorage('isDemoMode', false);
    },

    footprint: null,
    calculateQuizFootprint: () => {
        const footprint = calculateFootprint(get().quizAnswers as QuizAnswers);
        set({ footprint, isDemoMode: false });
        saveToStorage('footprint', footprint);
        saveToStorage('isDemoMode', false);
    },

    insight: null,
    insightLoading: false,
    generateInsight: async () => {
        const { quizAnswers, footprint } = get();
        if (!footprint) return;

        set({ insightLoading: true });
        try {
            const insight = await generateOneLeverInsight(quizAnswers as QuizAnswers, footprint);
            set({ insight, insightLoading: false });
            saveToStorage('insight', insight);
        } catch {
            set({ insightLoading: false });
        }
    },
    retryInsight: async () => {
        const { quizAnswers, footprint } = get();
        if (!footprint) return;

        set({ insightLoading: true });
        try {
            const insight = await generateOneLeverInsight(quizAnswers as QuizAnswers, footprint);
            set({ insight, insightLoading: false });
            saveToStorage('insight', insight);
        } catch {
            set({ insightLoading: false });
        }
    },

    challenge: null,
    joinChallenge: () => {
        const { insight, challenge } = get();
        if (!insight || challenge) return;

        const newChallenge = createChallengeFromInsight(insight);
        set({ challenge: newChallenge, checkIns: [] });
        saveToStorage('challenge', newChallenge);
        saveToStorage('checkIns', []);
    },

    checkIn: () => {
        const result = applyChallengeCheckIn(get().challenge, get().checkIns);

        if (result.success) {
            set({ challenge: result.challenge, checkIns: result.checkIns });
            saveToStorage('challenge', result.challenge);
            saveToStorage('checkIns', result.checkIns);
        }

        return result;
    },

    resetChallenge: () => {
        set({ challenge: null, checkIns: [] });
        removeFromStorage('challenge');
        removeFromStorage('checkIns');
    },

    checkIns: [],

    currentPage: 'landing',
    setPage: (page: string) => set({ currentPage: page }),
    isDemoMode: false,
    setDemoMode: (value: boolean) => {
        set({ isDemoMode: value });
        saveToStorage('isDemoMode', value);
    },

    quizSubmitting: false,
    setQuizSubmitting: (v: boolean) => set({ quizSubmitting: v }),

    resetAll: () => {
        set({
            user: null,
            quizAnswers: {},
            footprint: null,
            insight: null,
            challenge: null,
            checkIns: [],
            currentPage: 'landing',
            isDemoMode: false,
            quizSubmitting: false,
            insightLoading: false,
        });

        try {
            if (typeof localStorage !== 'undefined') {
                Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith('carboniq_')) localStorage.removeItem(key);
                });
            }
        } catch {
            // Ignore storage cleanup failures.
        }
    },

    loadDemoState: () => {
        const user: UserProfile = {
            id: 'current-user',
            display_name: 'You',
            created_at: new Date().toISOString(),
        };
        const footprint = getDemoFootprint();
        const insight = getDemoInsight();

        set({
            user,
            quizAnswers: demoAnswers,
            footprint,
            insight,
            challenge: null,
            checkIns: [],
            currentPage: 'dashboard',
            isDemoMode: true,
            quizSubmitting: false,
            insightLoading: false,
        });

        saveToStorage('user', user);
        saveToStorage('quizAnswers', demoAnswers);
        saveToStorage('footprint', footprint);
        saveToStorage('insight', insight);
        saveToStorage('isDemoMode', true);
        removeFromStorage('challenge');
        removeFromStorage('checkIns');
    },

    hydrate: () => {
        const user = loadFromStorage<UserProfile | null>('user', null);
        const quizAnswers = loadFromStorage<Partial<QuizAnswers>>('quizAnswers', {});
        const footprint = loadFromStorage<FootprintBreakdown | null>('footprint', null);
        const insight = loadFromStorage<AIInsightResponse | null>('insight', null);
        const challenge = loadFromStorage<Challenge | null>('challenge', null);
        const checkIns = loadFromStorage<CheckIn[]>('checkIns', []);
        const isDemoMode = loadFromStorage<boolean>('isDemoMode', false);

        set({ user, quizAnswers, footprint, insight, challenge, checkIns, isDemoMode });
    },
}));
