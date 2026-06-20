import type { QuizAnswers, FootprintBreakdown, CategoryBreakdown } from '../types';

// Emission factor maps (kg CO2/year estimates for awareness, NOT scientific audit)
const COMMUTE_MODE_FACTORS: Record<string, number> = {
    'walk-cycle-wfh': 100,
    'public-transport': 600,
    'two-wheeler': 900,
    'car': 2400,
    'ride-hailing': 3200,
};

const COMMUTE_DAYS_FACTORS: Record<string, number> = {
    '0-1': 0.2,
    '2-3': 0.5,
    '4-5': 0.85,
    '6-7': 1.0,
};

const DIET_FACTORS: Record<string, number> = {
    'plant-based': 1200,
    'vegetarian': 1800,
    'mixed': 2500,
    'meat-most-days': 3200,
    'meat-heavy': 4000,
};

const HOME_ENERGY_FACTORS: Record<string, number> = {
    'low-usage': 800,
    'moderate': 1500,
    'high': 2400,
    'very-high': 3200,
};

const SHOPPING_FACTORS: Record<string, number> = {
    'rarely': 200,
    'monthly': 500,
    'several-monthly': 900,
    'weekly': 1500,
};

const TRAVEL_FACTORS: Record<string, number> = {
    'almost-never': 100,
    '1-2-year': 800,
    '3-5-year': 2000,
    'very-frequent': 4000,
};

export function calculateFootprint(answers: QuizAnswers): FootprintBreakdown {
    const transportBase = COMMUTE_MODE_FACTORS[answers.commute_mode] ?? 1500;
    const commuteMultiplier = COMMUTE_DAYS_FACTORS[answers.commute_days] ?? 0.7;
    const transport = Math.round(transportBase * commuteMultiplier);

    const food = Math.round(DIET_FACTORS[answers.diet_type] ?? 2000);

    const energy = Math.round(HOME_ENERGY_FACTORS[answers.home_energy_usage] ?? 1500);

    const shopping = Math.round(SHOPPING_FACTORS[answers.shopping_frequency] ?? 500);
    const travel = Math.round(TRAVEL_FACTORS[answers.travel_frequency] ?? 500);
    const consumption = shopping + travel;

    const total_year = transport + food + energy + consumption;
    const total_month = Math.round(total_year / 12);

    const category_breakdown: CategoryBreakdown = { transport, food, energy, consumption };
    const category_percentages: CategoryBreakdown = {
        transport: Math.round((transport / total_year) * 100),
        food: Math.round((food / total_year) * 100),
        energy: Math.round((energy / total_year) * 100),
        consumption: Math.round((consumption / total_year) * 100),
    };

    const biggest_category = Object.entries(category_breakdown).reduce((a, b) =>
        b[1] > a[1] ? b : a
    )[0];

    const monthly_budget = Math.round(total_month * 0.8);

    return {
        total_kg_co2_year: total_year,
        total_kg_co2_month: total_month,
        category_breakdown,
        category_percentages,
        biggest_category,
        monthly_budget,
        current_spend: total_month,
        is_estimate: true,
    };
}

export function getDemoFootprint(): FootprintBreakdown {
    return {
        total_kg_co2_year: 3100,
        total_kg_co2_month: 258,
        category_breakdown: { transport: 1300, food: 850, energy: 600, consumption: 350 },
        category_percentages: { transport: 42, food: 27, energy: 19, consumption: 12 },
        biggest_category: 'transport',
        monthly_budget: 206,
        current_spend: 258,
        is_estimate: true,
    };
}

export function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        transport: 'Transport',
        food: 'Food & Diet',
        energy: 'Home Energy',
        consumption: 'Consumption',
    };
    return labels[category] || category;
}

export function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
        transport: '#10b981',
        food: '#f59e0b',
        energy: '#3b82f6',
        consumption: '#8b5cf6',
    };
    return colors[category] || '#6b7280';
}
