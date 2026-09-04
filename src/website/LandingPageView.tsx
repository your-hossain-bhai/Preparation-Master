import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { UserProfile } from '../types';
import {
  Sparkles,
  Download,
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle2,
  ShieldCheck,
  Star,
  Bot,
  Crown,
  Play,
  ArrowRight,
  ChevronRight,
  Zap,
  Globe2,
  FileCode2,
} from 'lucide-react';

interface LandingPageViewProps {
  user: UserProfile;
  onOpenWebApp: () => void;
  onOpenSubscription: () => void;
  onOpenFlutterCode: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  user,
  onOpenWebApp,
  onOpenSubscription,
  onOpenFlutterCode,
}) => {
  const { lang, t } = useLanguage();
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);

  // Quick Interactive Mini-Quiz state for landing page visitors
  const [demoSelectedOption, setDemoSelectedOption] = useState<number | null>(null);
  const [demoShowExplanation, setDemoShowExplanation] = useState(false);

  const sampleQuestion = {
    question: lang === 'en'
      ? 'Physics (HSC): A body of mass 2 kg moves at 10 m/s. What is its kinetic energy?'
      : 'পদার্থবিজ্ঞান (HSC): ২ কেজি ভরের একটি বস্তু ১০ মিটার/সেকেন্ড বেগে চললে এর গতিশক্তি কত?',
    options: lang === 'en'
      ? ['A) 50 Joules', 'B) 100 Joules', 'C) 200 Joules', 'D) 20 Joules']
      : ['ক) ৫০ জুল (50 J)', 'খ) ১০০ জুল (100 J)', 'গ) ২০০ জুল (200 J)', 'ঘ) ২০ জুল (20 J)'],
    correctIndex: 1, // 100 J
    explanation: lang === 'en'
      ? 'Formula: Kinetic Energy E_k = 1/2 * m * v² = 0.5 * 2 * (10)² = 100 Joules.'
      : 'সুত্র: গতিশক্তি E_k = ১/২ × m × v² = ০.৫ × ২ × (১০)² = ১০০ জুল।',
  };

  const handleDownloadApk = () => {
    setDownloadingApk(true);
    setApkDownloaded(false);

    // Create a mock blob download for PrepMate_BD_v2.4.apk
    setTimeout(() => {
      const dummyContent = `PrepMate BD Android Package (v2.4)
NCTB Board Exam AI Prep App
Size: 3.5 MB
bdapps Carrier Billing Enabled`;
      const blob = new Blob([dummyContent], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PrepMate_BD_v2.4.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadingApk(false);
      setApkDownloaded(true);
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-16 text-slate-900 max-w-6xl mx-auto px-3 sm:px-6">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-white to-slate-50 border border-slate-200 p-6 sm:p-12 shadow-2xl text-center space-y-6 mt-2">
        {/* Decorative ambient blur glows */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-slate-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-slate-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-blue-900 shadow-lg">
            <Sparkles className="w-4 h-4 text-blue-900 animate-pulse" />
            <span>{t('landingHeroBadge')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {t('landingTitle')}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
            {t('landingSubtitle')}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {/* Primary Action 1: Web App Online Practice */}
            <button
              onClick={onOpenWebApp}
              className="w-full sm:w-auto py-4 px-8 bg-blue-900 hover:bg-blue-800 text-white font-black rounded-2xl text-sm shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Play className="w-5 h-5 fill-[#002b24]" />
              <span>{t('openWebAppBtn')}</span>
            </button>

            {/* Primary Action 2: Direct Download APK */}
            <button
              onClick={handleDownloadApk}
              disabled={downloadingApk}
              className="w-full sm:w-auto py-4 px-7 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-2xl text-sm shadow-xl shadow-blue-900/20 border border-slate-200 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              <Download className="w-5 h-5 text-blue-900" />
              <span>{downloadingApk ? (lang === 'en' ? 'Preparing APK...' : 'APK তৈরি হচ্ছে...') : t('downloadApkBtn')}</span>
            </button>
          </div>

          {/* APK Download Success Alert */}
          {apkDownloaded && (
            <div className="mt-4 p-4 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-500 flex items-center justify-center gap-2 max-w-md mx-auto font-bold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" />
              <span>
                {lang === 'en'
                  ? 'PrepMate_BD_v2.4.apk download started! Check your downloads folder.'
                  : 'PrepMate_BD_v2.4.apk ডাউনলোড শুরু হয়েছে! ফোনের ডাউনলোডে চেক করুন।'}
              </span>
            </div>
          )}

          {/* Device icons indicator */}
          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-blue-900" /> PC & Web Browser
            </span>
            <span className="flex items-center gap-1.5">
              <Tablet className="w-4 h-4 text-blue-900" /> iPads & Tablets
            </span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-blue-900" /> Android & iPhone
            </span>
          </div>
        </div>
      </section>

      {/* 2. MULTI-DEVICE RESPONSIVE BANNER & WEB/APK FLEXIBILITY */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">
            <Globe2 className="w-3.5 h-3.5 text-blue-900" /> Cross-Platform Universal Access
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('multiDeviceTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('multiDeviceDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Option A: Web App */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between hover:border-blue-900/50 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{lang === 'en' ? 'Direct Web App' : 'সরাসরি ওয়েব অ্যাপ'}</h3>
              <p className="text-slate-500 leading-relaxed">
                {lang === 'en'
                  ? 'No installation required! Practice quizzes directly from Chrome, Safari, or Edge on PC or Mac.'
                  : 'কোনো ইনস্টলেশনের দরকার নেই! কম্পিউটার বা ফোনে ব্রাউজার খুলেই প্র্যাকটিস করুন।'}
              </p>
            </div>
            <button
              onClick={onOpenWebApp}
              className="w-full py-2.5 px-4 bg-white hover:bg-white/20 border border-slate-200 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{lang === 'en' ? 'Launch Web App' : 'ওয়েব অ্যাপ খুলুন'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-900" />
            </button>
          </div>

          {/* Option B: Android APK */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between hover:border-slate-200 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{lang === 'en' ? 'Android APK File' : 'অ্যান্ড্রয়েড এপিকে (APK)'}</h3>
              <p className="text-slate-500 leading-relaxed">
                {lang === 'en'
                  ? 'Download the lightweight v2.4 standalone package to test or use natively on your smartphone.'
                  : '৩.৫ মেগাবাইটের হালকা APK ইনস্টল করে সরাসরি অফলাইনে টেস্ট করে দেখুন।'}
              </p>
            </div>
            <button
              onClick={handleDownloadApk}
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-900" />
              <span>{lang === 'en' ? 'Download APK (3.5MB)' : 'APK ডাউনলোড (৩.৫ MB)'}</span>
            </button>
          </div>

          {/* Option C: Flutter Source Code */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 flex flex-col justify-between hover:border-blue-900/50 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-300 flex items-center justify-center">
                <FileCode2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{lang === 'en' ? 'Flutter Source Code' : 'ফ্লাটার সোর্স কোড'}</h3>
              <p className="text-slate-500 leading-relaxed">
                {lang === 'en'
                  ? 'Explore the mobile Flutter codebase, state management, and Android/iOS setup directly.'
                  : 'অ্যাপটির ফ্লাটার মোবাইল সোর্স কোড ও স্ট্রাকচার সরাসরি ব্রাউজারে দেখুন।'}
              </p>
            </div>
            <button
              onClick={onOpenFlutterCode}
              className="w-full py-2.5 px-4 bg-white hover:bg-white/20 border border-slate-200 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>{lang === 'en' ? 'Explore Flutter Code' : 'ফ্লাটার কোড দেখুন'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE QUIZ DEMO ON LANDING PAGE */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-slate-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold mb-1">
              <Zap className="w-3.5 h-3.5 text-blue-900" /> Interactive Sample Quiz
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {lang === 'en' ? 'Try a Live AI Question Right Now!' : 'সরাসরি একটি নমুনা কুইজ প্র্যাকটিস করুন'}
            </h2>
          </div>
          <button
            onClick={onOpenWebApp}
            className="py-2 px-4 bg-blue-900 hover:bg-blue-800 text-white font-black rounded-xl text-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>{lang === 'en' ? 'Try Full App' : 'ফুল কুইজ প্র্যাকটিস'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Demo Question Box */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
          <p className="text-sm font-bold text-slate-900 leading-relaxed">
            {sampleQuestion.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {sampleQuestion.options.map((opt, idx) => {
              const isSelected = demoSelectedOption === idx;
              const isCorrect = idx === sampleQuestion.correctIndex;

              let btnClass = 'bg-white/5 border-white/15 text-slate-100 hover:bg-white/15';
              if (demoSelectedOption !== null) {
                if (isCorrect) {
                  btnClass = 'bg-slate-500/30 border-emerald-400 text-slate-500 font-bold';
                } else if (isSelected) {
                  btnClass = 'bg-rose-100 border-rose-400 text-rose-700 font-bold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setDemoSelectedOption(idx);
                    setDemoShowExplanation(true);
                  }}
                  className={`p-3.5 rounded-xl border text-xs text-left transition-all ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {demoShowExplanation && (
            <div className="p-4 bg-white rounded-2xl border border-slate-200 text-xs space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Bot className="w-4 h-4 text-blue-900" />
                <span>Gemini AI Tutor Real-time Explanation:</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                {sampleQuestion.explanation}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. KEY FEATURES GRID */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {lang === 'en' ? 'Why SSC & HSC Toppers Choose PrepMate BD' : 'কেন PrepMate BD বাংলাদেশের শিক্ষার্থীদের প্রথম পছন্দ'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {lang === 'en'
              ? 'Tailored specifically for NCTB Board Examination syllabus & English Version curricula.'
              : 'এনসিটিবি কারিকুলাম ও বোর্ডের আগের বছরের প্রশ্নের আলোকে বিশেষভাবে তৈরি।'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white font-bold flex items-center justify-center shadow">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{t('feature1Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('feature1Desc')}</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white font-bold flex items-center justify-center shadow">
              <Sparkles className="w-6 h-6 text-blue-900" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{t('feature2Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('feature2Desc')}</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 text-white font-bold flex items-center justify-center shadow">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{t('feature3Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('feature3Desc')}</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white font-bold flex items-center justify-center shadow">
              <CheckCircle2 className="w-6 h-6 text-slate-900" />
            </div>
            <h3 className="font-bold text-base text-slate-900">{t('feature4Title')}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t('feature4Desc')}</p>
          </div>
        </div>
      </section>

      {/* 5. TRANSPARENT SUBSCRIPTION & 1-CLICK UNSUBSCRIBE GUARANTEE */}
      <section className="bg-gradient-to-br from-blue-50 to-slate-50 border border-slate-200 p-6 sm:p-10 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-slate-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold">
            <Crown className="w-3.5 h-3.5 text-blue-900" /> Fair Billing Policy
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {lang === 'en' ? 'bdapps Robi & Airtel Carrier Billing' : 'bdapps রবি ও এয়ারটেল মোবাইল বিলিং'}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {lang === 'en'
              ? 'Only BDT 2.00/day directly from mobile balance. Try it out anytime! If you find it unhelpful, cancel with 1-click instantly.'
              : 'প্রতিদিন মাত্র ২.০০ টাকা সিমের ব্যালেন্স থেকে। টেস্ট করে দেখুন, পছন্দ না হলে যেকোনো সময় ১-ক্লিকেই সাবস্ক্রিপশন বন্ধ করুন।'}
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 max-w-md mx-auto space-y-4 text-xs shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-900">{lang === 'en' ? 'Price / Day:' : 'দৈনিক চার্জ:'}</span>
            <span className="font-mono font-extrabold text-blue-900 text-sm">2.00 BDT (+VAT)</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-900">{lang === 'en' ? 'Supported Operators:' : 'সাপোর্টেড সিম:'}</span>
            <span className="font-bold text-slate-500">Robi & Airtel</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="font-bold text-slate-900">{lang === 'en' ? 'Cancellation Policy:' : 'সাবস্ক্রিপশন বাতিল নীতি:'}</span>
            <span className="font-bold text-blue-900">{lang === 'en' ? 'Instant 1-Click Unsubscribe' : '১-ক্লিকে তাৎক্ষণিক বাতিল'}</span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={onOpenSubscription}
              className="flex-1 py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Crown className="w-4 h-4" />
              <span>{t('subNowBtn')}</span>
            </button>
            <button
              onClick={onOpenSubscription}
              className="py-3 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1"
            >
              <span>{lang === 'en' ? 'Unsubscribe' : 'আনসাবস্ক্রাইব'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. STUDENT REVIEWS / TESTIMONIALS */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900">
          {t('testimonialTitle')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-3">
            <div className="flex items-center gap-1 text-blue-900">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-blue-900 text-blue-900" />
              ))}
            </div>
            <p className="text-xs text-slate-100 italic leading-relaxed">
              "{t('testimonial1Text')}"
            </p>
            <p className="text-xs font-bold text-slate-500 pt-1">
              — {t('testimonial1Name')}
            </p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xl space-y-3">
            <div className="flex items-center gap-1 text-blue-900">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-blue-900 text-blue-900" />
              ))}
            </div>
            <p className="text-xs text-slate-100 italic leading-relaxed">
              "{t('testimonial2Text')}"
            </p>
            <p className="text-xs font-bold text-slate-500 pt-1">
              — {t('testimonial2Name')}
            </p>
          </div>
        </div>
      </section>

      {/* 7. FOOTER CTA */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-2xl text-center space-y-4">
        <h3 className="text-xl font-extrabold text-slate-900">
          {lang === 'en' ? 'Ready to Ace Your Board Exams?' : 'আপনার বোর্ড পরীক্ষার প্রস্তুতি এখনই শুরু করুন!'}
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenWebApp}
            className="py-3.5 px-6 bg-blue-900 hover:bg-blue-800 text-white font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg"
          >
            <Play className="w-4 h-4 fill-[#002b24]" /> {t('openWebAppBtn')}
          </button>
          <button
            onClick={handleDownloadApk}
            className="py-3.5 px-6 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4 text-blue-900" /> {t('downloadApkBtn')}
          </button>
        </div>
      </section>
    </div>
  );
};
