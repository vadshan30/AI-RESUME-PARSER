import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import PlatformAnalysis from './pages/PlatformAnalysis';
import History from './pages/History.tsx';
import Upload from './pages/Upload';
import JobMatch from './pages/JobMatch';
import ImproveResume from './pages/ImproveResume';
import Improver from './pages/Improver';
import SkillGap from './pages/SkillGap';
import Roadmap from './pages/Roadmap';
import Templates from './pages/Templates';
import CareerInsights from './pages/CareerInsights';
import ResumeVsTopCandidate from './pages/ResumeVsTopCandidate';
import HealthCheck from './pages/HealthCheck';
import { ErrorBoundary } from './components/ErrorBoundary';

import ResumeIntelligenceHub from './pages/ResumeIntelligenceHub';
import AICareerIntelligence from './pages/AICareerIntelligence';
import ResumeXRay from './pages/ResumeXRay';
import RecruiterView from './pages/RecruiterView';
import AICareerTwin from './pages/AICareerTwin';
import InterviewSimulator from './pages/InterviewSimulator';

const RedirectAnalysis = () => {
  const { id } = useParams();
  return <Navigate to={`/dashboard/analysis/${id}`} replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirects to Dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Feature Routes */}
      <Route path="/dashboard/upload" element={<Upload />} />
      <Route path="/dashboard/history" element={<History />} />
      <Route path="/dashboard/job-match" element={<JobMatch />} />
      <Route path="/dashboard/improve-resume" element={<ImproveResume />} />
      <Route path="/dashboard/resume-improver" element={<Improver />} />
      <Route path="/dashboard/skill-gap" element={<SkillGap />} />
      <Route path="/dashboard/learning-roadmap" element={<ErrorBoundary><Roadmap /></ErrorBoundary>} />
      <Route path="/dashboard/resume-templates" element={<Templates />} />
      <Route path="/dashboard/career-insights" element={<CareerInsights />} />
      <Route path="/dashboard/resume-vs-top-candidate" element={<ResumeVsTopCandidate />} />
      <Route path="/dashboard/health" element={<HealthCheck />} />
      
      {/* Resume Intelligence Center Routes */}
      <Route path="/dashboard/analyze-resume" element={<ResumeIntelligenceHub />} />
      <Route path="/dashboard/career-intelligence" element={<AICareerIntelligence />} />
      <Route path="/dashboard/resume-xray" element={<ResumeXRay />} />
      <Route path="/dashboard/recruiter-view" element={<RecruiterView />} />
      <Route path="/dashboard/career-twin" element={<AICareerTwin />} />
      <Route path="/dashboard/interview-simulator" element={<InterviewSimulator />} />
      
      {/* Fallback old Analysis route just in case */}
      <Route path="/dashboard/analysis/:id" element={<Analysis />} />
      <Route path="/analysis/:id" element={<RedirectAnalysis />} />
      
      {/* Platform Analytics */}
      <Route path="/dashboard/platform-analysis" element={<PlatformAnalysis />} />
      
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-slate-900 min-h-screen font-sans text-slate-100">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}

export default App;
