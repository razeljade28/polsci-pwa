import React from "react";
import { Member, Event, Opportunity } from "../types";
import { Award, ShieldAlert, CheckCircle, Clock, Sparkles, Download, Calendar, ExternalLink, Bookmark } from "lucide-react";

interface PortfolioProps {
  member: Member;
  events: Event[];
  opportunities: Opportunity[];
  attendanceRecords: { eventId: number; date: string; exp: number }[];
  onDownloadCertificate: () => void;
}

export const Portfolio: React.FC<PortfolioProps> = ({
  member,
  events,
  opportunities,
  attendanceRecords,
  onDownloadCertificate
}) => {
  // Gamification helpers
  const BADGES = [
    { id: "b1", name: "New Member", icon: "🌟", desc: "Successfully joined the SEPOLSCIS organization", condition: "exp >= 0" },
    { id: "b2", name: "Active Member", icon: "🔥", desc: "Reached 100 EXP through consistent study", condition: "exp >= 100" },
    { id: "b3", name: "Perfect Attendance", icon: "✅", desc: "Attended 5 organization events or forums", condition: "attendance >= 5" },
    { id: "b4", name: "Best Debater", icon: "🎤", desc: "Awarded title of Top Debate Invitational Winner", condition: "achievements.includes('Debate Winner')" },
    { id: "b5", name: "Sports MVP", icon: "🏀", desc: "Proclaimed MVP during Southern Mindanao Intramurals", condition: "achievements.includes('Sports MVP')" },
    { id: "b6", name: "Quiz Bee Champ", icon: "🏆", desc: "First Place award in annual Political Science Quiz Bee", condition: "achievements.includes('Quiz Bee Champion')" },
    { id: "b7", name: "Good Samaritan", icon: "🤝", desc: "Accumulated over 200 EXP in civic activities", condition: "exp >= 200" },
    { id: "b8", name: "Executive Leader", icon: "👑", desc: "Served as President of the SMC Student Board", condition: "position === 'President'" },
    { id: "b9", name: "Dean's Award", icon: "🎓", desc: "Maintained outstanding marks and 500+ EXP", condition: "exp >= 500" },
    { id: "b10", name: "Senior Counselor", icon: "⭐", desc: "Senior ranking student with 300+ EXP", condition: "exp >= 300" }
  ];

  const getBadgeStatus = (badgeId: string) => {
    return member.badges.includes(badgeId);
  };

  const unlockedBadges = BADGES.filter(b => getBadgeStatus(b.id));

  // Calculating volunteer hours (4 hours per 'volunteer' type event)
  const volunteerHours = attendanceRecords.reduce((total, record) => {
    const eventObj = events.find(e => e.id === record.eventId);
    if (eventObj && eventObj.type === "volunteer") {
      return total + 4;
    }
    return total;
  }, 0);

  // Saved Opportunities Bookmarked by this member
  const savedOpportunities = opportunities.filter(o => o.savedBy?.includes(member.studentId));

  return (
    <div className="space-y-6">
      {/* Premium Banner */}
      <section className="bg-gradient-to-br from-dark-green via-primary-green to-dark-green rounded-3xl p-6 text-white shadow-lg border border-light-green/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-gradient-to-bl from-gold-start/10 to-transparent rounded-full filter blur-xl" />
        <div className="absolute -left-12 -bottom-12 w-28 h-28 border-4 border-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <span className="text-[10px] text-gold-start font-extrabold uppercase tracking-widest block">SMC PolSci Verified Record</span>
            <h2 className="text-xl font-extrabold text-yellow-50 font-display">{member.name}</h2>
            <p className="text-xs text-white/80 font-medium leading-relaxed">
              Course: {member.course} · Academic Year: {member.year}
            </p>
          </div>

          <button
            onClick={onDownloadCertificate}
            className="w-full md:w-auto px-5 py-3.5 bg-gradient-to-r from-gold-start to-gold-end text-dark-green rounded-xl text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" /> Download Certified Transcript
          </button>
        </div>
      </section>

      {/* Stats Counter Grid */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { icon: Calendar, value: attendanceRecords.length, label: "Attended Events", color: "text-primary-green bg-primary-green/10 dark:bg-primary-green/20" },
          { icon: Award, value: unlockedBadges.length, label: "Earned Badges", color: "text-warm-accent bg-warm-accent/10 dark:bg-warm-accent/20" },
          { icon: Clock, value: `${volunteerHours}h`, label: "Volunteer Hours", color: "text-cool-accent bg-cool-accent/10 dark:bg-cool-accent/20" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl text-center shadow-sm space-y-1 hover:shadow transition-shadow">
            <div className={`w-8 h-8 rounded-lg mx-auto flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-4.5 h-4.5" />
            </div>
            <strong className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 block font-display">{stat.value}</strong>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block leading-none">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Badges Collection Panel */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div>
          <span className="text-[10px] text-primary-green dark:text-light-green font-extrabold uppercase tracking-wider block">Honor Society</span>
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5 font-display">
            🏅 Unlocked Badges & Achievements
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const unlocked = getBadgeStatus(b.id);
            return (
              <div
                key={b.id}
                className={`p-3.5 border rounded-xl flex flex-col justify-between text-center transition-all ${
                  unlocked
                    ? "bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 opacity-100"
                    : "bg-zinc-50/40 dark:bg-zinc-900/10 border-transparent opacity-40 grayscale"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="text-2xl">{b.icon}</div>
                  <strong className="text-xs font-extrabold block text-zinc-900 dark:text-zinc-100 leading-tight font-display">
                    {b.name}
                  </strong>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold leading-normal">
                    {b.desc}
                  </p>
                </div>
                <span className={`text-[9px] font-black uppercase mt-3 tracking-wider block ${
                  unlocked ? "text-primary-green dark:text-light-green" : "text-zinc-400"
                }`}>
                  {unlocked ? "✓ Active" : "🔒 Locked"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leadership & Activities Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance details */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] text-primary-green dark:text-light-green font-extrabold uppercase tracking-wider block">Chronicle</span>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5 font-display">
              📅 Attendance Logs
            </h3>
          </div>

          {attendanceRecords.length === 0 ? (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 py-4">Attend upcoming events to register log entries here.</p>
          ) : (
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {attendanceRecords.map((record) => {
                const eventObj = events.find(e => e.id === record.eventId);
                return (
                  <div key={record.eventId} className="flex justify-between items-center p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                    <div className="min-w-0">
                      <strong className="text-xs font-bold block truncate text-zinc-900 dark:text-zinc-100 font-display">
                        {eventObj?.title || "Organization Forum"}
                      </strong>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{record.date}</span>
                    </div>
                    <span className="text-[11px] font-extrabold text-primary-green dark:text-light-green">+{record.exp} EXP</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Bookmarked Opportunities */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] text-primary-green dark:text-light-green font-extrabold uppercase tracking-wider block">Bookmarks</span>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5 font-display">
              📌 Saved Opportunities
            </h3>
          </div>

          {savedOpportunities.length === 0 ? (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 py-4">Save deadlines from the Opportunities Hub to bookmark them here.</p>
          ) : (
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {savedOpportunities.map((opp) => (
                <div key={opp.id} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <strong className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate font-display">
                      {opp.title}
                    </strong>
                    <span className="text-[10px] font-extrabold uppercase text-warm-accent bg-warm-accent/10 px-2 py-0.5 rounded border border-warm-accent/20">
                      {opp.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold">{opp.organization}</p>
                  <p className="text-[10px] text-red-600 dark:text-red-400 font-bold">⚠️ Deadline: {opp.deadline}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
