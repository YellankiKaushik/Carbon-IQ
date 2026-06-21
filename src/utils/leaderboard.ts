import type { LeaderboardEntry } from '../types';

export const SEED_LEADERBOARD: LeaderboardEntry[] = [
    { user_name: 'Aanya', is_current_user: false, total_saved_kg: 420, streak_count: 18, badge: 'Climate Champ' },
    { user_name: 'Rohan', is_current_user: false, total_saved_kg: 310, streak_count: 14, badge: 'Transit Hero' },
    { user_name: 'Meera', is_current_user: false, total_saved_kg: 265, streak_count: 11, badge: 'Low Waste' },
    { user_name: 'Arjun', is_current_user: false, total_saved_kg: 210, streak_count: 9, badge: 'Energy Saver' },
    { user_name: 'Nisha', is_current_user: false, total_saved_kg: 180, streak_count: 8, badge: 'Food Shift' },
    { user_name: 'Kabir', is_current_user: false, total_saved_kg: 145, streak_count: 6, badge: 'Smart Saver' },
    { user_name: 'Tara', is_current_user: false, total_saved_kg: 95, streak_count: 4, badge: 'Starter' },
    { user_name: 'Dev', is_current_user: false, total_saved_kg: 60, streak_count: 3, badge: 'New Reducer' },
];

export function getUserBadge(totalSavedKg: number): string {
    if (totalSavedKg >= 400) return 'Climate Champ';
    if (totalSavedKg >= 250) return 'Transit Hero';
    if (totalSavedKg >= 150) return 'Eco Warrior';
    if (totalSavedKg >= 80) return 'Green Starter';
    if (totalSavedKg > 0) return 'New Reducer';
    return 'Getting Started';
}

export function getLeaderboardWithUser(
    userName: string,
    totalSavedKg: number,
    streakCount: number
): { entries: LeaderboardEntry[]; userRank: number } {
    const userEntry: LeaderboardEntry = {
        user_name: userName,
        is_current_user: true,
        total_saved_kg: totalSavedKg,
        streak_count: streakCount,
        badge: getUserBadge(totalSavedKg),
    };

    const entries = [...SEED_LEADERBOARD, userEntry].sort((a, b) => {
        if (b.total_saved_kg !== a.total_saved_kg) {
            return b.total_saved_kg - a.total_saved_kg;
        }
        if (a.is_current_user !== b.is_current_user) {
            return a.is_current_user ? -1 : 1;
        }
        return a.user_name.localeCompare(b.user_name);
    });

    const userRank = entries.findIndex((e) => e.is_current_user) + 1;

    return { entries, userRank };
}
