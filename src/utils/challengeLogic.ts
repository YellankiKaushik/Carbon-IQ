import type { AIInsightResponse, Challenge, CheckIn, CheckInResult } from '../types';

export function createChallengeFromInsight(insight: AIInsightResponse, now = new Date()): Challenge {
    return {
        id: `challenge-${now.getTime()}`,
        source: 'one_lever',
        category: insight.one_lever.category,
        action_description: insight.one_lever.action,
        joined_at: now.toISOString(),
        streak_count: 0,
        total_saved_kg: 0,
        saving_per_checkin_kg: Math.max(1, Math.round(insight.one_lever.savings_estimate_kg / 30)),
        status: 'active',
    };
}

export function applyChallengeCheckIn(
    challenge: Challenge | null,
    checkIns: CheckIn[],
    date = new Date()
): CheckInResult {
    if (!challenge) {
        return { success: false, message: 'No active challenge.', challenge, checkIns };
    }

    const today = date.toISOString().split('T')[0];
    const alreadyCheckedIn = checkIns.some((checkIn) => checkIn.challenge_id === challenge.id && checkIn.date === today);

    if (alreadyCheckedIn) {
        return {
            success: false,
            message: "You already completed today's check-in.",
            challenge,
            checkIns,
        };
    }

    const newCheckIn: CheckIn = {
        id: `checkin-${date.getTime()}`,
        challenge_id: challenge.id,
        date: today,
        saved_kg: challenge.saving_per_checkin_kg,
        created_at: date.toISOString(),
    };

    const updatedChallenge: Challenge = {
        ...challenge,
        streak_count: challenge.streak_count + 1,
        total_saved_kg: challenge.total_saved_kg + challenge.saving_per_checkin_kg,
    };

    return {
        success: true,
        message: 'Check-in saved. Your CO2 saved total increased.',
        challenge: updatedChallenge,
        checkIns: [...checkIns, newCheckIn],
    };
}
