import { useAppStore } from '../store/useAppStore';
import { trackCarbonIQEvent } from '../utils/analytics';
import type { AppPage } from '../types';
import type { LucideIcon } from 'lucide-react';
import { Leaf, BarChart3, Target, Trophy, BookOpen, Home } from 'lucide-react';

type NavPage = Exclude<AppPage, 'landing' | 'quiz'>;

const NAV_ITEMS: Array<{ id: NavPage; label: string; icon: LucideIcon }> = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'story', label: 'Story Card', icon: BookOpen },
];

export default function Navbar() {
    const { currentPage, setPage, footprint, resetQuiz } = useAppStore();
    const showNav = currentPage !== 'landing';

    if (!showNav) return null;

    const goHome = () => setPage('landing');
    const startOver = () => {
        trackCarbonIQEvent('quiz_started', { source: 'restart' });
        resetQuiz();
        setPage('quiz');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-emerald-100">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                <button
                    onClick={goHome}
                    className="flex items-center gap-2 text-emerald-700 font-semibold text-lg hover:text-emerald-800 transition-colors"
                    aria-label="Go to CarbonIQ home"
                >
                    <Leaf className="w-5 h-5" />
                    CarbonIQ
                </button>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1">
                    <button
                        onClick={goHome}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all"
                    >
                        <Home className="w-4 h-4" />
                        Home
                    </button>
                    {footprint ? (
                        NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setPage(id)}
                                aria-current={currentPage === id ? 'page' : undefined}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${currentPage === id
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))
                    ) : (
                        <button
                            onClick={startOver}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
                        >
                            Start Quiz
                        </button>
                    )}
                </div>

                {/* Mobile nav */}
                <div className="flex md:hidden items-center gap-1">
                    <button
                        onClick={goHome}
                        className="p-2 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                        title="Home"
                        aria-label="Go home"
                    >
                        <Home className="w-5 h-5" />
                    </button>
                    {footprint && NAV_ITEMS.map(({ id, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setPage(id)}
                                aria-current={currentPage === id ? 'page' : undefined}
                                className={`p-2 rounded-lg transition-all ${currentPage === id
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                                title={id}
                                aria-label={`Open ${id}`}
                            >
                                <Icon className="w-5 h-5" />
                            </button>
                        ))}
                </div>
            </div>
        </nav>
    );
}
