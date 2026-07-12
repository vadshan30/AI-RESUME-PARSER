import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
const Card = ({ children, className = '' }: any) => <div className={`bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden ${className}`}>{children}</div>;
const CardHeader = ({ children, className = '' }: any) => <div className={`p-6 pb-0 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = '' }: any) => <h3 className={`font-bold tracking-tight ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = '' }: any) => <p className={`text-sm text-slate-400 mt-1 ${className}`}>{children}</p>;
const CardContent = ({ children, className = '' }: any) => <div className={`p-6 ${className}`}>{children}</div>;
const Badge = ({ children, className = '' }: any) => <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>;
import {
  Loader2,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
  Award,
  Target,
  Globe,
  Clock,
  AlertCircle,
  CheckCircle2,
  PieChart,
  Activity,
  Zap,
  Brain,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// === Type Definitions ===

interface PlatformOverview {
  total_resumes: number;
  total_users: number;
  total_analyses: number;
  avg_match_score: number;
  success_rate: number;
  growth_rate: number;
  active_users: number;
  platform_health: {
    status: string;
    uptime: number;
    response_time: number;
    error_rate: number;
    last_incident: string | null;
  };
}

interface MarketTrends {
  top_skills: [string, number][];
  emerging_roles: Array<{ role: string; growth: number; demand: string }>;
  industry_growth: Record<string, number>;
  salary_trends: Record<string, { min: number; max: number; median: number }>;
  geographic_distribution: Record<string, number>;
}

interface ATSDistribution {
  distribution: Record<string, number>;
  percentiles: Record<string, number>;
  common_issues: Array<{ issue: string; frequency: number }>;
  industry_benchmarks: Record<string, number>;
  average_score: number;
  median_score: number;
  improvement_over_time: Array<{ date: string; score: number }>;
}

interface ImprovementAnalytics {
  skill_gaps: Array<{ skill: string; gap_percentage: number }>;
  section_effectiveness: Record<string, { avg_score: number; impact: string }>;
  length_analysis: { min: number; max: number; optimal: number; average: number };
  keyword_density: Record<string, { current: number; recommended: number }>;
  top_recommendations: string[];
}

interface IndustryInsights {
  industries: Record<string, {
    avg_match_score: number;
    top_skills: string[];
    growth_rate: number;
    common_roles: string[];
    recommended_certifications: string[];
  }>;
  best_practices: string[];
  trending_industries: Array<{ name: string; growth: number }>;
  skill_demand: Array<{ skill: string; demand_score: number }>;
}

export default function PlatformAnalysis() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [overview, setOverview] = useState<PlatformOverview | null>(null);
  const [marketTrends, setMarketTrends] = useState<MarketTrends | null>(null);
  const [atsDistribution, setAtsDistribution] = useState<ATSDistribution | null>(null);
  const [improvementAnalytics, setImprovementAnalytics] = useState<ImprovementAnalytics | null>(null);
  const [industryInsights, setIndustryInsights] = useState<IndustryInsights | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Instead of 5 parallel hits, let's hit the aggregate dashboard endpoint we built
      const res = await api.get('/platform/dashboard');
      const dashboard = res.data.data;
      
      setOverview(dashboard.overview);
      setMarketTrends(dashboard.market_trends);
      setAtsDistribution(dashboard.ats_distribution);
      setImprovementAnalytics(dashboard.improvement_analytics);
      setIndustryInsights(dashboard.industry_insights);
    } catch (err) {
      console.error('Failed to fetch platform data:', err);
      setError('Failed to load platform analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-rose-500';
  };

  const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const renderOverview = () => {
    if (!overview) return null;

    const metrics = [
      { label: 'Total Resumes', value: formatNumber(overview.total_resumes), icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
      { label: 'Total Users', value: formatNumber(overview.total_users), icon: Users, color: 'text-green-400', bg: 'bg-green-500/10' },
      { label: 'Avg Match Score', value: `${overview.avg_match_score}%`, icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10' },
      { label: 'Success Rate', value: `${overview.success_rate}%`, icon: Award, color: 'text-amber-400', bg: 'bg-amber-500/10' },
      { label: 'Growth Rate', value: `+${overview.growth_rate}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
      { label: 'Active Users', value: formatNumber(overview.active_users), icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    ];

    return (
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${metric.bg}`}><metric.icon className={`w-5 h-5 ${metric.color}`} /></div>
              <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">{metric.label}</p>
            </div>
            <p className="text-3xl font-black">{metric.value}</p>
          </div>
        ))}
      </div>
    );
  };

  const renderMarketTrends = () => {
    if (!marketTrends) return null;

    const skillData = marketTrends.top_skills.slice(0, 8).map(([skill, count]) => ({ skill, count }));
    const industryData = Object.entries(marketTrends.industry_growth).map(([industry, growth]) => ({ industry, growth }));
    const geoData = Object.entries(marketTrends.geographic_distribution).map(([region, value]) => ({ region, value }));

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mt-8 mb-4 border-b border-slate-800 pb-2">Global Market Trends</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="w-5 h-5 text-indigo-400" />
                Top In-Demand Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="skill" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5 text-teal-400" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie data={geoData} cx="50%" cy="50%" labelLine={false} label={({ region, percent }: any) => `${region} ${((percent || 0) * 100).toFixed(0)}%`} outerRadius={100} dataKey="value">
                    {geoData.map((_, idx) => <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                Industry Growth Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={industryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="industry" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="growth" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderATSDistribution = () => {
    if (!atsDistribution) return null;

    const distributionData = Object.entries(atsDistribution.distribution).map(([range, count]) => ({ range, count }));
    const improvementData = atsDistribution.improvement_over_time;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mt-12 mb-4 border-b border-slate-800 pb-2">ATS Score Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Score Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={distributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="range" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-emerald-400" />
                Score Improvement Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={improvementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg">Common ATS Formatting Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {atsDistribution.common_issues.map((issue, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="text-slate-300 font-medium">{issue.issue}</span>
                    <span className="px-2 py-1 bg-rose-500/20 text-rose-400 rounded-md text-sm font-bold">{issue.frequency}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="text-lg">Industry Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {Object.entries(atsDistribution.industry_benchmarks).map(([industry, score]) => (
                  <div key={industry} className="text-center p-4 bg-slate-900/50 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">{industry}</p>
                    <p className={`text-3xl font-black ${getScoreColor(score)}`}>{score}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderImprovementAnalytics = () => {
    if (!improvementAnalytics) return null;
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mt-12 mb-4 border-b border-slate-800 pb-2">Resume Improvement Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="w-5 h-5 text-rose-400" />
                Most Common Skill Gaps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvementAnalytics.skill_gaps.map((gap, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <span className="font-medium text-slate-200">{gap.skill}</span>
                    <div className="flex items-center gap-4 w-1/2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${gap.gap_percentage}%` }} />
                      </div>
                      <span className="text-sm font-bold text-rose-400 w-12 text-right">{gap.gap_percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/40 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Optimal Resume Lengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Optimal Length</p>
                  <p className="text-3xl font-black text-emerald-400">{improvementAnalytics.length_analysis.optimal}</p>
                  <p className="text-xs text-slate-500 mt-1">words</p>
                </div>
                <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-sm text-slate-400 mb-1">Platform Average</p>
                  <p className="text-3xl font-black text-blue-400">{improvementAnalytics.length_analysis.average}</p>
                  <p className="text-xs text-slate-500 mt-1">words</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 font-sans pb-20 selection:bg-indigo-500/30">
      <nav className="border-b border-slate-800 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
              <Activity className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI Parser</span>
          </Link>
          <Link to="/dashboard" className="text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-3 flex items-center gap-3">
            <Activity className="h-10 w-10 text-indigo-400" />
            Platform Analysis
          </h1>
          <p className="text-slate-400 text-lg">Comprehensive global insights and intelligence aggregated across all resumes on the platform.</p>
        </div>

        {error && (
          <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 mb-8">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mb-4" />
            <h2 className="text-xl font-bold">Aggregating Global Analytics...</h2>
          </div>
        ) : (
          <>
            {renderOverview()}
            {renderMarketTrends()}
            {renderATSDistribution()}
            {renderImprovementAnalytics()}
          </>
        )}
      </main>
    </div>
  );
}
