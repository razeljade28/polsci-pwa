import React from "react";
import { Member } from "../types";
import { Shield, Sparkles, Award } from "lucide-react";

interface DigitalIDProps {
  member: Member;
}

export const DigitalID: React.FC<DigitalIDProps> = ({ member }) => {
  return (
    <div id="digital-id-card" className="relative overflow-hidden rounded-3xl p-6 text-white bg-gradient-to-br from-zinc-950 via-blue-950 to-indigo-950 shadow-xl border border-zinc-800 max-w-md mx-auto transition-transform hover:-translate-y-1 hover:shadow-2xl">
      {/* Decorative Golden Rings */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 border-8 border-yellow-500/10 rounded-full pointer-events-none" />
      <div className="absolute -left-12 -top-12 w-32 h-32 border-4 border-white/5 rounded-full pointer-events-none" />

      {/* Top Brand Info */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white text-blue-950 rounded-full flex items-center justify-center font-bold shadow-inner">
            🏛️
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-wider leading-none">SEPOLSCIS</h4>
            <span className="text-[10px] text-white/70 uppercase tracking-widest font-semibold mt-1 block">Digital Member ID</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-yellow-500/25 border border-yellow-500/40 px-2.5 py-1 rounded-full">
          <Shield className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-[10px] font-extrabold text-yellow-300 tracking-wider">VERIFIED</span>
        </div>
      </div>

      {/* Body Info with avatar, text, and QR */}
      <div className="relative z-10 flex items-center gap-5 my-6">
        {/* Profile Avatar Frame */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 bg-zinc-900/40 border-2 border-yellow-400/60 rounded-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg text-yellow-300 font-display">
            {member.name.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-zinc-950 p-1 rounded-lg border-2 border-zinc-800 shadow">
            <Award className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Text details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-extrabold tracking-tight truncate leading-tight text-yellow-100 font-display">{member.name}</h3>
          <p className="text-xs text-white/80 font-medium truncate mt-1">{member.course}</p>
          <div className="flex flex-col gap-0.5 mt-2.5">
            <span className="text-[10px] text-white/60 tracking-wider uppercase">ID Number</span>
            <span className="text-xs font-mono font-bold tracking-wider text-blue-300">{member.studentId}</span>
          </div>
        </div>

        {/* Simulated QR Code */}
        <div className="flex-shrink-0 w-16 h-16 bg-white p-1.5 rounded-xl shadow-md border border-white/10 flex flex-col gap-1 items-center justify-center opacity-90 hover:opacity-100 transition-opacity">
          {/* Custom vector representation of QR Code block */}
          <div className="grid grid-cols-4 gap-0.5 w-full h-full">
            <div className="bg-zinc-900 rounded-sm"></div>
            <div className="bg-zinc-900 rounded-sm"></div>
            <div className="bg-white"></div>
            <div className="bg-zinc-900 rounded-sm"></div>
            <div className="bg-white"></div>
            <div className="bg-zinc-900 rounded-sm"></div>
            <div className="bg-zinc-900 rounded-sm"></div>
            <div className="bg-white"></div>
            <div className="bg-zinc-900 rounded-sm"></div>
            <div className="bg-white"></div>
            <div className="bg-white"></div>
            <div className="bg-zinc-900 rounded-sm"></div>
            <div className="bg-zinc-900 rounded-sm"></div>
            <div className="bg-zinc-900 rounded-sm"></div>
            <div className="bg-white"></div>
            <div className="bg-zinc-900 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="relative z-10 flex justify-between items-center border-t border-white/10 pt-3.5 text-[10px] font-bold text-white/70 tracking-widest uppercase">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          EST. 2026
        </span>
        <span className="bg-zinc-900/40 text-blue-400 border border-zinc-800 px-3 py-1 rounded-lg">
          {member.membership} Member
        </span>
      </div>
    </div>
  );
};
