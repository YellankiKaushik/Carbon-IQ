import type { AIInsightResponse, Challenge, StoryCardData } from '../types';

export function createStoryCardData(
    challenge: Challenge | null,
    insight: AIInsightResponse | null,
    leaderboardRank: number
): StoryCardData {
    const totalSavedKg = challenge?.total_saved_kg || 0;
    const streakCount = challenge?.streak_count || 0;
    const biggestWin = insight?.one_lever.action || 'Taking climate action';

    return {
        total_saved_kg: totalSavedKg,
        biggest_win: biggestWin,
        streak_count: streakCount,
        leaderboard_rank: leaderboardRank,
        share_caption: `I saved ${totalSavedKg} kg CO2 with CarbonIQ. My biggest win: ${biggestWin.toLowerCase()}`,
    };
}
