import type { AIInsightResponse, Challenge, StoryCardData } from '../types';
import { sanitizeDisplayName } from './profile';

const APP_URL = 'https://carbon-iq-1994a.web.app';

export function createStoryFilename(userName?: string | null): string {
    const safeName = sanitizeDisplayName(userName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    return safeName && safeName !== 'you'
        ? `carboniq-story-${safeName}.png`
        : 'carboniq-story.png';
}

export function createStoryCardData(
    challenge: Challenge | null,
    insight: AIInsightResponse | null,
    leaderboardRank: number,
    annualFootprintKg = 0,
    userName?: string | null
): StoryCardData {
    const totalSavedKg = challenge?.total_saved_kg || 0;
    const streakCount = challenge?.streak_count || 0;
    const biggestWin = (insight?.one_lever.action || 'Taking climate action').replace(/[.!?]+$/, '');
    const displayName = sanitizeDisplayName(userName);

    return {
        total_saved_kg: totalSavedKg,
        annual_footprint_kg: annualFootprintKg,
        biggest_win: biggestWin,
        streak_count: streakCount,
        leaderboard_rank: leaderboardRank,
        share_caption: `${displayName === 'You' ? 'I' : displayName} used CarbonIQ to find one high-impact climate action: ${biggestWin}. Estimated progress: ${totalSavedKg} kg CO2 saved with a ${streakCount}-day streak. Try it: ${APP_URL}`,
        download_filename: createStoryFilename(userName),
    };
}
