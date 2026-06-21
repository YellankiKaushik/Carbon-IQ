import { useAppStore } from '../store/useAppStore';
import { getLeaderboardWithUser } from '../utils/leaderboard';
import { possessiveName, sanitizeDisplayName } from '../utils/profile';
import { Trophy, Flame, ArrowLeft, BookOpen, Target, Medal, Info } from 'lucide-react';

export default function Leaderboard() {
    const { user, challenge, setPage } = useAppStore();
    const userName = sanitizeDisplayName(user?.display_name);
    const totalSaved = challenge?.total_saved_kg || 0;
    const streak = challenge?.streak_count || 0;
    const ownerLabel = possessiveName(userName);

    const { entries, userRank } = getLeaderboardWithUser(userName, totalSaved, streak);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Medal className="w-5 h-5 text-yellow-500" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
        return <span className="text-sm font-bold text-gray-400 w-5 text-center">{rank}</span>;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-20 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full text-amber-700 text-sm font-medium mb-4">
                        <Trophy className="w-4 h-4" />
                        Sample Community Leaderboard
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{ownerLabel} CO2 Saved Rank</h1>
                    <p className="text-gray-500">Ranked by progress, not by lowest footprint.</p>
                </div>

                {/* Fairness explanation */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                        CarbonIQ ranks people by total CO2 saved so users are rewarded for improvement, regardless of their starting footprint. Community names are seeded sample data for demo purposes.
                    </p>
                </div>

                {/* Leaderboard list */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    {entries.map((entry, i) => (
                        <div
                            key={`${entry.user_name}-${i}`}
                            className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0 transition-colors ${entry.is_current_user
                                    ? 'bg-emerald-50/60 border-l-4 border-l-emerald-500'
                                    : 'hover:bg-gray-50/50'
                                }`}
                        >
                            {/* Rank */}
                            <div className="w-8 flex justify-center">{getRankIcon(i + 1)}</div>

                            {/* Name & badge */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`font-semibold truncate ${entry.is_current_user ? 'text-emerald-700' : 'text-gray-900'}`}>
                                        {entry.user_name}
                                    </span>
                                    {entry.is_current_user && (
                                        <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                                            You
                                        </span>
                                    )}
                                </div>
                                {entry.badge && (
                                    <span className="text-xs text-gray-500">{entry.badge}</span>
                                )}
                            </div>

                            {/* Streak */}
                            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
                                <Flame className="w-4 h-4 text-orange-400" />
                                {entry.streak_count}
                            </div>

                            {/* CO2 saved */}
                            <div className="text-right">
                                <span className={`text-lg font-bold ${entry.is_current_user ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    {entry.total_saved_kg}
                                </span>
                                <span className="text-xs text-gray-400 ml-1">kg</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Your stats summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-emerald-600">#{userRank}</div>
                            <div className="text-xs text-gray-500">Your rank</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">{totalSaved} kg</div>
                            <div className="text-xs text-gray-500">Total saved</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-orange-500">{streak}</div>
                            <div className="text-xs text-gray-500">Day streak</div>
                        </div>
                    </div>
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
                        onClick={() => setPage('challenges')}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5"
                    >
                        <Target className="w-4 h-4" />
                        Check In Again
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
