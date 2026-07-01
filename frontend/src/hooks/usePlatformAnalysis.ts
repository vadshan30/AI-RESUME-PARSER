import { useState, useCallback } from 'react';
import { RoleAnalysisData } from '../types/PlatformAnalysisData';
import { PlatformAnalysisService } from '../lib/PlatformAnalysisService';

export const usePlatformAnalysis = () => {
  const [data, setData] = useState<RoleAnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeResume = useCallback(async (file: File, role?: string) => {
    setLoading(true);
    setError(null);
    try {
      const service = new PlatformAnalysisService();
      
      // Simulate a network delay for better UX
      const [analysis] = await Promise.all([
        service.analyzeResume(file, role),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      
      setData(analysis);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, analyzeResume, loading, error };
};
