import { lazy, Suspense, useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import Navbar from './components/Navbar';

const Landing = lazy(() => import('./pages/Landing'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Challenges = lazy(() => import('./pages/Challenges'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const StoryCard = lazy(() => import('./pages/StoryCard'));

function App() {
    const { currentPage, hydrate } = useAppStore();

    useEffect(() => {
        hydrate();
    }, []);

    const renderPage = () => {
        switch (currentPage) {
            case 'landing':
                return <Landing />;
            case 'quiz':
                return <Quiz />;
            case 'dashboard':
                return <Dashboard />;
            case 'challenges':
                return <Challenges />;
            case 'leaderboard':
                return <Leaderboard />;
            case 'story':
                return <StoryCard />;
            default:
                return <Landing />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                        <div className="text-sm font-medium text-emerald-700">Loading CarbonIQ...</div>
                    </div>
                }
            >
                {renderPage()}
            </Suspense>
        </div>
    );
}

export default App;
