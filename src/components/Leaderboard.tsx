import React, { useState, useEffect } from 'react';
import { UserProfile, AcademicLevel } from '../types';
import { useLanguage } from '../LanguageContext';
import { Trophy, Medal, Flame, Crown, Sparkles, Star, BookOpen, Zap, Target, Award, RefreshCw } from 'lucide-react';
import { fetchLeaderboardFromFirestore, isFirebaseConfigured } from '../firebase';

interface LeaderboardProps {
  currentUser: UserProfile;
}

export interface LeaderboardStudent {
  id: string;
  rank: number;
  name: string;
  level: AcademicLevel;
  board: string;
  points: number;
  quizzesSolved: number;
  chaptersMastered: number;
  streakDays: number;
  isCurrentUser?: boolean;
  avatarBg: string;
}

type SortCriterion = 'points' | 'quizzes' | 'chapters';

const BASE_TOP_STUDENTS: LeaderboardStudent[] = [
  {
    id: 'b1',
    rank: 1,
    name: 'আরিফুর রহমান (Dhaka College)',
    level: 'HSC',
    board: 'Dhaka Board',
    points: 1850,
    quizzesSolved: 64,
    chaptersMastered: 18,
    streakDays: 18,
    avatarBg: 'bg-blue-900 text-white',
  },
  {
    id: 'b2',
    rank: 2,
    name: 'নুসরাত জাহান (Chattogram College)',
    level: 'HSC',
    board: 'Chattogram Board',
    points: 1620,
    quizzesSolved: 58,
    chaptersMastered: 16,
    streakDays: 14,
    avatarBg: 'bg-slate-300 text-white',
  },
  {
    id: 'b3',
    rank: 3,
    name: 'সাদমান সাকিব (Rajshahi Collegiate)',
    level: 'SSC',
    board: 'Rajshahi Board',
    points: 1490,
    quizzesSolved: 51,
    chaptersMastered: 15,
    streakDays: 12,
    avatarBg: 'bg-amber-700 text-white',
  },
  {
    id: 'b4',
    rank: 4,
    name: 'মেহজাবীন সুলতানা (Sylhet MC College)',
    level: 'HSC',
    board: 'Sylhet Board',
    points: 1310,
    quizzesSolved: 44,
    chaptersMastered: 13,
    streakDays: 9,
    avatarBg: 'bg-blue-900 text-white',
  },
  {
    id: 'b5',
    rank: 5,
    name: 'ফাহিম আহমেদ (Cumilla Zilla School)',
    level: 'SSC',
    board: 'Cumilla Board',
    points: 1180,
    quizzesSolved: 40,
    chaptersMastered: 11,
    streakDays: 8,
    avatarBg: 'bg-emerald-600 text-white',
  },
  {
    id: 'b6',
    rank: 6,
    name: 'আনিকা মেহেরাজ (Barishal BM College)',
    level: 'HSC',
    board: 'Barishal Board',
    points: 1050,
    quizzesSolved: 36,
    chaptersMastered: 10,
    streakDays: 7,
    avatarBg: 'bg-emerald-700 text-white',
  },
  {
    id: 'b7',
    rank: 7,
    name: 'রাফসান আল দীন (Jashore Zilla School)',
    level: 'SSC',
    board: 'Jashore Board',
    points: 920,
    quizzesSolved: 31,
    chaptersMastered: 9,
    streakDays: 6,
    avatarBg: 'bg-emerald-800 text-white',
  },
  {
    id: 'b8',
    rank: 8,
    name: 'সামিয়া পারভীন (Dinajpur Govt. College)',
    level: 'HSC',
    board: 'Dinajpur Board',
    points: 840,
    quizzesSolved: 28,
    chaptersMastered: 8,
    streakDays: 5,
    avatarBg: 'bg-blue-900 text-white',
  },
  {
    id: 'b9',
    rank: 9,
    name: 'মাহির ফয়সাল (Mymensingh Zilla School)',
    level: 'SSC',
    board: 'Mymensingh Board',
    points: 760,
    quizzesSolved: 25,
    chaptersMastered: 7,
    streakDays: 4,
    avatarBg: 'bg-teal-700 text-white',
  },
  {
    id: 'b10',
    rank: 10,
    name: 'তাসনিম আক্তার (Viqarunnisa Noon)',
    level: 'HSC',
    board: 'Dhaka Board',
    points: 690,
    quizzesSolved: 22,
    chaptersMastered: 6,
    streakDays: 4,
    avatarBg: 'bg-teal-800 text-white',
  },
];

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const { lang, t } = useLanguage();
  const [filterLevel, setFilterLevel] = useState<'ALL' | AcademicLevel>('ALL');
  const [sortBy, setSortBy] = useState<SortCriterion>('points');
  const [firestoreUsers, setFirestoreUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load real student profiles from Firestore
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchLeaderboardFromFirestore(filterLevel === 'ALL' ? undefined : filterLevel);
        if (isMounted && Array.isArray(data)) {
          setFirestoreUsers(data);
        }
      } catch (e) {
        console.warn('Leaderboard live sync info:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [filterLevel]);

  // Merge Firestore students with base list
  const combinedMap = new Map<string, LeaderboardStudent>();

  BASE_TOP_STUDENTS.forEach((student) => {
    combinedMap.set(student.id, student);
  });

  firestoreUsers.forEach((fbUser) => {
    if (fbUser.name && fbUser.points !== undefined) {
      const fbId = fbUser.id || fbUser.uid || `fb-${fbUser.name}`;
      const solved = Math.max(1, (fbUser.quizHistory?.length || fbUser.dailyQuizCount || 0));
      const mastered = Math.max(1, Math.floor((fbUser.points || 0) / 40));
      combinedMap.set(fbId, {
        id: fbId,
        rank: 0,
        name: fbUser.name,
        level: fbUser.academicLevel || 'HSC',
        board: fbUser.board || 'Dhaka Board',
        points: fbUser.points || 0,
        quizzesSolved: solved,
        chaptersMastered: mastered,
        streakDays: fbUser.streakDays || 1,
        isCurrentUser: fbUser.uid === currentUser.uid,
        avatarBg: 'bg-emerald-600 text-white',
      });
    }
  });

  // Inject / update current user
  const userSolvedQuizzes = Math.max(1, (currentUser.quizHistory?.length || currentUser.dailyQuizCount * 3 || 6));
  const userMasteredChapters = Math.max(1, Math.floor(currentUser.points / 40));
  const curUserId = currentUser.uid || 'current_user';

  combinedMap.set(curUserId, {
    id: curUserId,
    rank: 0,
    name: `${currentUser.name} (${t('youBadge')})`,
    level: currentUser.academicLevel,
    board: 'Dhaka Board',
    points: currentUser.points,
    quizzesSolved: userSolvedQuizzes,
    chaptersMastered: userMasteredChapters,
    streakDays: currentUser.streakDays,
    isCurrentUser: true,
    avatarBg: 'bg-blue-900 text-white',
  });

  const fullList = Array.from(combinedMap.values());

  // Filter list by SSC / HSC
  const categoryStudents = fullList.filter((s) => filterLevel === 'ALL' || s.level === filterLevel);

  // Sort list dynamically according to chosen criterion
  const sortedStudents = categoryStudents
    .sort((a, b) => {
      if (sortBy === 'points') return b.points - a.points;
      if (sortBy === 'quizzes') return b.quizzesSolved - a.quizzesSolved;
      return b.chaptersMastered - a.chaptersMastered;
    })
    .map((s, idx) => ({ ...s, rank: idx + 1 }));

  const top10 = sortedStudents.slice(0, 10);
  const userRankObj = sortedStudents.find((s) => s.isCurrentUser);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-xl bg-blue-900 text-white font-black flex items-center justify-center shadow-lg shadow-blue-900/20 border border-blue-900">
          <Trophy className="w-4 h-4 fill-white" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-xl bg-slate-300 text-slate-900 font-black flex items-center justify-center shadow border border-slate-200">
          <Medal className="w-4 h-4 text-slate-900" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-700 text-amber-100 font-black flex items-center justify-center shadow border border-amber-600">
          <Medal className="w-4 h-4 text-slate-500" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-white text-slate-500 font-mono font-extrabold text-xs flex items-center justify-center border border-slate-200 shadow-sm">
        #{rank}
      </div>
    );
  };

  return (
    <div className="bg-white p-5 sm:p-7 rounded-3xl border border-slate-200 shadow-2xl space-y-6 text-slate-900">
      {/* Header Banner */}
      <div className="space-y-3 border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-slate-200 text-blue-900 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Crown className="w-3.5 h-3.5 text-blue-900" /> {t('leaderboardTitle')}
            </div>
            <h3 className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              National Board Exam Leaderboard <Sparkles className="w-5 h-5 text-blue-900" />
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('leaderboardSubtitle')}
            </p>
          </div>

          {/* SSC / HSC Category Filter */}
          <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shrink-0 self-start sm:self-auto shadow-sm">
            {(['ALL', 'SSC', 'HSC'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                  filterLevel === lvl
                    ? 'bg-blue-900 text-white shadow-md font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {lvl === 'ALL' ? t('allCategories') : `${lvl}`}
              </button>
            ))}
          </div>
        </div>

        {/* Ranking Criteria Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={() => setSortBy('points')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              sortBy === 'points'
                ? 'bg-blue-900 text-white border-emerald-400 shadow-lg shadow-blue-900/20'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-blue-900" />
            <span>{t('topPoints')}</span>
          </button>

          <button
            onClick={() => setSortBy('quizzes')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              sortBy === 'quizzes'
                ? 'bg-blue-900 text-white border-emerald-400 shadow-lg shadow-blue-900/20'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-blue-900" />
            <span>{t('topQuizzes')}</span>
          </button>

          <button
            onClick={() => setSortBy('chapters')}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              sortBy === 'chapters'
                ? 'bg-blue-900 text-white border-emerald-400 shadow-lg shadow-blue-900/20'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-900" />
            <span>{t('topChapters')}</span>
          </button>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {top10.slice(0, 3).map((student) => (
          <div
            key={student.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden ${
              student.rank === 1
                ? 'bg-gradient-to-b from-orange-50 to-orange-100 border-orange-200 shadow-xl shadow-blue-900/20'
                : student.rank === 2
                ? 'bg-gradient-to-b from-slate-50 to-slate-200 border-slate-300'
                : 'bg-gradient-to-b from-orange-50/50 to-orange-100/50 border-orange-200'
            }`}
          >
            <div className="flex items-center justify-between">
              {getRankBadge(student.rank)}
              <span className="text-[10px] bg-white text-slate-500 px-2.5 py-0.5 rounded-full font-mono border border-slate-200 font-bold shadow-sm">
                {student.level} • {student.board}
              </span>
            </div>

            <div className="my-3 space-y-1">
              <h4 className="font-bold text-sm text-slate-900 truncate flex items-center gap-1.5">
                {student.name}
                {student.isCurrentUser && (
                  <span className="text-[9px] bg-blue-900 text-white font-black px-1.5 py-0.2 rounded">
                    YOU
                  </span>
                )}
              </h4>

              <p className="text-xs font-mono font-black text-blue-900 flex items-center gap-1">
                {sortBy === 'points' && (
                  <>
                    <Star className="w-3.5 h-3.5 fill-blue-900 text-blue-900 text-blue-900" /> {student.points} Points
                  </>
                )}
                {sortBy === 'quizzes' && (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-blue-900 text-blue-900 text-blue-900" /> {student.quizzesSolved} Quizzes Solved
                  </>
                )}
                {sortBy === 'chapters' && (
                  <>
                    <BookOpen className="w-3.5 h-3.5 text-blue-900" /> {student.chaptersMastered} Chapters Mastered
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200 pt-2 font-mono">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-blue-900 fill-blue-900 text-blue-900" />
                {student.streakDays}d Streak
              </span>
              <span className="text-slate-500">
                {student.quizzesSolved} Quizzes • {student.chaptersMastered} Ch.
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ranks 4 to 10 List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {filterLevel === 'ALL'
              ? (lang === 'en' ? 'Top 10 National Rankings' : 'টপ ১০ মেধা তালিকা')
              : `${filterLevel} ${lang === 'en' ? 'Category Top 10' : 'ক্যাটাগরি টপ ১০'}`} (Rank 4 - 10)
          </h4>
          <span className="text-[10px] font-mono text-slate-500">
            {lang === 'en' ? 'Criteria: ' : 'র‍্যাঙ্কিং ক্রাইটেরিয়া: '}{sortBy}
          </span>
        </div>

        <div className="space-y-2">
          {top10.slice(3).map((student) => (
            <div
              key={student.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                student.isCurrentUser
                  ? 'bg-blue-50 border-blue-900 text-white ring-1 ring-blue-900/50 shadow-lg'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {getRankBadge(student.rank)}

                <div className={`w-9 h-9 ${student.avatarBg} font-black rounded-xl flex items-center justify-center text-xs shrink-0 shadow`}>
                  {student.name.charAt(0)}
                </div>

                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{student.name}</span>
                    {student.isCurrentUser && (
                      <span className="text-[9px] bg-blue-900 text-white font-black px-1.5 py-0.2 rounded">
                        YOU
                      </span>
                    )}
                  </h5>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {student.level} • {student.board}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-6 text-right shrink-0">
                <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-blue-900" /> {student.quizzesSolved} Quizzes
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-500" /> {student.chaptersMastered} Ch.
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black font-mono text-blue-900">
                    {sortBy === 'points' && `${student.points} pts`}
                    {sortBy === 'quizzes' && `${student.quizzesSolved} quizzes`}
                    {sortBy === 'chapters' && `${student.chaptersMastered} ch.`}
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase font-bold">
                    Rank #{student.rank}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Status Summary Card */}
      {userRankObj && (
        <div className="p-4 bg-blue-900/15 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-900 text-white font-black flex items-center justify-center text-sm shadow">
              #{userRankObj.rank}
            </div>
            <div>
              <p className="font-bold text-slate-900 text-sm">{currentUser.name} ({lang === 'en' ? 'Your Position' : 'আপনার পজিশন'})</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {currentUser.points} Points • {userSolvedQuizzes} Quizzes Solved • {userMasteredChapters} Chapters Mastered
              </p>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-blue-900 font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            {lang === 'en' ? 'Take quizzes to climb up the Leaderboard! 🚀' : 'কুইজ টেস্ট দিয়ে লিডারবোর্ডে এগিয়ে যান! 🚀'}
          </div>
        </div>
      )}
    </div>
  );
};
