import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, RefreshCw, Server, Database, UploadCloud, FileText, Zap, Cpu, Folder, Network } from 'lucide-react';
import api from '../services/api';

const HealthCheck = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/system/health');
      setHealthData(res.data);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setHealthData(err.response.data);
      } else {
        setError("Unable to connect to the backend server.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const renderStatusItem = (label: string, serviceKey: string, icon: React.ReactNode) => {
    const service = healthData?.services?.[serviceKey];
    const isHealthy = service?.status === 'healthy';
    
    return (
      <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-slate-800 rounded-lg text-indigo-400">
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-200">{label}</h3>
            {service?.error && <p className="text-sm text-rose-400">{service.error}</p>}
            {service?.reason && <p className="text-sm text-rose-400">{service.reason}</p>}
          </div>
        </div>
        <div>
          {isHealthy ? (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-bold">Healthy</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-rose-400">
              <XCircle className="h-5 w-5" />
              <span className="font-bold">Unhealthy</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Activity className="h-8 w-8 text-indigo-500" />
              System Health Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Monitor the status of all core services and APIs.</p>
          </div>
          <button 
            onClick={fetchHealth}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white rounded-lg font-bold transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl font-bold flex items-center gap-3">
            <XCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderStatusItem("Backend running", "backend", <Server className="h-5 w-5" />)}
          {renderStatusItem("Database connected", "database", <Database className="h-5 w-5" />)}
          {renderStatusItem("Resume upload service", "resume_upload_service", <UploadCloud className="h-5 w-5" />)}
          {renderStatusItem("Resume parser", "resume_parser", <FileText className="h-5 w-5" />)}
          {renderStatusItem("Job Match API", "job_match_api", <Zap className="h-5 w-5" />)}
          {renderStatusItem("Gemini AI", "gemini_ai", <Cpu className="h-5 w-5" />)}
          {renderStatusItem("Upload folder exists", "upload_folder", <Folder className="h-5 w-5" />)}
          {renderStatusItem("Endpoint registration", "endpoint_registration", <Network className="h-5 w-5" />)}
        </div>

        {healthData && (
          <div className="mt-8 p-6 bg-slate-800/30 border border-slate-700 rounded-xl">
            <h3 className="font-bold text-slate-300 mb-4">System Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="block text-slate-500">Python Version</span>
                <span className="font-mono text-slate-300">{healthData.system?.python_version}</span>
              </div>
              <div>
                <span className="block text-slate-500">Platform</span>
                <span className="font-mono text-slate-300">{healthData.system?.platform}</span>
              </div>
              <div>
                <span className="block text-slate-500">Environment</span>
                <span className="font-mono text-slate-300">{healthData.system?.environment}</span>
              </div>
              <div>
                <span className="block text-slate-500">Timestamp</span>
                <span className="font-mono text-slate-300">{healthData.system?.timestamp ? new Date(healthData.system.timestamp).toLocaleString() : ''}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheck;
