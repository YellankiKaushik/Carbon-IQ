import { useAppStore } from '../store/useAppStore';
import { getCategoryLabel, getCategoryColor } from '../utils/calculator';
import { SEED_LEADERBOARD } from '../utils/leaderboard';
import { possessiveName, sanitizeDisplayName } from '../utils/profile';
import { getSafeCategory, trackCarbonIQEvent } from '../utils/analytics';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from 'recharts';
import {
    ArrowRight,
    Loader2,
    AlertTriangle,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    TrendingDown,
    Leaf,
    BarChart3,
    Trophy,
    BookOpen,
    Zap,
    Users,
    CheckCircle2,
    Target,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Dashboard() {
    const {
        footprint,
        insight,
        insightLoading,
        retryInsight,
        joinChallenge,
        challenge,
        checkIns,
        user,
        isDemoMode,
        setPage,
        resetQuiz,
    } = useAppStore();

    const [showSecondary, setShowSecondary] = useState(false);
    const dashboardViewTracked = useRef(false);
    const demoDashboardViewTracked = useRef(false);

    useEffect(() => {
        if (!footprint) return;

        if (!dashboardViewTracked.current) {
            trackCarbonIQEvent('dashboard_viewed', {
                mode: isDemoMode ? 'demo' : 'real',
                ai_source: insight?.source || 'unknown',
                largest_category: getSafeCategory(footprint.biggest_category),
            });
            dashboardViewTracked.current = true;
        }

        if (isDemoMode && !demoDashboardViewTracked.current) {
            trackCarbonIQEvent('demo_dashboard_viewed', { mode: 'demo' });
            demoDashboardViewTracked.current = true;
        }
    }, [footprint, insight?.source, isDemoMode]);

    if (!footprint) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BarChart3 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No results yet</h2>
                    <p className="text-gray-500 mb-6">Complete the Carbon Quiz to generate your dashboard.</p>
                    <button
                        onClick={() => {
                            trackCarbonIQEvent('quiz_started', { source: 'dashboard' });
                            setPage('quiz');
                        }}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
                    >
                        Start Quiz
                    </button>
                </div>
            </div>
        );
    }

    const budgetPercent = Math.round((footprint.current_spend / footprint.monthly_budget) * 100);
    const overBudget = footprint.current_spend > footprint.monthly_budget;
    const userName = sanitizeDisplayName(user?.display_name);
    const dashboardTitle = `${possessiveName(userName)} CarbonIQ Dashboard`;
    const remainingBudget = footprint.monthly_budget - footprint.current_spend;
    const communitySaved = SEED_LEADERBOARD.reduce((sum, entry) => sum + entry.total_saved_kg, 0);
    const averageStreak = Math.round(SEED_LEADERBOARD.reduce((sum, entry) => sum + entry.streak_count, 0) / SEED_LEADERBOARD.length);
    const hasCheckedInToday = challenge
        ? checkIns.some((checkIn) => checkIn.challenge_id === challenge.id && checkIn.date === new Date().toISOString().split('T')[0])
        : false;

    const pieData = Object.entries(footprint.category_breakdown).map(([key, value]) => ({
        name: getCategoryLabel(key),
        value,
        color: getCategoryColor(key),
    }));

    const categoryColors = Object.keys(footprint.category_breakdown).map(getCategoryColor);

    const handleJoinChallenge = () => {
        if (!challenge) {
            joinChallenge();
        }
        setPage('challenges');
    };

    const handleRetryInsight = () => {
        trackCarbonIQEvent('ai_insight_retried', {
            previous_source: insight?.source || 'unknown',
            largest_category: getSafeCategory(footprint.biggest_category),
        });
        void retryInsight();
    };

    const startRealQuiz = (source: 'demo_dashboard' | 'dashboard') => {
        trackCarbonIQEvent('quiz_started', { source });
        resetQuiz();
        setPage('quiz');
    };

    const insightSourceLabel = insight?.source === 'gemini'
        ? 'AI: Gemini'
        : insight?.source === 'openrouter'
            ? 'AI: OpenRouter'
            : 'Fallback Insight';

    const insightSourceClass = insight?.source === 'gemini'
        ? 'bg-blue-50 text-blue-600'
        : insight?.source === 'openrouter'
            ? 'bg-violet-50 text-violet-600'
            : 'bg-gray-100 text-gray-500';

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                {isDemoMode && (
                    <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
                                Demo Mode
                            </span>
                            <p className="text-sm text-amber-900">
                                You are viewing sample data. Start the quiz to calculate your own CarbonIQ.
                            </p>
                        </div>
                        <button
                            onClick={() => startRealQuiz('demo_dashboard')}
                            className="min-h-11 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-semibold transition-all"
                        >
                            Calculate My Real Footprint
                        </button>
                    </div>
                )}

                {/* Header summary */}
                <div className="text-center mb-10">
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            {dashboardTitle}
                        </h1>
                        {isDemoMode && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                                Sample Data
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 mb-3">Welcome back, {userName}. Your largest opportunity is {getCategoryLabel(footprint.biggest_category).toLowerCase()}.</p>
                    <div className="flex items-baseline justify-center gap-3">
                        <span className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {footprint.total_kg_co2_year.toLocaleString()}
                        </span>
                        <span className="text-xl text-gray-500 font-medium">kg CO2/year</span>
                    </div>
                    <p className="text-gray-400 mt-2">
                        ~{footprint.total_kg_co2_month.toLocaleString()} kg/month - This is an estimate for awareness, not a scientific audit.
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Annual footprint', value: `${footprint.total_kg_co2_year.toLocaleString()} kg`, icon: BarChart3, bg: '#ecfdf5', fg: '#059669' },
                        { label: 'Monthly footprint', value: `${footprint.total_kg_co2_month.toLocaleString()} kg`, icon: TrendingDown, bg: '#f0fdfa', fg: '#0f766e' },
                        { label: 'Biggest category', value: getCategoryLabel(footprint.biggest_category), icon: Zap, bg: '#fffbeb', fg: '#d97706' },
                        { label: 'One Lever savings', value: `${insight?.one_lever.savings_estimate_kg || '-'} kg/yr`, icon: Leaf, bg: '#f0fdf4', fg: '#16a34a' },
                    ].map(({ label, value, icon: Icon, bg, fg }) => (
                        <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
                                <Icon className="w-4 h-4" style={{ color: fg }} />
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{label}</div>
                            <div className="text-lg font-bold text-gray-900">{value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Category Breakdown Chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div
                                className="w-44 h-44 flex-shrink-0"
                                role="img"
                                aria-label={`Carbon footprint category chart. Largest category is ${getCategoryLabel(footprint.biggest_category)}.`}
                            >
                                <PieChart width={176} height={176}>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={70}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={entry.name} fill={categoryColors[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) => [`${Number(value || 0).toLocaleString()} kg`, '']}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid #f0f0f0' }}
                                    />
                                </PieChart>
                            </div>
                            <div className="flex-1 space-y-3">
                                {Object.entries(footprint.category_breakdown).map(([key, value]) => (
                                    <div
                                        key={key}
                                        className={`flex items-center justify-between rounded-lg px-2 py-1 ${key === footprint.biggest_category ? 'bg-emerald-50' : ''}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: getCategoryColor(key) }}
                                            />
                                            <span className="text-sm text-gray-600">{getCategoryLabel(key)}</span>
                                            {key === footprint.biggest_category && (
                                                <span className="text-[10px] uppercase tracking-wide font-bold text-emerald-700">Largest</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {value.toLocaleString()} kg
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                ({footprint.category_percentages[key as keyof typeof footprint.category_percentages]}%)
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Carbon Budget */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Carbon Budget</h3>
                        <div className="mb-4">
                            <div className="flex justify-between items-baseline mb-2">
                                <span className="text-sm text-gray-500">Current spend vs budget</span>
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${overBudget
                                            ? 'bg-red-50 text-red-700'
                                            : 'bg-emerald-50 text-emerald-700'
                                        }`}
                                >
                                    {overBudget ? (
                                        <>
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            Over budget
                                        </>
                                    ) : (
                                        'Within budget'
                                    )}
                                </span>
                            </div>
                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${overBudget
                                            ? 'bg-gradient-to-r from-amber-400 to-red-500'
                                            : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                        }`}
                                    style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                                <span className="text-gray-500">
                                    {footprint.current_spend} kg / {footprint.monthly_budget} kg
                                </span>
                                <span className="font-medium text-gray-700">{budgetPercent}%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 italic">
                            Monthly budget set at 80% of current spend as a reduction target.
                        </p>
                        <div className={`mt-4 rounded-xl p-4 text-sm ${overBudget ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>
                            {overBudget
                                ? `You are about ${Math.abs(remainingBudget).toLocaleString()} kg over this monthly reduction target.`
                                : `You have about ${remainingBudget.toLocaleString()} kg left in this monthly reduction target.`}
                        </div>
                    </div>
                </div>

                {/* One Lever Insight - MOST PROMINENT */}
                {insightLoading ? (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-8 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-emerald-900">Finding your highest-impact action...</h3>
                                <p className="text-sm text-emerald-700">Analyzing your footprint to find the best lever.</p>
                            </div>
                        </div>
                    </div>
                ) : insight ? (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border-2 border-emerald-200 p-6 md:p-8 mb-8 shadow-sm relative overflow-hidden">
                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/40 to-transparent rounded-bl-full" />

                        <div className="relative">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-gray-900">Your One Lever Action</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${insightSourceClass}`}>
                                            {insightSourceLabel}
                                        </span>
                                    </div>
                                    <p className="text-sm text-emerald-700 mt-0.5">
                                        Your biggest opportunity is in <strong>{getCategoryLabel(insight.one_lever.category)}</strong>.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 border border-emerald-100 mb-4">
                                <p className="text-lg font-semibold text-gray-900 mb-2">{insight.one_lever.action}</p>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                                        ~{insight.one_lever.savings_estimate_kg} kg CO2/year saved
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-3">{insight.one_lever.why_it_matters}</p>
                            </div>

                            <details className="bg-white/70 rounded-xl border border-emerald-100 p-4 mb-4">
                                <summary className="cursor-pointer text-sm font-semibold text-emerald-800">
                                    How this insight was generated
                                </summary>
                                <div className="mt-3 grid gap-2 text-sm text-gray-600">
                                    <p>CarbonIQ analyzed your quiz answers and estimated category breakdown.</p>
                                    <p>It identified {getCategoryLabel(footprint.biggest_category)} as the biggest category, then selected one practical action with the strongest estimated impact.</p>
                                    <p>Savings are approximate and meant for awareness, not audit-grade reporting.</p>
                                </div>
                            </details>

                            <button
                                onClick={handleJoinChallenge}
                                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-200 hover:shadow-emerald-300 transition-all flex items-center justify-center gap-2"
                            >
                                {challenge ? 'View Challenge' : 'Join This Challenge'}
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={handleRetryInsight}
                                className="mt-3 sm:ml-3 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Retry AI Insight
                            </button>
                        </div>
                    </div>
                ) : null}

                {/* Secondary Tips */}
                {insight && insight.secondary_tips.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
                        <button
                            onClick={() => setShowSecondary(!showSecondary)}
                            aria-expanded={showSecondary}
                            className="w-full px-6 py-4 flex items-center justify-between text-left"
                        >
                            <span className="text-sm font-semibold text-gray-700">Other helpful actions</span>
                            {showSecondary ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        {showSecondary && (
                            <div className="px-6 pb-6 space-y-3">
                                {insight.secondary_tips.map((tip, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                                            style={{ backgroundColor: getCategoryColor(tip.category) }}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{tip.action}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                ~{tip.savings_estimate_kg} kg CO2/year - {getCategoryLabel(tip.category)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Community Snapshot</h3>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">Sample data</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Sample users</p>
                                <p className="text-2xl font-bold text-gray-900">{SEED_LEADERBOARD.length}</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Demo CO2 saved</p>
                                <p className="text-2xl font-bold text-gray-900">{communitySaved.toLocaleString()} kg</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Popular challenge</p>
                                <p className="text-sm font-bold text-gray-900">Transit swaps</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">Average streak</p>
                                <p className="text-2xl font-bold text-gray-900">{averageStreak} days</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="w-5 h-5 text-emerald-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Challenge Progress</h3>
                        </div>
                        {challenge ? (
                            <div className="space-y-4">
                                <p className="font-semibold text-gray-900">{challenge.action_description}</p>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="rounded-xl bg-emerald-50 p-3">
                                        <p className="text-xl font-bold text-gray-900">{challenge.streak_count}</p>
                                        <p className="text-xs text-gray-500">streak</p>
                                    </div>
                                    <div className="rounded-xl bg-emerald-50 p-3">
                                        <p className="text-xl font-bold text-gray-900">{challenge.total_saved_kg}</p>
                                        <p className="text-xs text-gray-500">kg saved</p>
                                    </div>
                                    <div className="rounded-xl bg-emerald-50 p-3">
                                        <p className="text-xl font-bold text-gray-900">{hasCheckedInToday ? 'Yes' : 'No'}</p>
                                        <p className="text-xs text-gray-500">today</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setPage('challenges')}
                                    className="w-full min-h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Check In
                                </button>
                            </div>
                        ) : (
                            <div className="rounded-xl bg-gray-50 p-5">
                                <p className="text-gray-600 mb-4">Join your One Lever to start a streak and track estimated CO2 saved.</p>
                                <button
                                    onClick={handleJoinChallenge}
                                    className="min-h-11 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-all"
                                >
                                    Join This Challenge
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={() => startRealQuiz('dashboard')}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
                    >
                        Recalculate
                    </button>
                    <button
                        onClick={() => setPage('leaderboard')}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5"
                    >
                        <Trophy className="w-4 h-4" />
                        Leaderboard
                    </button>
                    <button
                        onClick={() => setPage('story')}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5"
                    >
                        <BookOpen className="w-4 h-4" />
                        Story Card
                    </button>
                </div>
            </div>
        </div>
    );
}
