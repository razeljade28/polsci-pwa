import React, { useState } from "react";
import { Member, Event, Grievance, Feedback } from "../types";
import { Shield, Sparkles, PlusCircle, Award, CheckCircle, Megaphone, HelpCircle, Users, BarChart, Gavel, Trash2, MailOpen, Activity } from "lucide-react";

interface OfficerPanelProps {
  member: Member;
  members: Member[];
  events: Event[];
  grievances: Grievance[];
  onPostAnnouncement: (text: string) => void;
  onCreateEvent: (eventData: Omit<Event, "id" | "rsvps">) => void;
  onAwardBadge: (studentId: string, badgeId: string) => void;
  onApproveGradeRequest: (studentId: string) => void;
  onRejectGradeRequest: (studentId: string) => void;
  onUpdateGrievanceStatus: (id: string, status: "in-progress" | "resolved" | "rejected", resolutionNotes?: string) => void;
}

export const OfficerPanel: React.FC<OfficerPanelProps> = ({
  member,
  members,
  events,
  grievances,
  onPostAnnouncement,
  onCreateEvent,
  onAwardBadge,
  onApproveGradeRequest,
  onRejectGradeRequest,
  onUpdateGrievanceStatus
}) => {
  const [activeTab, setActiveTab] = useState<"analytics" | "announcement" | "event" | "badge" | "grievances">("analytics");

  // Form states
  const [announcementText, setAnnouncementText] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState<Event["type"]>("assembly");
  const [eventLocation, setEventLocation] = useState("");
  const [eventExp, setEventExp] = useState(50);
  const [eventCapacity, setEventCapacity] = useState(50);
  const [eventDesc, setEventDesc] = useState("");

  const [selectedStudentForBadge, setSelectedStudentForBadge] = useState("");
  const [selectedBadgeToAward, setSelectedBadgeToAward] = useState("b2");

  const [activeGrievanceIdForResolution, setActiveGrievanceIdForResolution] = useState<string | null>(null);
  const [resolutionTextInput, setResolutionTextInput] = useState("");

  // Analytics variables
  const totalMembersCount = members.length;
  const avgExp = Math.round(members.reduce((acc, m) => acc + m.exp, 0) / (totalMembersCount || 1));
  const totalEventsCount = events.length;
  const pendingGrievances = grievances.filter(g => g.status === "submitted" || g.status === "in-progress");
  const gradeRequests = members.filter(m => m.gradeConvRequested);

  const BADGES_LIST = [
    { id: "b1", name: "🌟 New Member" },
    { id: "b2", name: "🔥 Active Member" },
    { id: "b3", name: "✅ Perfect Attendance" },
    { id: "b4", name: "🎤 Best Debater" },
    { id: "b5", name: "🏀 Sports MVP" },
    { id: "b6", name: "🏆 Quiz Bee Champ" },
    { id: "b7", name: "🤝 Good Samaritan" },
    { id: "b8", name: "👑 Executive Leader" },
    { id: "b9", name: "🎓 Dean's Award" },
    { id: "b10", name: "⭐ Senior Counselor" }
  ];

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    onPostAnnouncement(announcementText);
    setAnnouncementText("");
    alert("📢 Announcement posted successfully!");
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate || !eventLocation.trim()) return;

    onCreateEvent({
      title: eventTitle,
      date: eventDate,
      type: eventType,
      location: eventLocation,
      exp: eventExp,
      capacity: eventCapacity,
      description: eventDesc
    });

    setEventTitle("");
    setEventDate("");
    setEventLocation("");
    setEventExp(50);
    setEventCapacity(50);
    setEventDesc("");
    alert("📅 Event created successfully!");
  };

  const handleAwardBadgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForBadge) return;
    onAwardBadge(selectedStudentForBadge, selectedBadgeToAward);
    alert("🏅 Badge awarded and notified successfully!");
  };

  const handleResolveGrievance = (id: string) => {
    if (!resolutionTextInput.trim()) return;
    onUpdateGrievanceStatus(id, "resolved", resolutionTextInput);
    setActiveGrievanceIdForResolution(null);
    setResolutionTextInput("");
    alert("✓ Grievance resolved and documented!");
  };

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <section className="bg-gradient-to-br from-dark-green via-primary-green to-dark-green text-white rounded-2xl p-5 shadow-lg border border-light-green/30">
        <div className="flex justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-gold-start font-extrabold uppercase tracking-widest flex items-center gap-1.5 block">
              <Shield className="w-3.5 h-3.5 fill-gold-start text-gold-end animate-pulse" />
              Administrative Authorization Access
            </span>
            <h2 className="text-xl font-extrabold text-white font-display">Officer Operations Desk</h2>
            <p className="text-xs text-zinc-300 font-medium leading-relaxed">
              Active Officer: {member.name} ({member.position})
            </p>
          </div>
          <BarChart className="w-10 h-10 text-gold-start flex-shrink-0 opacity-80" />
        </div>
      </section>

      {/* Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
        {[
          { id: "analytics", label: "Overview & Analytics", icon: Activity },
          { id: "announcement", label: "Broadcast Announcement", icon: Megaphone },
          { id: "event", label: "Create Board Event", icon: PlusCircle },
          { id: "badge", label: "Award Honors Badge", icon: Award },
          { id: "grievances", label: "Grievances & Grade Requests", icon: Gavel }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
              activeTab === tab.id
                ? "bg-primary-green border-primary-green text-white shadow-sm"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-primary-green"
            }`}
          >
            <tab.icon className="w-4 h-4 flex-shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}

      {/* 1. Analytics & Overview */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Total Students", value: totalMembersCount, sub: "SMC PolSci Enrollees", color: "text-primary-green bg-primary-green/10 dark:bg-primary-green/20" },
              { icon: Sparkles, label: "Average Standing", value: `${avgExp} EXP`, sub: "App-wide member average", color: "text-warm-accent bg-warm-accent/10 dark:bg-warm-accent/20" },
              { icon: Gavel, label: "Pending Grievances", value: pendingGrievances.length, sub: `${grievances.length} submitted overall`, color: "text-red-600 bg-red-50 dark:bg-red-950/20" },
              { icon: CheckCircle, label: "Grade Requests", value: gradeRequests.length, sub: "Pending officer review", color: "text-cool-accent bg-cool-accent/10 dark:bg-cool-accent/20" }
            ].map((card, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-1">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                  <card.icon className="w-4.5 h-4.5" />
                </div>
                <strong className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 block font-display mt-2">{card.value}</strong>
                <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 block leading-none">{card.label}</span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block pt-1.5">{card.sub}</span>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              👥 Active Enrollment Standings
            </h3>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {[...members].sort((a,b) => b.exp - a.exp).map((m, idx) => (
                <div key={m.studentId} className="flex justify-between items-center p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-zinc-400 dark:text-zinc-500 text-xs w-5 text-center">#{idx + 1}</span>
                    <div>
                      <strong className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block leading-none font-display">{m.name}</strong>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 block">Course: {m.course} · ID: {m.studentId}</span>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-primary-green dark:text-light-green">{m.exp} EXP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Broadcast Announcement */}
      {activeTab === "announcement" && (
        <form onSubmit={handlePostAnnouncement} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              📢 Dispatch Official Announcement
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              Broadcast urgent notifications, guidelines, or schedule updates directly to the student dashboard feed.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Announcement Content</label>
            <textarea
              required
              rows={4}
              placeholder="e.g., The General Assembly rescheduled to next Wednesday at Auditorium Hall."
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-900 dark:text-zinc-100 font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary-green hover:bg-light-green text-white rounded-xl text-xs font-extrabold shadow flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <Megaphone className="w-4.5 h-4.5" /> Dispatch Official Broadcast
          </button>
        </form>
      )}

      {/* 3. Create Event */}
      {activeTab === "event" && (
        <form onSubmit={handleCreateEvent} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              📅 Register New Organizational Event
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              Formulate upcoming debates, intramural fixtures, forums, or volunteer programs. Correctly configured values populate calendars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Event Title</label>
              <input
                required
                type="text"
                placeholder="e.g., ASEAN Integration Debate"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-900 dark:text-zinc-100 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Scheduled Date</label>
              <input
                required
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-500 dark:text-zinc-400 font-semibold cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Event Type Category</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as any)}
                className="w-full text-sm p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-900 dark:text-zinc-100 font-semibold cursor-pointer"
              >
                <option value="assembly">Assembly</option>
                <option value="competition">Competition</option>
                <option value="sports">Sports</option>
                <option value="volunteer">Volunteer Work</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Location / Venue</label>
              <input
                required
                type="text"
                placeholder="e.g., SMC Auditorium, Pagadian City"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-900 dark:text-zinc-100 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Participation EXP Rewards</label>
              <input
                required
                type="number"
                min={10}
                max={200}
                value={eventExp}
                onChange={(e) => setEventExp(Number(e.target.value))}
                className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-900 dark:text-zinc-100 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Seat Capacity Limits</label>
              <input
                required
                type="number"
                min={10}
                value={eventCapacity}
                onChange={(e) => setEventCapacity(Number(e.target.value))}
                className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-900 dark:text-zinc-100 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Event Description</label>
            <textarea
              required
              rows={3}
              placeholder="Provide a comprehensive summary of the schedule agenda..."
              value={eventDesc}
              onChange={(e) => setEventDesc(e.target.value)}
              className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-900 dark:text-zinc-100 font-semibold"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary-green hover:bg-light-green text-white rounded-xl text-xs font-extrabold shadow flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-4.5 h-4.5" /> Publish New Event Listing
          </button>
        </form>
      )}

      {/* 4. Award Badge */}
      {activeTab === "badge" && (
        <form onSubmit={handleAwardBadgeSubmit} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              🏅 Bestow Honors Badges manually
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              Reward special student achievements (Deans Awards, Quiz Bee Champions, Debate stars) manually. BESTOWING A BADGE GRANTS +25 BONUS EXP!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Select Student Member</label>
              <select
                required
                value={selectedStudentForBadge}
                onChange={(e) => setSelectedStudentForBadge(e.target.value)}
                className="w-full text-sm p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-900 dark:text-zinc-100 font-semibold cursor-pointer"
              >
                <option value="">-- Choose Member --</option>
                {members.map(m => (
                  <option key={m.studentId} value={m.studentId}>
                    {m.name} ({m.studentId} · {m.exp} EXP)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Select Honors Badge</label>
              <select
                required
                value={selectedBadgeToAward}
                onChange={(e) => setSelectedBadgeToAward(e.target.value)}
                className="w-full text-sm p-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green text-zinc-900 dark:text-zinc-100 font-semibold cursor-pointer"
              >
                {BADGES_LIST.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedStudentForBadge}
            className="w-full py-3.5 bg-primary-green hover:bg-light-green text-white rounded-xl text-xs font-extrabold shadow flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Award className="w-4.5 h-4.5" /> Bestow Special Honors Badge
          </button>
        </form>
      )}

      {/* 5. Grievances & Grade Requests */}
      {activeTab === "grievances" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade Requests */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              📝 Academic Grade Conversion Requests ({gradeRequests.length})
            </h3>

            {gradeRequests.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 p-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center text-xs text-zinc-400 dark:text-zinc-500">
                No pending requests. Members submit conversions from profiles.
              </div>
            ) : (
              <div className="space-y-3">
                {gradeRequests.map(m => (
                  <div key={m.studentId} className="bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-3">
                    <div className="space-y-0.5">
                      <strong className="text-xs font-extrabold block text-zinc-900 dark:text-zinc-100 font-display">{m.name}</strong>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">ID: {m.studentId} · Course: {m.course} · EXP: {m.exp}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onApproveGradeRequest(m.studentId);
                          alert("✓ Grade request approved and verified!");
                        }}
                        className="px-3.5 py-1.5 bg-primary-green hover:bg-light-green text-white rounded-lg text-[10px] font-black cursor-pointer shadow-sm"
                      >
                        Approve Conversion
                      </button>
                      <button
                        onClick={() => {
                          onRejectGradeRequest(m.studentId);
                          alert("✓ Grade request rejected.");
                        }}
                        className="px-3.5 py-1.5 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-black cursor-pointer"
                      >
                        Reject Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filed Grievances */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
              📋 Filed Grievance Logs ({grievances.length})
            </h3>

            {grievances.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 p-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center text-xs text-zinc-400 dark:text-zinc-500">
                Grievance registry is currently completely empty!
              </div>
            ) : (
              <div className="space-y-3">
                {grievances.map(g => (
                  <div key={g.id} className="bg-white dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <strong className="text-xs font-extrabold block text-zinc-900 dark:text-zinc-100 font-display">{g.title}</strong>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Submitted: {new Date(g.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200/40">
                        {g.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                      {g.description}
                    </p>

                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      Author Credentials: {g.anonymous ? "🔒 Anonymous Protection" : `Student ID: ${g.memberId}`}
                    </p>

                    {g.status !== "resolved" && (
                      <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                        {activeGrievanceIdForResolution === g.id ? (
                          <div className="space-y-2">
                            <textarea
                              required
                              rows={2}
                              placeholder="Write resolution / action taken notes..."
                              value={resolutionTextInput}
                              onChange={(e) => setResolutionTextInput(e.target.value)}
                              className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg outline-none text-zinc-900 dark:text-zinc-100 focus:border-primary-green"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleResolveGrievance(g.id)}
                                className="px-3.5 py-1.5 bg-primary-green text-white rounded-lg text-[10px] font-black cursor-pointer shadow-sm"
                              >
                                Submit Resolution
                              </button>
                              <button
                                onClick={() => setActiveGrievanceIdForResolution(null)}
                                className="px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-800 text-zinc-500 rounded-lg text-[10px] font-black cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => {
                                onUpdateGrievanceStatus(g.id, "in-progress");
                                alert("✓ Status moved to In-Progress!");
                              }}
                              disabled={g.status === "in-progress"}
                              className="px-3.5 py-1.5 bg-primary-green hover:bg-light-green text-white rounded-lg text-[10px] font-black cursor-pointer disabled:opacity-40"
                            >
                              In Progress
                            </button>
                            <button
                              onClick={() => setActiveGrievanceIdForResolution(g.id)}
                              className="px-3.5 py-1.5 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg text-[10px] font-black cursor-pointer"
                            >
                              Resolve Issue
                            </button>
                            <button
                              onClick={() => {
                                onUpdateGrievanceStatus(g.id, "rejected");
                                alert("✓ Report entry flagged rejected.");
                              }}
                              className="px-3.5 py-1.5 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-400 rounded-lg text-[10px] font-black cursor-pointer"
                            >
                              Flag Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
