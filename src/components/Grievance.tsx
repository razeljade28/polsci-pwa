import React, { useState } from "react";
import { Member, Grievance as GrievanceType } from "../types";
import { AlertTriangle, ShieldCheck, MailCheck, Send, Clock, CheckCircle } from "lucide-react";

interface GrievanceProps {
  member: Member;
  grievances: GrievanceType[];
  onSubmitGrievance: (title: string, description: string, anonymous: boolean) => void;
}

export const Grievance: React.FC<GrievanceProps> = ({
  member,
  grievances,
  onSubmitGrievance
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const myGrievances = grievances.filter(g => g.memberId === member.studentId || g.anonymous);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmitGrievance(title, description, anonymous);
    setTitle("");
    setDescription("");
    setAnonymous(false);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex justify-between items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-widest block">Confidential Reporting</span>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-display">Grievances & Advisory Desk</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
              Submit schedule conflicts, academic complaints, or venue concerns. Officers resolve entries confidentially.
            </p>
          </div>
          <AlertTriangle className="w-10 h-10 text-blue-600 flex-shrink-0 opacity-80" />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form to submit a new Grievance */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
            📝 Submit Confidential Report
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Brief Topic Title</label>
              <input
                required
                type="text"
                placeholder="e.g., General Assembly Schedule Conflict"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 text-zinc-900 dark:text-zinc-100 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block">Full Description & Evidence</label>
              <textarea
                required
                rows={4}
                placeholder="Detail your schedule overlap or request. Give dates and details clearly..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 text-zinc-900 dark:text-zinc-100 font-semibold"
              />
            </div>

            {/* Checkbox: Submit Anonymously */}
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/50 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded outline-none focus:ring-0 cursor-pointer"
              />
              <div className="text-[11px] leading-tight">
                <strong className="text-zinc-900 dark:text-zinc-100 font-extrabold block">Submit Anonymously</strong>
                <span className="text-zinc-400 dark:text-zinc-500 font-medium">Hides your student credentials on public lists</span>
              </div>
            </label>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
            >
              <Send className="w-4 h-4" /> Submit Report Entry
            </button>
          </form>

          {isSubmitted && (
            <div className="bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 p-3 rounded-xl border border-blue-200/50 flex items-center gap-2 text-xs font-semibold animate-pulse">
              <ShieldCheck className="w-4 h-4" /> Report submitted. Awaiting officer advisement.
            </div>
          )}
        </div>

        {/* My History List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 font-display">
            📋 Submission History ({myGrievances.length})
          </h3>

          {myGrievances.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 p-10 rounded-2xl text-center space-y-2.5">
              <MailCheck className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
              <h4 className="font-extrabold text-sm text-zinc-500">Your records are completely clean.</h4>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Any filed reports will appear tracked here with status notes.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myGrievances.map((g) => {
                const statusColors = {
                  submitted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-300 border-yellow-200/50",
                  "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300 border-blue-200/50",
                  resolved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-200/50",
                  rejected: "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-300 border-red-200/50"
                };

                return (
                  <div
                    key={g.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          statusColors[g.status]
                        }`}>
                          {g.status}
                        </span>
                        <h4 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mt-2 font-display">
                          {g.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(g.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-semibold">
                      {g.description}
                    </p>

                    {g.anonymous && (
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">🔒 Submitted under Anonymous security</p>
                    )}

                    {/* Resolution Section if Resolved */}
                    {g.status === "resolved" && g.resolution && (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-100/50 flex gap-2.5 mt-2.5">
                        <CheckCircle className="w-4.5 h-4.5 text-emerald-800 flex-shrink-0" />
                        <div className="space-y-0.5">
                          <strong className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-400">Officer Resolution Notes</strong>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                            {g.resolution}
                          </p>
                        </div>
                      </div>
                    )}

                    {g.notes && g.status === "in-progress" && (
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3.5 rounded-xl border border-blue-100/50 flex gap-2.5 mt-2.5">
                        <Clock className="w-4.5 h-4.5 text-blue-800 flex-shrink-0 animate-pulse" />
                        <div className="space-y-0.5">
                          <strong className="text-xs font-black uppercase tracking-wider text-blue-900 dark:text-blue-400">Officer Advisory Update</strong>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                            {g.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
