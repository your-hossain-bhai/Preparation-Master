import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { useLanguage } from '../LanguageContext';
import { playReminderChime } from '../utils/notificationAudio';
import {
  Bell,
  BellRing,
  Clock,
  Check,
  X,
  Sparkles,
  ShieldAlert,
  Flame,
  Volume2,
  Send,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface StudyReminderModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const StudyReminderModal: React.FC<StudyReminderModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
}) => {
  const { lang } = useLanguage();
  const isEnglish = lang === 'en';

  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default';
  });

  const [enabled, setEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('prepmate_reminder_enabled');
    return saved !== null ? JSON.parse(saved) : user.reminderEnabled ?? true;
  });

  const [time, setTime] = useState<string>(() => {
    return localStorage.getItem('prepmate_reminder_time') || user.reminderTime || '20:00';
  });

  const [testSent, setTestSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  
  const requestNotificationPermission = async () => {
    try {
      if (!('Notification' in window)) {
        setErrorMessage(isEnglish ? 'Browser does not support notifications.' : 'ব্রাউজার নোটিফিকেশন সাপোর্ট করে না।');
        return;
      }

      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        setErrorMessage(null);
        // await subscribeToPushNotifications(); // Subscribe to Server Push when granted
        new Notification(
          isEnglish ? 'Notifications Allowed! 🎉' : 'নোটিফিকেশন চালু হয়েছে! 🎉',
          {
            body: isEnglish ? 'You will now receive daily study reminders.' : 'এখন থেকে আপনি প্রতিদিন রিমাইন্ডার পাবেন।',
            icon: '/icon.png',
          }
        );
      } else {
        setErrorMessage(
          isEnglish
            ? 'Permission denied. Please allow notifications from site settings.'
            : 'পারমিশন দেওয়া হয়নি। দয়া করে ব্রাউজার সেটিংস থেকে নোটিফিকেশন অ্যালাউ করুন।'
        );
      }
    } catch (err) {
      console.error('Failed to request permission', err);
    }
  };


  const handleToggleEnable = async () => {
    if (!enabled) {
      if (permission !== 'granted' && typeof window !== 'undefined' && 'Notification' in window) {
        await requestNotificationPermission();
      } else {
        playReminderChime();
        setEnabled(true);
        localStorage.setItem('prepmate_reminder_enabled', 'true');
        onUpdateUser({ reminderEnabled: true });
      }
    } else {
      setEnabled(false);
      localStorage.setItem('prepmate_reminder_enabled', 'false');
      onUpdateUser({ reminderEnabled: false });
    }
  };

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    localStorage.setItem('prepmate_reminder_time', newTime);
    onUpdateUser({ reminderTime: newTime });
  };

  
  const handleSendTestNotification = async () => {
    // Attempt Server Push (like Facebook/Instagram)
    try {
      await fetch('/api/push/test', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 animate-in fade-in duration-200">
      <div className="bg-slate-50 border border-slate-200 text-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-800 text-white flex items-center justify-center font-black shadow-lg shrink-0">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-blue-900 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEnglish ? 'Daily Study Reminder' : 'ডেইলি স্টাডি রিমাইন্ডার'}</span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {isEnglish ? 'Set Daily Practice Alert' : 'দৈনিক পড়ালেখার রিমাইন্ডার সেট করুন'}
            </h3>
          </div>
        </div>

        {/* Streak Incentive Banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div className="text-xs">
            <p className="font-extrabold text-blue-900">
              {isEnglish
                ? `Maintain your ${user.streakDays}-Day Study Streak!`
                : `আপনার ${user.streakDays} দিনের পড়ালেখার স্ট্রিক ধরে রাখুন!`}
            </p>
            <p className="text-slate-500 text-[11px] mt-0.5">
              {isEnglish
                ? 'Get notified daily so you never miss your board exam practice.'
                : 'প্রতিদিন নির্দিষ্ট সময়ে নোটিফিকেশন পেয়ে কুইজ অনুশীলন সম্পন্ন করুন।'}
            </p>
          </div>
        </div>

        {/* Browser Permission Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold">
              {isEnglish ? 'Browser Permission Status:' : 'ব্রাউজার পারমিশন স্ট্যাটাস:'}
            </span>
            {permission === 'granted' ? (
              <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-full font-black text-[11px] flex items-center gap-1">
                <Check className="w-3 h-3 text-slate-500" />
                {isEnglish ? 'Allowed 🔔' : 'অনুমোদিত 🔔'}
              </span>
            ) : permission === 'denied' ? (
              <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-full font-black text-[11px] flex items-center gap-1">
                <X className="w-3 h-3 text-rose-600" />
                {isEnglish ? 'Blocked 🚫' : 'ব্লকড 🚫'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-blue-50 border border-slate-200 text-blue-900 rounded-full font-black text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-blue-900" />
                {isEnglish ? 'Action Needed ⚡' : 'অনুমতি প্রয়োজন ⚡'}
              </span>
            )}
          </div>

          {permission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 uppercase tracking-wider"
            >
              <Bell className="w-4 h-4" />
              <span>
                {isEnglish ? 'Allow Browser Notifications' : 'ব্রাউজার নোটিফিকেশন অ্যালাউ করুন'}
              </span>
            </button>
          )}
        </div>

        {/* Time Picker & Toggle Controls */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-900" />
              <span className="text-xs font-bold text-slate-900">
                {isEnglish ? 'Enable Daily Alert' : 'ডেইলি নোটিফিকেশন চালু রাখুন'}
              </span>
            </div>
            <button
              onClick={handleToggleEnable}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                enabled ? 'bg-blue-900' : 'bg-white'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-50 transition-transform ${
                  enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-bold">
              {isEnglish ? 'Reminder Time:' : 'রিমাইন্ডার সময়:'}
            </span>
            <input
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-blue-900 font-mono font-bold text-sm focus:outline-none"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSendTestNotification}
            className="flex-1 py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white font-black rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
          >
            {testSent ? (
              <>
                <Check className="w-4 h-4" />
                <span>{isEnglish ? 'Sent!' : 'নোটিফিকেশন পাঠানো হয়েছে!'}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{isEnglish ? 'Test Notification Now' : 'টেস্ট নোটিফিকেশন পাঠান'}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-2xl text-xs transition-all"
          >
            {isEnglish ? 'Done' : 'সম্পন্ন'}
          </button>
        </div>
      </div>
    </div>
  );
};
