import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CareerRoadmap, SalaryGrowth } from '../../data/roadmaps/types';
import { CheckCircle2, Circle, TrendingUp, Award, Briefcase, BookOpen, Clock, Calendar, CheckSquare } from 'lucide-react';

export const SalaryChart = ({ data }: { data: SalaryGrowth[] }) => {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 h-80">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <TrendingUp className="h-5 w-5 text-emerald-400 mr-2" /> Salary Progression
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="level" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(val) => `$${val / 1000}k`} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, "Estimated Salary"]}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
          />
          <Area type="monotone" dataKey="numericValue" stroke="#10b981" fillOpacity={1} fill="url(#colorSalary)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CareerLadder = ({ progression }: { progression: CareerRoadmap['careerProgression'] }) => {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <Award className="h-5 w-5 text-indigo-400 mr-2" /> Career Ladder
      </h3>
      <div className="relative border-l-2 border-indigo-500/30 ml-4 space-y-8 pb-4">
        {progression.map((step, idx) => (
          <div key={idx} className="relative pl-6">
            <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-[#0f172a] border-2 border-indigo-500" />
            <h4 className="text-white font-bold text-lg">{step.title}</h4>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{step.timeline}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkillTracker = ({ coreSkills, alreadyHave }: { coreSkills: string[], alreadyHave: string[] }) => {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center">
        <Briefcase className="h-5 w-5 text-blue-400 mr-2" /> Core Skills Tracker
      </h3>
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        {coreSkills.map((skill, i) => {
          const hasSkill = alreadyHave.includes(skill);
          return (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-sm">
                <span className={hasSkill ? "text-emerald-400 font-bold" : "text-slate-300"}>{skill}</span>
                <span className="text-xs text-slate-500">{hasSkill ? "100%" : "0%"}</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2">
                <div className={`h-2 rounded-full ${hasSkill ? 'bg-emerald-500 w-full' : 'bg-slate-700 w-0'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const InteractiveChecklist = ({ title, items }: { title: string, items: string[] }) => {
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center">
        <CheckSquare className="h-5 w-5 text-amber-400 mr-2" /> {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <label key={i} className="flex items-start gap-3 p-3 bg-slate-900/50 border border-slate-700/50 rounded-xl cursor-pointer hover:border-slate-500 transition-colors group">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" />
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
