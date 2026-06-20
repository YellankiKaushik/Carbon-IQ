import { useAppStore } from '../store/useAppStore';
import { Leaf, BarChart3, Target, Trophy, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'story', label: 'Story Card', icon: BookOpen },
];

export default function Navbar() {
    const { currentPage, setPage, footprint } = useAppStore();
    const showNav = footprint !== null && currentPage !== 'landing' && currentPage !== 'quiz';

    if (!showNav) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <button
                    onClick={() => setPage('landing')}
                    className="flex items-center gap-2 text-emerald-700 font-semibold text-lg hover:text-emerald-800 transition-colors"
                >
                    <Leaf className="w-5 h-5" />
                    CarbonIQ
                </button>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setPage(id)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${currentPage === id
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Mobile nav */}
                <div className="flex md:hidden items-center gap-1">
                    {NAV_ITEMS.map(({ id, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setPage(id)}
                            className={`p-2 rounded-lg transition-all ${currentPage === id
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            title={id}
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}
