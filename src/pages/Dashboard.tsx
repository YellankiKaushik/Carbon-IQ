import { useAppStore } from '../store/useAppStore';
import { getCategoryLabel, getCategoryColor } from '../utils/calculator';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
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
} from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
    const {
        footprint,
        insight,
        insightLoading,
        retryInsight,
        joinChallenge,
        challenge,
        setPage,
        resetQuiz,
    } = useAppStore();

    const [showSecondary, setShowSecondary] = useState(false);

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
                        onClick={() => setPage('quiz')}
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
                {/* Header summary */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Your estimated annual footprint
                    </h1>
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
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Annual footprint', value: `${footprint.total_kg_co2_year.toLocaleString()} kg`, icon: BarChart3, color: 'emerald' },
                        { label: 'Monthly spend', value: `${footprint.total_kg_co2_month.toLocaleString()} kg`, icon: TrendingDown, color: 'teal' },
                        { label: 'Biggest category', value: getCategoryLabel(footprint.biggest_category), icon: Zap, color: 'amber' },
                        { label: 'One Lever savings', value: `${insight?.one_lever.savings_estimate_kg || '—'} kg/yr`, icon: Leaf, color: 'green' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                            <div className={`w-8 h-8 bg-${color}-50 rounded-lg flex items-center justify-center mb-3`}>
                                <Icon className={`w-4 h-4 text-${color}-600`} />
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
                        <div className="flex items-center gap-6">
                            <div className="w-40 h-40 flex-shrink-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
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
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 space-y-3">
                                {Object.entries(footprint.category_breakdown).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: getCategoryColor(key) }}
                                            />
                                            <span className="text-sm text-gray-600">{getCategoryLabel(key)}</span>
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
                                <h3 className="font-semibold text-emerald-900">Finding your highest-impact action…</h3>
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

                            <button
                                onClick={handleJoinChallenge}
                                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-200 hover:shadow-emerald-300 transition-all flex items-center justify-center gap-2"
                            >
                                {challenge ? 'View Challenge' : 'Join This Challenge'}
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {insight.source === 'fallback' && (
                                <button
                                    onClick={retryInsight}
                                    className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-800 font-medium"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    Retry AI Insight
                                </button>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Secondary Tips */}
                {insight && insight.secondary_tips.length > 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-8 overflow-hidden">
                        <button
                            onClick={() => setShowSecondary(!showSecondary)}
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

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={() => { resetQuiz(); setPage('quiz'); }}
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
