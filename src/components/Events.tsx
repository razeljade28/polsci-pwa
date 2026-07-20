import React, { useState } from "react";
import { Member, Event, Feedback } from "../types";
import { Calendar, Search, MapPin, Award, Users, PlusCircle, CheckCircle, Download, FileText, Check } from "lucide-react";

interface EventsProps {
  member: Member;
  events: Event[];
  onRsvp: (eventId: number, status: "going" | "maybe" | "no") => void;
  onCheckInEvent: (eventId: number) => void;
  onDownloadCalendar: (eventId: number) => void;
  onSubmitFeedback: (eventId: number, rating: number, comment: string) => void;
  attendanceRecords: { eventId: number; memberId: string }[];
}

export const Events: React.FC<EventsProps> = ({
  member,
  events,
  onRsvp,
  onCheckInEvent,
  onDownloadCalendar,
  onSubmitFeedback,
  attendanceRecords
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "schedule">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Feedback form modal state
  const [feedbackEventId, setFeedbackEventId] = useState<number | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

  const filteredEvents = events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || event.type === typeFilter;
      const matchesTab =
        activeTab === "all" ||
        (event.rsvps?.[member.studentId] === "going" || event.rsvps?.[member.studentId] === "maybe");

      return matchesSearch && matchesType && matchesTab;
    });

  const isAttended = (eventId: number) => {
    return attendanceRecords.some(r => r.eventId === eventId && r.memberId === member.studentId);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackEventId === null) return;
    onSubmitFeedback(feedbackEventId, feedbackRating, feedbackComment);
    setFeedbackEventId(null);
    setFeedbackRating(5);
    setFeedbackComment("");
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-primary-green dark:text-light-green font-extrabold uppercase tracking-widest block">SMC PolSci Calendar</span>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">Organization Events & Seminars</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Verify attendance to earn EXP and build your professional organization portfolio.
            </p>
          </div>
          <Calendar className="w-10 h-10 text-primary-green dark:text-light-green flex-shrink-0 opacity-80" />
        </div>
      </section>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-2.5 text-sm font-extrabold tracking-wide transition-colors relative cursor-pointer ${
            activeTab === "all" ? "text-primary-green dark:text-light-green" : "text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400"
          }`}
        >
          All Events
          {activeTab === "all" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green dark:bg-light-green rounded" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("schedule")}
          className={`pb-2.5 text-sm font-extrabold tracking-wide transition-colors relative cursor-pointer ${
            activeTab === "schedule" ? "text-primary-green dark:text-light-green" : "text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400"
          }`}
        >
          My Personal Schedule
          {activeTab === "schedule" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-green dark:bg-light-green rounded" />
          )}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 flex items-center gap-2.5 shadow-sm">
          <Search className="w-4 h-4 text-primary-green dark:text-light-green" />
          <input
            type="text"
            placeholder="Search events, venues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none border-none bg-transparent text-sm text-zinc-900 dark:text-zinc-100 font-semibold"
          />
        </div>

        {/* Category Selector */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none text-zinc-700 dark:text-zinc-300 shadow-sm cursor-pointer"
        >
          <option value="all">All Types</option>
          <option value="assembly">Assembly</option>
          <option value="competition">Competition</option>
          <option value="sports">Sports</option>
          <option value="volunteer">Volunteer</option>
        </select>
      </div>

      {/* Events List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-1 md:col-span-2 bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 p-10 rounded-2xl text-center space-y-3">
            <Calendar className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
            <h4 className="font-extrabold text-sm text-zinc-500">No events matched your parameters.</h4>
            <p className="text-xs text-zinc-400">Clear filters or try searching for another term.</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const isPast = new Date(event.date) < new Date();
            const rsvpStatus = event.rsvps?.[member.studentId] || "";
            const goingCount = event.rsvps
              ? Object.values(event.rsvps).filter(v => v === "going").length
              : 0;
            const maxCapacity = event.capacity || 50;
            const isFull = goingCount >= maxCapacity && rsvpStatus !== "going";
            const attended = isAttended(event.id);

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Visual Accent Banner */}
                <div className={`h-2 ${
                  isPast ? "bg-zinc-400 dark:bg-zinc-600" : "bg-gradient-to-r from-dark-green via-primary-green to-dark-green"
                }`} />

                {/* Body Content */}
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        event.type === "volunteer" ? "bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-300" :
                        event.type === "competition" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300" :
                        event.type === "sports" ? "bg-orange-100 text-orange-800 dark:bg-orange-950/20 dark:text-orange-300" :
                        "bg-primary-green/10 text-primary-green dark:bg-primary-green/20 dark:text-light-green"
                      }`}>
                        {event.type}
                      </span>
                      <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-2 leading-tight font-display">
                        {event.title}
                      </h3>
                    </div>
                    <span className={`text-xs font-bold ${isPast ? "text-zinc-400" : "text-primary-green dark:text-light-green"}`}>
                      {isPast ? "Completed" : "Upcoming"}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                    <p className="flex items-center gap-2">
                      <span className="text-primary-green dark:text-light-green">📅</span> {event.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-primary-green dark:text-light-green">📍</span> {event.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-primary-green dark:text-light-green flex-shrink-0" />
                      {goingCount}/{maxCapacity} going {isFull && "· (Full)"}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed font-medium">
                    {event.description}
                  </p>

                  {/* RSVP block for upcoming events */}
                  {!isPast && (
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                      <p className="text-[10px] uppercase font-black tracking-wider text-zinc-400">RSVP Status</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(["going", "maybe", "no"] as const).map((status) => (
                          <button
                            key={status}
                            disabled={status === "going" && isFull}
                            onClick={() => onRsvp(event.id, status)}
                            className={`py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer border ${
                              rsvpStatus === status
                                ? "bg-primary-green text-white border-primary-green shadow-sm"
                                : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-primary-green"
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {status === "going" ? "Going" : status === "maybe" ? "Maybe" : "Can't Go"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer block */}
                <div className="bg-zinc-50 dark:bg-zinc-950 p-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap gap-2 items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 bg-primary-green/10 dark:bg-primary-green/20 text-primary-green dark:text-light-green font-extrabold text-xs px-3 py-1.5 rounded-full border border-primary-green/20">
                    <Award className="w-3.5 h-3.5" />
                    +{event.exp} EXP
                  </span>

                  <div className="flex gap-2">
                    {/* Add to Calendar */}
                    {!isPast && (
                      <button
                        onClick={() => onDownloadCalendar(event.id)}
                        title="Add to personal phone calendar (.ics)"
                        className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-primary-green bg-white dark:bg-zinc-900 cursor-pointer text-zinc-500 dark:text-zinc-400"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}

                    {/* Attendance / Verification trigger */}
                    {!isPast ? (
                      <button
                        onClick={() => onCheckInEvent(event.id)}
                        disabled={attended}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                          attended
                            ? "bg-primary-green/10 dark:bg-primary-green/10 border border-primary-green/20 text-primary-green dark:text-light-green cursor-not-allowed"
                            : "bg-primary-green hover:bg-light-green text-white"
                        }`}
                      >
                        {attended ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Checked In
                          </>
                        ) : (
                          "Self Check-In"
                        )}
                      </button>
                    ) : (
                      attended && (
                        <button
                          onClick={() => setFeedbackEventId(event.id)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" /> Feedback Form
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Feedback Form Modal */}
      {feedbackEventId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 font-display">
              📝 Submit Event Feedback
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Provide your thoughts on the speaker, content, and organization of this event. Your feedback is highly appreciated!
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Rating</label>
                <div className="flex gap-2 text-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className={`transition-transform hover:scale-110 cursor-pointer ${
                        feedbackRating >= star ? "text-amber-400" : "text-zinc-300 dark:text-zinc-700"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Comments & Insights</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What went well? What can be improved?"
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green/10 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackEventId(null)}
                  className="px-4 py-2 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-green hover:bg-light-green text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
