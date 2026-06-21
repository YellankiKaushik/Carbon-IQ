import { useAppStore } from '../store/useAppStore';
import {
    Leaf,
    ArrowRight,
    BarChart3,
    Zap,
    TrendingDown,
    Play,
    Target,
    Share2,
    Brain,
    ShieldCheck,
    CheckCircle2,
} from 'lucide-react';

export default function Landing() {
    const { setPage, loadDemoState } = useAppStore();

    const steps = [
        { icon: BarChart3, label: 'Answer a lifestyle quiz', desc: 'Seven focused questions across transport, food, energy, shopping, and travel.' },
        { icon: TrendingDown, label: 'See your footprint', desc: 'Annual, monthly, budget, and category breakdowns in one readable dashboard.' },
        { icon: Zap, label: 'Get your One Lever', desc: 'CarbonIQ highlights one high-impact action instead of a long generic tip list.' },
        { icon: Target, label: 'Join a challenge', desc: 'Check in, build a streak, and track estimated CO2 saved.' },
        { icon: Share2, label: 'Share your story', desc: 'Generate a Carbon Story card and social-ready caption.' },
    ];

    const problems = [
        'Most people do not know which daily habits create the most emissions.',
        'Generic eco tips are noisy and hard to prioritize.',
        'Carbon tracking often feels too technical for everyday use.',
        'CarbonIQ turns lifestyle data into one clear action to start with.',
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-gray-900">
            <header className="max-w-6xl mx-auto px-4 pt-8 pb-12 md:pt-14 md:pb-20">
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/70 rounded-full text-emerald-700 text-sm font-semibold mb-7">
                            <Leaf className="w-4 h-4" />
                            CarbonIQ
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
                            Understand your carbon footprint.
                            <span className="block text-emerald-700">Change one thing that matters.</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
                            CarbonIQ helps individuals understand, track, and reduce their lifestyle footprint through one personalized high-impact action.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 mb-4">
                            <button
                                onClick={() => setPage('quiz')}
                                className="w-full sm:w-auto min-h-12 px-7 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 text-base"
                            >
                                Calculate Your CarbonIQ
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={loadDemoState}
                                className="w-full sm:w-auto min-h-12 px-7 py-4 bg-white border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                                aria-label="View demo dashboard with sample data"
                            >
                                <Play className="w-4 h-4" />
                                View Demo Dashboard
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 max-w-xl">
                            Demo dashboard uses clearly labeled sample data. Estimated lifestyle footprint for awareness, not audit-grade reporting.
                        </p>
                    </div>

                    <div className="bg-white border border-emerald-100 rounded-2xl p-5 md:p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-sm font-semibold text-emerald-700">One Lever Preview</p>
                                <h2 className="text-xl font-bold text-gray-900">Your highest-impact habit</h2>
                            </div>
                            <Brain className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="space-y-4">
                            <div className="rounded-xl bg-emerald-50 p-4">
                                <p className="text-sm text-gray-500 mb-1">Largest category</p>
                                <p className="text-2xl font-bold text-gray-900">Transport</p>
                            </div>
                            <div className="rounded-xl border border-emerald-100 p-4">
                                <p className="font-semibold text-gray-900">Swap 2 car commutes per week for public transport or carpooling.</p>
                                <p className="text-sm text-gray-600 mt-2">Approx. 180 kg CO2/year saved.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="rounded-xl bg-gray-50 p-3">
                                    <p className="text-gray-500">AI chain</p>
                                    <p className="font-semibold">Gemini to OpenRouter</p>
                                </div>
                                <div className="rounded-xl bg-gray-50 p-3">
                                    <p className="text-gray-500">Hosting</p>
                                    <p className="font-semibold">Firebase</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 pb-16 space-y-14">
                <section className="grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start">
                    <div>
                        <p className="text-sm font-bold text-emerald-700 mb-2">The problem</p>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Climate action feels hard when every tip looks equally urgent.</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {problems.map((problem) => (
                            <div key={problem} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-3" />
                                <p className="text-gray-700 leading-relaxed">{problem}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <p className="text-sm font-bold text-emerald-700 mb-2">How it works</p>
                        <h2 className="text-2xl md:text-3xl font-bold">From footprint awareness to one tracked action</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {steps.map(({ icon: Icon, label, desc }, index) => (
                            <div key={label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                    <Icon className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div className="text-xs font-bold text-emerald-600 mb-1">Step {index + 1}</div>
                                <h3 className="font-semibold text-gray-900 mb-2">{label}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
                        <Target className="w-8 h-8 text-emerald-600 mb-4" />
                        <h2 className="text-2xl font-bold mb-3">Why One Lever?</h2>
                        <p className="text-gray-600 leading-relaxed">
                            CarbonIQ keeps the reduction plan focused. It identifies the category driving the biggest share of your estimate and turns that into one concrete behavior you can track.
                        </p>
                    </div>
                    <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                        <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
                        <h2 className="text-2xl font-bold mb-3">Google-first, resilient AI</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Built with Gemini-first AI logic, OpenRouter fallback for resilience, static fallback for safety, and deployed on Firebase Hosting on Google Cloud infrastructure.
                        </p>
                    </div>
                </section>
            </main>

            <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
                CarbonIQ - Personal carbon awareness for individuals, not enterprises.
            </footer>
        </div>
    );
}
