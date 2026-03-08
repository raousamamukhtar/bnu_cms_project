import { Button } from '../ui/Button';

export function SubmissionSuccessModal({ isOpen, onClose, onEnterNextMonth, onGoToDashboard, monthYear }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
                    Submission Successful!
                </h2>

                {/* Message */}
                <p className="text-center text-slate-600 mb-6">
                    All data for <span className="font-semibold text-emerald-600">{monthYear}</span> has been submitted successfully.
                </p>

                {/* Divider */}
                <div className="border-t border-slate-200 mb-6"></div>

                {/* Question */}
                <p className="text-center text-slate-700 font-medium mb-6">
                    What would you like to do next?
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={onEnterNextMonth}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 justify-center"
                    >
                        📅 Enter Next Month Data
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onGoToDashboard}
                        className="w-full justify-center"
                    >
                        🏠 Go to Dashboard
                    </Button>
                </div>

                {/* Close button (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label="Close"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
