import { useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getLeaderboardWithUser } from '../utils/leaderboard';
import { createStoryCardData } from '../utils/storyData';
import { possessiveName, sanitizeDisplayName } from '../utils/profile';
import {
    Download,
    Copy,
    CheckCheck,
    ArrowLeft,
    Leaf,
    Flame,
    Trophy,
    Target,
    Loader2,
    AlertCircle,
    TrendingDown,
    Link,
} from 'lucide-react';

const APP_URL = 'https://carbon-iq-1994a.web.app';

export default function StoryCard() {
    const { user, challenge, insight, footprint, setPage } = useAppStore();
    const cardRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(false);

    const userName = sanitizeDisplayName(user?.display_name);
    const ownerLabel = possessiveName(userName);
    const totalSaved = challenge?.total_saved_kg || 0;
    const streak = challenge?.streak_count || 0;
    const { userRank } = getLeaderboardWithUser(userName, totalSaved, streak);
    const storyData = createStoryCardData(challenge, insight, userRank, footprint?.total_kg_co2_year || 0, userName);
    const shareCaption = storyData.share_caption;

    if (!insight) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-4">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Leaf className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">No story card yet</h1>
                    <p className="text-gray-500 mb-6">Complete the quiz to generate your One Lever insight and story card.</p>
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

    const copyText = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = value;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
    };

    const handleCopy = async () => {
        await copyText(shareCaption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyAppLink = async () => {
        await copyText(APP_URL);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setDownloading(true);
        setDownloadError(false);
        try {
            const { toPng } = await import('html-to-image');
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });
            const link = document.createElement('a');
            link.download = storyData.download_filename;
            link.href = dataUrl;
            link.click();
        } catch {
            setDownloadError(true);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pt-20 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My CarbonIQ Story</h1>
                    <p className="text-gray-500">Share your progress with the world.</p>
                </div>

                <div className="mb-6">
                    <div
                        ref={cardRef}
                        className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden"
                    >
                        <div className="h-3 bg-gradient-to-r from-emerald-500 to-teal-500" />

                        <div className="p-5 sm:p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <Leaf className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="text-lg font-bold text-emerald-700">CarbonIQ</span>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                {ownerLabel} Carbon Story
                            </h2>
                            <p className="text-gray-500 text-sm mb-8">Personal carbon reduction progress from CarbonIQ</p>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                                <div className="bg-emerald-50 rounded-2xl p-4 sm:p-5 text-center">
                                    <TrendingDown className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                                    <div className="text-3xl font-bold text-gray-900">{totalSaved}</div>
                                    <div className="text-xs text-gray-500 mt-1">kg CO2 saved</div>
                                </div>
                                <div className="bg-orange-50 rounded-2xl p-4 sm:p-5 text-center">
                                    <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                    <div className="text-3xl font-bold text-gray-900">{streak}</div>
                                    <div className="text-xs text-gray-500 mt-1">day streak</div>
                                </div>
                                <div className="bg-amber-50 rounded-2xl p-4 sm:p-5 text-center">
                                    <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                    <div className="text-3xl font-bold text-gray-900">#{userRank}</div>
                                    <div className="text-xs text-gray-500 mt-1">leaderboard rank</div>
                                </div>
                                <div className="bg-blue-50 rounded-2xl p-4 sm:p-5 text-center">
                                    <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-gray-900 leading-tight">
                                        {storyData.annual_footprint_kg
                                            ? storyData.annual_footprint_kg.toLocaleString()
                                            : '-'}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">kg annual estimate</div>
                                </div>
                            </div>

                            <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-1">
                                    One Lever Action
                                </p>
                                <p className="text-sm font-semibold text-gray-900">{storyData.biggest_win}</p>
                                <p className="text-xs text-gray-600 mt-2">
                                    Estimated impact: {insight.one_lever.savings_estimate_kg} kg CO2 per year.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 text-center">
                                <p className="text-sm text-gray-700 italic">"{shareCaption}"</p>
                            </div>

                            <div className="mt-6 text-center text-xs text-gray-400">
                                carbon-iq-1994a.web.app - personal carbon awareness
                            </div>
                        </div>
                    </div>
                </div>

                {downloadError && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 text-sm mb-4">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        Could not download the image. You can still copy your caption.
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Share Caption</h3>
                    <div className="bg-gray-50 rounded-xl p-4 mb-3">
                        <p className="text-sm text-gray-700">{shareCaption}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-all"
                        >
                            {copied ? (
                                <>
                                    <CheckCheck className="w-4 h-4" />
                                    Caption copied!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    Copy Caption
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleCopyAppLink}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            {linkCopied ? (
                                <>
                                    <CheckCheck className="w-4 h-4" />
                                    Link copied!
                                </>
                            ) : (
                                <>
                                    <Link className="w-4 h-4" />
                                    Copy App Link
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-200 hover:shadow-emerald-300 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {downloading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating your Carbon Story...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Download Card as Image
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => setPage('dashboard')}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
