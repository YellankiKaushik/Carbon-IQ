import { logEvent } from 'firebase/analytics';
import { getFirebaseAnalytics } from '../lib/firebase';

export const CARBONIQ_ANALYTICS_EVENTS = [
    'app_loaded',
    'landing_viewed',
    'demo_dashboard_viewed',
    'quiz_started',
    'quiz_completed',
    'dashboard_viewed',
    'ai_insight_generated',
    'ai_insight_retried',
    'challenge_joined',
    'check_in_completed',
    'duplicate_check_in_blocked',
    'leaderboard_viewed',
    'story_card_viewed',
    'story_card_downloaded',
    'story_caption_copied',
    'story_app_link_copied',
] as const;

export type CarbonIQAnalyticsEvent = typeof CARBONIQ_ANALYTICS_EVENTS[number];
export type AnalyticsParamValue = string | number | boolean;
export type AnalyticsParams = Record<string, AnalyticsParamValue | null | undefined>;

export function getFootprintBand(totalKg: number): 'low' | 'medium' | 'high' | 'very_high' {
    if (!Number.isFinite(totalKg) || totalKg < 3000) return 'low';
    if (totalKg < 6000) return 'medium';
    if (totalKg < 10000) return 'high';
    return 'very_high';
}

export function getSafeCategory(category?: string | null): 'transport' | 'food' | 'home_energy' | 'consumption' | 'unknown' {
    if (category === 'transport' || category === 'food' || category === 'consumption') return category;
    if (category === 'energy' || category === 'home_energy') return 'home_energy';
    return 'unknown';
}

export function sanitizeAnalyticsParams(params: AnalyticsParams = {}): Record<string, AnalyticsParamValue> {
    return Object.entries(params).reduce<Record<string, AnalyticsParamValue>>((safeParams, [key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            safeParams[key] = value;
        }
        return safeParams;
    }, {});
}

export function trackCarbonIQEvent(eventName: CarbonIQAnalyticsEvent, params: AnalyticsParams = {}): void {
    void getFirebaseAnalytics()
        .then((analytics) => {
            if (!analytics) return;
            logEvent(analytics, eventName, sanitizeAnalyticsParams(params));
        })
        .catch(() => {
            // Analytics must never block or crash the product experience.
        });
}
