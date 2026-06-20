import { useAppStore } from '../store/useAppStore';
import {
    Leaf,
    ArrowRight,
    BarChart3,
    Zap,
    TrendingDown,
    Play,
    Timer,
    Target,
    Share2,
} from 'lucide-react';

export default function Landing() {
    const { setPage, loadDemoState } = useAppStore();

    const handleStart = () => {
        setPage('quiz');
    };

    const handleViewDemo = () => {
        loadDemoState();
    };

    const steps = [
        { icon: BarChart3, label: 'Answer a short quiz', desc: '7 lifestyle questions' },
        { icon: Zap, label: 'See your footprint breakdown', desc: 'Category analysis' },
        { icon: Target, label: 'Get one personalized action', desc: 'Your highest-impact lever' },
        { icon: TrendingDown, label: 'Track your saved CO₂', desc: 'Streaks & progress' },
    ];

    const stats = [
        { icon: Timer, label: '2-minute quiz' },
        { icon: Zap, label: 'One Lever insight' },
        { icon: TrendingDown, label: 'CO₂ saved tracker' },
        { icon: Share2, label: 'Shareable story card' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            {/* Hero */}
            <div className="max-w-6xl mx-auto px-4 pt-8 pb-20 md:pt-16 md:pb-32">
                <div className="text-center max-w-3xl mx-auto">
                    {/* Logo */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/60 rounded-full text-emerald-700 text-sm font-medium mb-8">
                        <Leaf className="w-4 h-4" />
                        CarbonIQ
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                        Know your carbon.
                        <br />
                        <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            Change one thing.
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Calculate your personal carbon footprint in 2 minutes, discover your single highest-impact
                        action, and track your progress toward reducing it.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                        <button
                            onClick={handleStart}
                            className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all flex items-center justify-center gap-2 text-lg"
                        >
                            Calculate Your Carbon IQ
                            <ArrowRight className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleViewDemo}
                            className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 hover:border-emerald-200 text-gray-600 hover:text-emerald-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <Play className="w-4 h-4" />
                            View Demo Dashboard
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 max-w-lg mx-auto">
                        Estimated lifestyle footprint. Built for simple personal awareness, not scientific audit.
                    </p>
                </div>

                {/* Stats chips */}
                <div className="flex flex-wrap justify-center gap-3 mt-12">
                    {stats.map(({ icon: Icon, label }) => (
                        <div
                            key={label}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-sm text-gray-600"
                        >
                            <Icon className="w-4 h-4 text-emerald-500" />
                            {label}
                        </div>
                    ))}
                </div>

                {/* How it works */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How it works</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map(({ icon: Icon, label, desc }, i) => (
                            <div key={label} className="relative">
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div className="text-xs font-bold text-emerald-600 mb-1">Step {i + 1}</div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                                    <p className="text-sm text-gray-500">{desc}</p>
                                </div>
                                {i < 3 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-emerald-200" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
                CarbonIQ — Personal carbon awareness for individuals, not enterprises.
            </div>
        </div>
    );
}
