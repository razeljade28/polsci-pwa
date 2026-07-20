import React from "react";
import { Member, Event, Quest, Announcement } from "../types";
import { Calendar, BookOpen, AlertCircle, Award, ArrowRight, Shield, Sparkles, MapPin, Users, Megaphone } from "lucide-react";

interface DashboardProps {
  member: Member;
  events: Event[];
  quests: Quest[];
  announcements: Announcement[];
  members: Member[];
  onNavigate: (screen: string) => void;
  onCheckIn: () => void;
  onShowGrievance: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  member,
  events,
  quests,
  announcements,
  members,
  onNavigate,
  onCheckIn,
  onShowGrievance
}) => {
  // Gamification helpers
  const LEVELS = [
    { level: 1, exp: 0, title: "New Member" },
    { level: 2, exp: 100, title: "Active Member" },
    { level: 3, exp: 300, title: "Dedicated Member" },
    { level: 4, exp: 600, title: "Senior Member" },
    { level: 5, exp: 1000, title: "Elite Member" },
    { level: 6, exp: 1500, title: "Master Member" },
    { level: 7, exp: 2100, title: "Legend" },
  ];

  const getLevelInfo = (exp: number) => {
    let result = LEVELS[0];
    for (const lv of LEVELS) {
      if (exp >= lv.exp) result = lv;
    }
    return result;
  };

  const getNextLevelInfo = (exp: number) => {
    for (const lv of LEVELS) {
      if (exp < lv.exp) return lv;
    }
    return null;
  };

  const getProgressPercent = (exp: number) => {
    const current = getLevelInfo(exp);
    const next = getNextLevelInfo(exp);
    if (!next) return 100;
    const range = next.exp - current.exp;
    const progress = ((exp - current.exp) / range) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const level = getLevelInfo(member.exp);
  const progressPercent = getProgressPercent(member.exp);
  const nextLevel = getNextLevelInfo(member.exp);

  const completedQuestsCount = quests.filter(q => q.completed).length;

  // Next Featured Event
  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const featuredEvent = upcomingEvents[0];

  const getEventDateLabel = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      month: months[dateObj.getMonth()],
      day: dateObj.getDate()
    };
  };

  const dateLabel = featuredEvent ? getEventDateLabel(featuredEvent.date) : { month: "—", day: "—" };

  // RSVPs of featured event
  const goingCount = featuredEvent?.rsvps
    ? Object.values(featuredEvent.rsvps).filter(v => v === "going").length
    : 0;
  const capacity = featuredEvent?.capacity || 50;

  // Leaderboard ranking
  const sortedMembers = [...members].sort((a, b) => b.exp - a.exp);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-6">
      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1: Welcome & Progress (col-span-3) */}
        <div className="col-span-1 md:col-span-3 relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br from-dark-green via-primary-green to-dark-green shadow-md border border-light-green/30 flex flex-col justify-between group">
          {/* Decorative Elements */}
          <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-br from-gold-start/10 to-transparent rounded-full filter blur-xl pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-48 h-48 border-[24px] border-white/5 rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] uppercase font-bold tracking-widest text-gold-start bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                  SMC Organization Portal
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-none text-white font-display">
                {getGreeting()}, {member.name.split(" ")[0]}! 👋
              </h1>
              <p className="text-xs text-white/90 max-w-md font-medium leading-relaxed">
                Welcome back to SEPOLSCIS. Small daily milestones compose an elite participation record. Track your academic standing below.
              </p>
            </div>

            {/* Level Badge Shield */}
            <div className="flex-shrink-0 flex items-center md:justify-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-4 rounded-xl shadow-inner md:w-36 text-center">
              <div className="space-y-0.5 flex-1 md:flex-none">
                <span className="text-[9px] text-white/80 font-extrabold uppercase tracking-widest block leading-none">LEVEL</span>
                <strong className="text-3xl font-extrabold block text-gold-start">{level.level}</strong>
                <span className="text-[10px] font-bold text-white uppercase block tracking-wider leading-none mt-1">{level.title}</span>
              </div>
            </div>
          </div>

          {/* EXP Bar */}
          <div className="relative z-10 mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-between items-center text-xs font-bold text-white/90">
              <span>{member.exp} Total EXP Gained</span>
              {nextLevel ? (
                <span>{nextLevel.exp - member.exp} EXP to {nextLevel.title}</span>
              ) : (
                <span className="text-gold-start">🏆 Max Level Reached!</span>
              )}
            </div>
            <div className="h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-start to-gold-end rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Shortcuts Panel (col-span-1) */}
        <div className="col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-primary-green dark:text-light-green font-bold uppercase tracking-wider block mb-3">Quick Navigation</span>
            <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 leading-none mb-4 flex items-center gap-1.5 font-display">
              <Sparkles className="w-4 h-4 text-warm-accent animate-pulse" /> Shortcuts
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2 my-auto">
            {[
              { id: "learning", icon: BookOpen, label: "Lessons" },
              { id: "events", icon: Calendar, label: "Events" },
              { id: "portfolio", icon: Award, label: "Rewards" },
              { id: "grievance", icon: AlertCircle, label: "Reports" }
            ].map(shortcut => (
              <button
                key={shortcut.id}
                onClick={() => {
                  if (shortcut.id === "grievance") onShowGrievance();
                  else onNavigate(shortcut.id);
                }}
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-primary-green active:scale-95 transition-all text-center cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-green/10 dark:bg-primary-green/15 flex items-center justify-center text-primary-green dark:text-light-green">
                  <shortcut.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 truncate tracking-wide">{shortcut.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Card 3: Daily Quests / Missions (col-span-2) */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] text-primary-green dark:text-light-green font-bold uppercase tracking-wider block">Daily Study Check-in</span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-display">
                Mission: {completedQuestsCount}/{quests.length} Completed
              </h3>
            </div>
            <span className="bg-amber-50 dark:bg-amber-950/10 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-200/40">
              +{quests.filter(q => !q.completed).reduce((acc, q) => acc + q.expReward, 0)} EXP Left
            </span>
          </div>

          <div className="space-y-2">
            {quests.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  if (idx === 0) onNavigate("events");
                  else if (idx === 1) onNavigate("learning");
                  else onShowGrievance();
                }}
                className={`w-full border p-3 rounded-xl flex items-center justify-between text-left transition-all ${
                  q.completed
                    ? "bg-zinc-50/50 dark:bg-zinc-950/20 border-zinc-100 dark:border-zinc-800/40 opacity-60"
                    : "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:border-primary-green"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    q.completed ? "bg-primary-green text-white" : "border border-zinc-400 text-transparent"
                  }`}>
                    ✓
                  </span>
                  <div>
                    <strong className="text-xs font-bold block text-zinc-800 dark:text-zinc-200">{q.title}</strong>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                      {q.completed ? "Mission Complete!" : `${q.progress}/${q.target} Progress · +${q.expReward} EXP`}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Card 4: Featured Event (col-span-2) */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-primary-green dark:text-light-green font-bold uppercase tracking-wider block">Featured Event</span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 font-display">
              Next Scheduled Session
            </h3>
          </div>

          <div className="my-3">
            {featuredEvent ? (
              <button
                onClick={() => onNavigate("events")}
                className="w-full text-left text-white p-4 rounded-xl flex items-center gap-4 transition-all duration-300 bg-gradient-to-br from-primary-green to-light-green shadow-sm"
              >
                <div className="w-12 h-12 bg-white text-zinc-900 rounded-lg flex flex-col justify-center items-center shadow-sm font-extrabold flex-shrink-0">
                  <strong className="text-lg leading-none text-primary-green">{dateLabel.day}</strong>
                  <small className="text-[9px] uppercase font-black text-gold-end mt-0.5 leading-none">{dateLabel.month}</small>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-black truncate text-white uppercase tracking-wider">
                    {featuredEvent.title}
                  </h3>
                  <p className="text-[10px] text-white/90 truncate font-semibold mt-1">
                    📍 {featuredEvent.location} · {goingCount}/{capacity} Going
                  </p>
                  <div className="h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-white"
                      style={{ width: `${Math.min(100, (goingCount / capacity) * 100)}%` }}
                    />
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white opacity-85" />
              </button>
            ) : (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
                <p className="text-xs font-semibold text-zinc-500">No events currently scheduled.</p>
                <button
                  onClick={() => onNavigate("events")}
                  className="text-[10px] font-bold text-primary-green dark:text-light-green mt-1 hover:underline"
                >
                  Browse event list
                </button>
              </div>
            )}
          </div>

          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Active attendance verifies direct semester credentials.
          </div>
        </div>

        {/* Card 5: Broadcast & Announcements (col-span-2) */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-[10px] text-primary-green dark:text-light-green font-bold uppercase tracking-wider block">Official Broadcasts</span>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mt-1 flex items-center gap-2 font-display">
              <Megaphone className="w-4 h-4 font-display" /> Announcements & Bulletins
            </h3>
          </div>

          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2">No official announcements currently posted.</p>
            ) : (
              announcements.slice(0, 2).map((a) => (
                <div key={a.id} className="flex gap-3 items-start bg-zinc-50 dark:bg-zinc-950/40 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800/60">
                  <div className="w-7 h-7 rounded-lg bg-primary-green/10 dark:bg-primary-green/10 flex items-center justify-center text-primary-green dark:text-light-green flex-shrink-0">
                    <Megaphone className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-xs font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
                      {a.text}
                    </p>
                    <small className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Card 6: Leaderboard Ranking (col-span-2) */}
        <div className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] text-primary-green dark:text-light-green font-bold uppercase tracking-wider block">Top Standings</span>
              <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mt-1 font-display">
                🏆 Organization Leaderboard
              </h3>
            </div>
            <button
              onClick={() => onNavigate("portfolio")}
              className="text-xs font-bold text-primary-green dark:text-light-green hover:underline cursor-pointer"
            >
              See full rankings
            </button>
          </div>

          <div className="space-y-2">
            {sortedMembers.slice(0, 3).map((m, index) => {
              const isYou = m.studentId === member.studentId;
              const medals = ["🥇", "🥈", "🥉"];
              return (
                <div
                  key={m.studentId}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isYou
                      ? "bg-primary-green/10 dark:bg-primary-green/15 border-primary-green/20"
                      : "bg-zinc-50 dark:bg-zinc-950/50 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black w-5 text-center">{medals[index]}</span>
                    <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-bold text-xs">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-xs font-extrabold block text-zinc-800 dark:text-zinc-200">
                        {m.name} {isYou && <small className="text-[9px] font-bold text-primary-green dark:text-light-green bg-primary-green/10 dark:bg-primary-green/20 px-1 rounded ml-1">(You)</small>}
                      </strong>
                      <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500">
                        Level {getLevelInfo(m.exp).level} · {m.position || "Member"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-primary-green dark:text-light-green">{m.exp} EXP</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
