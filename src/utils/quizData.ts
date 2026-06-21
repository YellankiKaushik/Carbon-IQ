import type { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 'commute_mode',
        question: 'How do you usually commute?',
        options: [
            { value: 'walk-cycle-wfh', label: 'Walk / Cycle / Work from home' },
            { value: 'public-transport', label: 'Public transport' },
            { value: 'two-wheeler', label: 'Two-wheeler' },
            { value: 'car', label: 'Car' },
            { value: 'ride-hailing', label: 'Ride-hailing / Taxi frequently' },
        ],
    },
    {
        id: 'commute_days',
        question: 'How many days per week do you commute?',
        options: [
            { value: '0-1', label: '0-1 days' },
            { value: '2-3', label: '2-3 days' },
            { value: '4-5', label: '4-5 days' },
            { value: '6-7', label: '6-7 days' },
        ],
    },
    {
        id: 'diet_type',
        question: 'What best describes your diet?',
        options: [
            { value: 'plant-based', label: 'Mostly plant-based' },
            { value: 'vegetarian', label: 'Vegetarian with dairy' },
            { value: 'mixed', label: 'Mixed diet with occasional meat' },
            { value: 'meat-most-days', label: 'Meat most days' },
            { value: 'meat-heavy', label: 'Meat-heavy diet' },
        ],
    },
    {
        id: 'home_energy_usage',
        question: 'How energy-conscious is your home usage?',
        options: [
            { value: 'low-usage', label: 'Very low usage / Efficient appliances' },
            { value: 'moderate', label: 'Moderate usage' },
            { value: 'high', label: 'High AC/heating/electricity usage' },
            { value: 'very-high', label: 'Very high usage' },
        ],
    },
    {
        id: 'shopping_frequency',
        question: 'How often do you buy new clothes, gadgets, or non-essential items?',
        options: [
            { value: 'rarely', label: 'Rarely' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'several-monthly', label: 'Several times a month' },
            { value: 'weekly', label: 'Weekly or more' },
        ],
    },
    {
        id: 'travel_frequency',
        question: 'How often do you take flights or long-distance trips?',
        options: [
            { value: 'almost-never', label: 'Almost never' },
            { value: '1-2-year', label: '1-2 times a year' },
            { value: '3-5-year', label: '3-5 times a year' },
            { value: 'very-frequent', label: 'Very frequently' },
        ],
    },
    {
        id: 'reduction_preference',
        question: 'What is your main reduction preference?',
        options: [
            { value: 'save-money', label: 'Save money' },
            { value: 'save-time', label: 'Save time' },
            { value: 'healthier', label: 'Healthier lifestyle' },
            { value: 'low-effort', label: 'Low-effort habit change' },
            { value: 'biggest-impact', label: 'Biggest CO2 impact' },
        ],
    },
];
