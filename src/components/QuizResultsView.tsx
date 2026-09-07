import React, { useState } from 'react';
import { QuizQuestion, UserProfile } from '../types';
import { useLanguage } from '../LanguageContext';
import { Award, CheckCircle2, XCircle, RotateCcw, Bot, Sparkles, ChevronDown, ChevronUp, Loader2, Share2, Check, Copy } from 'lucide-react';
import { cleanMathText } from '../utils/mathFormatter';

interface QuizResultsViewProps {
  user: UserProfile;
  subject: string;
  chapter: string;
  userAnswers: { question: QuizQuestion; selectedIndex: number | null; timeSpentSec: number }[];
  earnedBonusXp?: number;
  onRestartQuiz: () => void;
  onOpenCommunity: () => void;
}

export const QuizResultsView: React.FC<QuizResultsViewProps> = ({
  user,
  subject,
  chapter,
  userAnswers,
  earnedBonusXp = 0,
  onRestartQuiz,
  onOpenCommunity,
}) => {
  const { lang, t } = useLanguage();
  const [expandedAiExplanation, setExpandedAiExplanation] = useState<Record<string, string>>({});
  const [loadingAiId, setLoadingAiId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const totalQuestions = userAnswers.length;
  const correctCount = userAnswers.filter(
    (ans) => ans.selectedIndex === ans.question.correctIndex
  ).length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const handleShareAchievement = async () => {
    const summaryText =
      lang === 'en'
        ? `🏆 Prepmate BD - Board Exam Quiz Achievement!\n📚 Subject: ${subject} (${chapter})\n🎯 Score: ${correctCount}/${totalQuestions} (${scorePercentage}% Accuracy)\n🎓 Level: ${user.academicLevel} ${user.group || ''}\n⚡ Points Earned: +${correctCount * 10 + earnedBonusXp} XP\n\nJoin Bangladesh's premier AI Board Exam Preparation platform at Prepmate BD!`
        : `🏆 প্রেপমেট বিডি - বোর্ড এক্সাম কুইজ ফলাফল!\n📚 বিষয়: ${subject} (${chapter})\n🎯 স্কোর: ${correctCount}/${totalQuestions} (${scorePercentage}% নির্ভুলতা)\n🎓 লেভেল: ${user.academicLevel} ${user.group || ''}\n⚡ অর্জিত পয়েন্ট: +${correctCount * 10 + earnedBonusXp} এক্সপি\n\nবাংলাদেশের সেরা এআই বোর্ড পরীক্ষা প্রস্তুত ফোরাম প্রেপমেট বিডিতে আজই যোগ দিন!`;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(summaryText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = summaryText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Copy error:', err);
    }
  };

  const handleAskAiTutor = async (q: QuizQuestion, selectedIndex: number | null) => {
    if (expandedAiExplanation[q.id]) {
      // Toggle off
      const updated = { ...expandedAiExplanation };
      delete updated[q.id];
      setExpandedAiExplanation(updated);
      return;
    }

    setLoadingAiId(q.id);
    try {
      const selectedText = selectedIndex !== null ? q.options[selectedIndex] : 'Not Answered';
      const correctText = q.options[q.correctIndex];

      const res = await fetch('/api/tutor/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          selectedOption: selectedText,
          correctOption: correctText,
          subject,
          academicLevel: user.academicLevel,
          language: lang,
        }),
      });

      const data = await res.json();
      setExpandedAiExplanation((prev) => ({
        ...prev,
        [q.id]: data.explanation,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAiId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Score Summary Card */}
      <div className="bg-white border border-slate-200 text-slate-900 p-6 sm:p-8 rounded-3xl shadow-2xl text-center space-y-5">
        <div className="w-16 h-16 bg-blue-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-900/20">
          <Award className="w-9 h-9" />
        </div>

        <div>
          <span className="text-[11px] font-bold text-blue-900 bg-blue-50 border border-slate-200 px-3 py-1 rounded-full uppercase tracking-wider">
            {user.academicLevel} Board Exam Quiz Results
          </span>
          <h2 className="text-2xl font-extrabold mt-2 text-slate-900">{subject}</h2>
          <p className="text-xs text-slate-500">{chapter}</p>
        </div>

        {earnedBonusXp > 0 && (
          <div className="bg-blue-50 border-2 border-slate-200 p-4 rounded-2xl text-center shadow-xl space-y-1 animate-bounce">
            <div className="inline-flex items-center gap-1.5 text-blue-900 font-black text-sm uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-blue-900" /> 🔥 {lang === 'en' ? 'Daily Challenge Cleared!' : 'ডেইলি চ্যালেঞ্জ বিজয়ী!'}
            </div>
            <p className="text-xs font-bold text-slate-900">
              {lang === 'en'
                ? `You earned +${earnedBonusXp} Bonus XP for today's challenge!`
                : `আপনি আজকের চ্যালেঞ্জ বিজয়ী হয়ে +${earnedBonusXp} বোনাস এক্সপি পেয়েছেন!`}
            </p>
          </div>
        )}

        {/* Score Circle */}
        <div className="flex justify-center items-center gap-4 sm:gap-6 py-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center min-w-[110px] shadow-lg">
            <p className="text-3xl font-extrabold text-blue-900">
              {correctCount} / {totalQuestions}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
              {t('correctAnswersCount')}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center min-w-[110px] shadow-lg">
            <p className="text-3xl font-extrabold text-slate-500">{scorePercentage}%</p>
            <p className="text-[11px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
              {lang === 'en' ? 'Accuracy Rate' : 'অ্যাকিউরেসি রেট'}
            </p>
          </div>
        </div>

        {/* Board Performance Estimate */}
        <p className="text-xs text-slate-900 bg-white border border-slate-200 py-3 px-4 rounded-2xl max-w-md mx-auto leading-relaxed shadow-sm">
          {scorePercentage >= 80
            ? (lang === 'en' ? '🎉 Excellent performance! On track for A+ in Board Exams.' : '🎉 চমৎকার প্রস্তুতি! ঢাকা বোর্ড গ্রেড: A+ নিশ্চিতের পথে।')
            : scorePercentage >= 50
            ? (lang === 'en' ? '👍 Good progress! Review a few core concepts to hit top marks.' : '👍 ভালো পারফরম্যান্স! কিছু বেসিক টপিকে আরও অনুশীলন প্রয়োজন।')
            : (lang === 'en' ? '💡 Keep practicing! Solve previous years board questions for better clarity.' : '💡 আরও মনোযোগ দিন! বোর্ডের আগের বছরের কুইজগুলো প্র্যাকটিস করুন।')}
        </p>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button
            onClick={handleShareAchievement}
            className="py-3 px-5 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-900 hover:to-blue-800 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-blue-900" />
                <span>{lang === 'en' ? 'Copied to Clipboard!' : 'কপি হয়েছে! 📋'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-blue-900" />
                <span>{lang === 'en' ? 'Share Achievement' : 'ফলাফল শেয়ার করুন'}</span>
              </>
            )}
          </button>
          <button
            onClick={onRestartQuiz}
            className="py-3 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-2xl text-xs flex items-center gap-2 transition-all shadow"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" /> {t('retakeQuizBtn')}
          </button>
          <button
            onClick={onOpenCommunity}
            className="py-3 px-5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 transition-all shadow-lg"
          >
            {t('discussCommunityBtn')}
          </button>
        </div>
      </div>

      {/* Questions Breakdown */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center justify-between border-b border-slate-200 pb-3">
          <span>{t('explanationTitle')}</span>
          <span className="text-xs font-semibold text-slate-500">{totalQuestions} {t('questionsCountSuffix')}</span>
        </h3>

        <div className="space-y-4">
          {userAnswers.map((ans, idx) => {
            const isCorrect = ans.selectedIndex === ans.question.correctIndex;

            return (
              <div
                key={ans.question.id}
                className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-3 transition-all ${
                  isCorrect
                    ? 'border-slate-200 bg-slate-50'
                    : 'border-rose-200 bg-rose-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <p className="font-bold text-slate-900 text-sm leading-relaxed">{cleanMathText(ans.question.question)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-500">{lang === 'en' ? 'Your Answer: ' : 'আপনার উত্তর: '}</span>
                    <span className={isCorrect ? 'font-bold text-blue-900' : 'font-bold text-rose-700'}>
                      {ans.selectedIndex !== null ? cleanMathText(ans.question.options[ans.selectedIndex]) : (lang === 'en' ? 'Not Answered' : 'উত্তর দেননি')}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">{lang === 'en' ? 'Correct Answer: ' : 'সঠিক উত্তর: '}</span>
                    <span className="font-bold text-slate-500">
                      {cleanMathText(ans.question.options[ans.question.correctIndex])}
                    </span>
                  </div>
                </div>

                {/* AI Tutor Button */}
                <div>
                  <button
                    onClick={() => handleAskAiTutor(ans.question, ans.selectedIndex)}
                    disabled={loadingAiId === ans.question.id}
                    className="w-full py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 font-bold rounded-xl flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2 text-xs">
                      <Bot className="w-4 h-4 text-blue-900" />
                      {lang === 'en' ? 'Gemini AI Tutor: Ask for deep explanation?' : 'Gemini AI Tutor: স্টেপ-বাই-স্টেপ ব্যাখ্যা চান?'}
                    </span>
                    {loadingAiId === ans.question.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-900" />
                    ) : expandedAiExplanation[ans.question.id] ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {/* Expanded Gemini Explanation */}
                  {expandedAiExplanation[ans.question.id] && (
                    <div className="mt-2.5 p-4 bg-white text-slate-900 rounded-2xl space-y-2 border border-slate-200 text-xs leading-relaxed shadow-inner">
                      <div className="flex items-center gap-1.5 text-blue-900 font-bold border-b border-slate-200 pb-2">
                        <Sparkles className="w-4 h-4 text-blue-900" /> Gemini AI Tutor Explanation:
                      </div>
                      <div className="whitespace-pre-line text-slate-500 leading-relaxed pt-1">
                        {cleanMathText(expandedAiExplanation[ans.question.id])}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
