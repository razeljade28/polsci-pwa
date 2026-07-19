import React, { useState } from "react";
import { Member, Opportunity } from "../types";
import { Compass, Calendar, MapPin, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";

interface OpportunitiesProps {
  member: Member;
  opportunities: Opportunity[];
  onToggleSaveOpportunity: (id: string) => void;
}

export const Opportunities: React.FC<OpportunitiesProps> = ({
  member,
  opportunities,
  onToggleSaveOpportunity
}) => {
  const [activeFilter, setActiveTab] = useState<string>("all");

  const filterTabs = [
    { id: "all", label: "All Board" },
    { id: "Scholarship", label: "Scholarships" },
    { id: "Internship", label: "Internships" },
    { id: "Debate", label: "Debates" },
    { id: "Volunteer", label: "Volunteer Work" }
  ];

  const filteredOpportunities = opportunities.filter(o => {
    if (activeFilter === "all") return true;
    return o.type === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest block">SMC Careers Board</span>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">Opportunities & Internships</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Curated public leadership fellowships, civic volunteer networks, and internships exclusive to Political Science students.
            </p>
          </div>
          <Compass className="w-10 h-10 text-blue-600 flex-shrink-0 opacity-80" />
        </div>
      </section>

      {/* Filter Horizontal Tab */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-200 dark:border-zinc-800">
        {filterTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeFilter === t.id
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-blue-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Board List Grid */}
      <div className="space-y-4">
        {filteredOpportunities.map((opp) => {
          const isSaved = opp.savedBy?.includes(member.studentId);
          return (
            <div
              key={opp.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3.5">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200/40">
                    {opp.type}
                  </span>
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">📍 {opp.location}</p>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 leading-tight font-display">
                    {opp.title}
                  </h3>
                  <strong className="text-xs font-bold text-blue-600 dark:text-blue-400 block">{opp.organization}</strong>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl">{opp.description}</p>

                <p className="text-xs text-red-600 dark:text-red-400 font-bold flex items-center gap-1.5">
                  ⚠️ Applications Due: {opp.deadline}
                </p>
              </div>

              {/* Bookmark deadlines button */}
              <button
                onClick={() => onToggleSaveOpportunity(opp.id)}
                className={`w-full sm:w-auto px-4 py-3 border rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isSaved
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-blue-600"
                }`}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4.5 h-4.5" /> Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4.5 h-4.5" /> Track Deadline
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
