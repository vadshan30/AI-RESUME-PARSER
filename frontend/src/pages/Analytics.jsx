import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileText, Activity, Star, Loader2, ArrowLeft } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

const Analytics = () => {
  const [data, setData] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [analyticsRes, resumesRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/analytics/resumes?limit=10')
        ]);
        setData(analyticsRes.data);
        setResumes(resumesRes.data);
      } catch (err) {
        console.error('Failed to load analytics data', err);
        setError('Failed to load platform analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="text-rose-400 font-bold text-xl">{error}</div>
        <Link to="/dashboard" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  // Mock upload trend data
  const uploadData = [
    { name: 'Mon', uploads: 4 },
    { name: 'Tue', uploads: 7 },
    { name: 'Wed', uploads: 5 },
    { name: 'Thu', uploads: 12 },
    { name: 'Fri', uploads: 9 },
    { name: 'Sat', uploads: 15 },
    { name: 'Sun', uploads: 8 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20">
      <header className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="font-bold text-xl text-white flex items-center gap-2">
              <BarChart2 className="text-indigo-400 w-5 h-5" />
              Platform Analytics
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* SECTION 1: Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Total Resumes</p>
              <p className="text-3xl font-bold text-white mt-1">{data?.total_resumes}</p>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-lg"><FileText className="w-6 h-6 text-emerald-400" /></div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Avg ATS Score</p>
              <p className="text-3xl font-bold text-white mt-1">{data?.average_ats_score}</p>
            </div>
            <div className="bg-amber-500/20 p-3 rounded-lg"><Activity className="w-6 h-6 text-amber-400" /></div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-400">Top Category</p>
              <p className="text-xl font-bold text-white mt-1">{data?.top_categories?.[0]?.category || 'N/A'}</p>
            </div>
            <div className="bg-pink-500/20 p-3 rounded-lg"><Star className="w-6 h-6 text-pink-400" /></div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Skills Bar Chart */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6">Top Extracted Skills</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.top_skills || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="skill" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Pie Chart */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-6">Category Distribution</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.top_categories || []}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="category"
                  >
                    {(data?.top_categories || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Upload Trends */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6">Weekly Upload Trend</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uploadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Resumes Table */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6">Platform Resume Scans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">File Name</th>
                  <th className="px-4 py-3">ATS Score</th>
                  <th className="px-4 py-3 rounded-tr-lg">Date Processed</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map(r => (
                  <tr key={r.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20">
                    <td className="px-4 py-3 text-white font-medium">
                      <Link to={`/dashboard/analysis/${r.id}`} className="hover:text-indigo-400 transition-colors">
                        {r.filename}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${r.resume_score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : r.resume_score >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {r.resume_score}
                      </span>
                    </td>
                    <td className="px-4 py-3">{new Date(r.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Analytics;
