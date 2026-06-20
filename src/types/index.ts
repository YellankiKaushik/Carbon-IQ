export interface UserProfile {
    id: string;
    display_name: string;
    created_at: string;
}

export interface QuizAnswers {
    commute_mode: string;
    commute_days: string;
    diet_type: string;
    home_energy_usage: string;
    shopping_frequency: string;
    travel_frequency: string;
    reduction_preference: string;
}

export interface CategoryBreakdown {
    transport: number;
    food: number;
    energy: number;
    consumption: number;
}

export interface FootprintBreakdown {
    total_kg_co2_year: number;
    total_kg_co2_month: number;
    category_breakdown: CategoryBreakdown;
    category_percentages: CategoryBreakdown;
    biggest_category: string;
    monthly_budget: number;
    current_spend: number;
    is_estimate: boolean;
}

export interface OneLever {
    category: string;
    action: string;
    savings_estimate_kg: number;
    why_it_matters: string;
}

export interface SecondaryTip {
    category: string;
    action: string;
    savings_estimate_kg: number;
}

export interface AIInsightResponse {
    one_lever: OneLever;
    secondary_tips: SecondaryTip[];
    source: 'gemini' | 'openrouter' | 'fallback';
    created_at: string;
}

export interface Challenge {
    id: string;
    source: 'one_lever' | 'secondary_tip';
    category: string;
    action_description: string;
    joined_at: string;
    streak_count: number;
    total_saved_kg: number;
    saving_per_checkin_kg: number;
    status: 'active' | 'reset';
}

export interface CheckIn {
    id: string;
    challenge_id: string;
    date: string;
    saved_kg: number;
    created_at: string;
}

export interface CheckInResult {
    success: boolean;
    message: string;
    challenge: Challenge | null;
    checkIns: CheckIn[];
}

export interface LeaderboardEntry {
    user_name: string;
    is_current_user: boolean;
    total_saved_kg: number;
    streak_count: number;
    badge: string;
}

export interface StoryCardData {
    total_saved_kg: number;
    biggest_win: string;
    streak_count: number;
    leaderboard_rank: number;
    share_caption: string;
}

export interface QuizOption {
    value: string;
    label: string;
    icon?: string;
}

export interface QuizQuestion {
    id: keyof QuizAnswers;
    question: string;
    options: QuizOption[];
}
