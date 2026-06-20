import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { QUIZ_QUESTIONS } from '../utils/quizData';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function Quiz() {
    const {
        quizAnswers,
        setQuizAnswer,
        setUserName,
        setPage,
        calculateQuizFootprint,
        generateInsight,
        setQuizSubmitting,
        quizSubmitting,
        user,
    } = useAppStore();

    const [step, setStep] = useState(0);
    const [showNameInput, setShowNameInput] = useState(true);
    const [validationError, setValidationError] = useState('');
    const [nameValue, setNameValue] = useState(user?.display_name === 'You' ? '' : user?.display_name || '');

    const isNameStep = showNameInput && step === 0;
    const questionIndex = showNameInput ? -1 : step;
    const totalSteps = QUIZ_QUESTIONS.length;
    const progress = isNameStep ? 0 : Math.round(((step + 1) / totalSteps) * 100);

    const currentQuestion = !isNameStep && questionIndex >= 0 && questionIndex < totalSteps
        ? QUIZ_QUESTIONS[questionIndex]
        : null;

    const currentAnswer = currentQuestion
        ? (quizAnswers as Record<string, string>)[currentQuestion.id]
        : undefined;

    const handleNameSubmit = () => {
        setUserName(nameValue || 'You');
        setShowNameInput(false);
        setStep(0);
    };

    const handleSelect = (value: string) => {
        if (!currentQuestion) return;
        setQuizAnswer(currentQuestion.id, value);
        setValidationError('');
    };

    const handleNext = () => {
        if (isNameStep) {
            handleNameSubmit();
            return;
        }

        if (!currentAnswer) {
            setValidationError('Choose one option to continue.');
            return;
        }

        if (step < totalSteps - 1) {
            setValidationError('');
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step === 0 && !showNameInput) {
            setShowNameInput(true);
            setStep(0);
        } else if (step > 0) {
            setValidationError('');
            setStep(step - 1);
        }
    };

    const handleSubmit = async () => {
        if (!currentAnswer) {
            setValidationError('Choose one option to continue.');
            return;
        }
        setValidationError('');
        setQuizSubmitting(true);
        try {
            calculateQuizFootprint();
            setPage('dashboard');
            // Generate insight asynchronously
            await generateInsight();
        } finally {
            setQuizSubmitting(false);
        }
    };

    if (quizSubmitting) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Calculating your estimated footprint…</h2>
                    <p className="text-gray-500">Finding your One Lever insight…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            <div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
                {/* Progress */}
                {!isNameStep && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">
                                Question {questionIndex + 1} of {totalSteps}
                            </span>
                            <span className="text-sm font-medium text-emerald-600">{progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                    {isNameStep ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to CarbonIQ</h2>
                            <p className="text-gray-500 mb-6">
                                Enter your name for the leaderboard (optional).
                            </p>
                            <input
                                type="text"
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value.slice(0, 30))}
                                placeholder="Enter your name"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-lg"
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                            <p className="text-xs text-gray-400 mt-2">Leave blank to continue as "You"</p>
                        </>
                    ) : currentQuestion ? (
                        <>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                                {currentQuestion.question}
                            </h2>
                            <div className="space-y-3">
                                {currentQuestion.options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all text-base font-medium ${currentAnswer === option.value
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                                                : 'border-gray-100 bg-gray-50/50 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50/30'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${currentAnswer === option.value
                                                        ? 'border-emerald-500 bg-emerald-500'
                                                        : 'border-gray-300'
                                                    }`}
                                            >
                                                {currentAnswer === option.value && (
                                                    <div className="w-2 h-2 bg-white rounded-full" />
                                                )}
                                            </div>
                                            {option.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : null}

                    {/* Validation error */}
                    {validationError && (
                        <div className="flex items-center gap-2 mt-4 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {validationError}
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={handleBack}
                        disabled={isNameStep}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${isNameStep
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    {isNameStep || step < totalSteps - 1 ? (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-200 hover:shadow-emerald-300 transition-all"
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-200 hover:shadow-emerald-300 transition-all"
                        >
                            See My CarbonIQ Results
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
