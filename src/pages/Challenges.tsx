import { useAppStore } from '../store/useAppStore';
import { getCategoryLabel, getCategoryColor } from '../utils/calculator';
import { possessiveName, sanitizeDisplayName } from '../utils/profile';
import { useState } from 'react';
import {
    Target,
    CheckCircle2,
    Flame,
    TrendingDown,
    Clock,
    ArrowLeft,
    Trophy,
    BookOpen,
    AlertCircle,
} from 'lucide-react';

export default function Challenges() {
    const { user, challenge, checkIns, checkIn, resetChallenge, setPage } = useAppStore();
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const userName = sanitizeDisplayName(user?.display_name);
    const ownerLabel = possessiveName(userName);

    const handleCheckIn = () => {
        const result = checkIn();
        setStatusMessage({ type: result.success ? 'success' : 'error', text: result.message });
    };

    if (!challenge) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No active challenge yet</h2>
                    <p className="text-gray-500 mb-6">Join your One Lever action to start tracking CO2 saved.</p>
                    <button
                        onClick={() => setPage('dashboard')}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
                    >
                        View One Lever
                    </button>
                </div>
            </div>
        );
    }

    const today = new Date().toISOString().split('T')[0];
    const hasCheckedInToday = checkIns.some((c) => c.date === today);
    const recentCheckIns = [...checkIns].reverse().slice(0, 7);
    const estimatedMonthlyImpact = challenge.saving_per_checkin_kg * 22; // ~22 working days

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-20 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{ownerLabel} Active Challenge</h1>
                    <p className="text-gray-500">Track your daily actions and watch your CO2 savings grow.</p>
                </div>

                {/* Active Challenge Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: getCategoryColor(challenge.category) + '20' }}
                        >
                            <Target className="w-6 h-6" style={{ color: getCategoryColor(challenge.category) }} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">{challenge.action_description}</h3>
                                <span className="inline-flex items-center px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                                    Active
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                {getCategoryLabel(challenge.category)} - Joined {new Date(challenge.joined_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* Progress cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-orange-50 rounded-xl p-4 text-center">
                            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                            <div className="text-2xl font-bold text-gray-900">{challenge.streak_count}</div>
                            <div className="text-xs text-gray-500">Day streak</div>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-4 text-center">
                            <TrendingDown className="w-6 h-6 text-emerald-500 mx-auto mb-1" />
                            <div className="text-2xl font-bold text-gray-900">{challenge.total_saved_kg} kg</div>
                            <div className="text-xs text-gray-500">Total CO2 saved</div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                            <Target className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                            <div className="text-2xl font-bold text-gray-900">{challenge.saving_per_checkin_kg} kg</div>
                            <div className="text-xs text-gray-500">Per check-in</div>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                            <Clock className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                            <div className="text-2xl font-bold text-gray-900">~{estimatedMonthlyImpact} kg</div>
                            <div className="text-xs text-gray-500">Est. monthly</div>
                        </div>
                    </div>

                    {/* Check-in button */}
                    {hasCheckedInToday ? (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-medium text-emerald-800">
                                You already completed today's check-in. Come back tomorrow!
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={handleCheckIn}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-200 hover:shadow-emerald-300 transition-all text-lg flex items-center justify-center gap-2"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            I completed this action today
                        </button>
                    )}

                    {statusMessage && (
                        <div
                            className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-sm ${
                                statusMessage.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                                    : 'bg-amber-50 text-amber-800 border border-amber-100'
                            }`}
                            role="status"
                        >
                            {statusMessage.type === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            )}
                            {statusMessage.text}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    {recentCheckIns.length === 0 ? (
                        <div className="text-center py-8">
                            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 text-sm">
                                Your check-in history will appear here after you complete your first action.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {recentCheckIns.map((checkin) => (
                                <div
                                    key={checkin.id}
                                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        <span className="text-sm text-gray-700">
                                            {new Date(checkin.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <span className="text-sm font-semibold text-emerald-600">+{checkin.saved_kg} kg saved</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={() => setPage('dashboard')}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Dashboard
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
                    <button
                        onClick={() => { if (confirm('Reset your challenge progress?')) resetChallenge(); }}
                        className="px-5 py-2.5 text-sm font-medium text-red-500 hover:text-red-700 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-all"
                    >
                        Reset Challenge
                    </button>
                </div>
            </div>
        </div>
    );
}
