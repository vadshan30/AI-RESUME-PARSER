import { create } from 'zustand';

interface StudioStore {
  templates: any[];
  selectedTemplate: any | null;
  resumeData: any | null;
  isDownloading: boolean;
  error: string | null;

  fetchTemplates: () => Promise<void>;
  selectTemplate: (tpl: any) => void;
  setResumeData: (data: any) => void;
  downloadDocument: (format: 'pdf' | 'docx') => Promise<void>;
  aiRewrite: (text: string, tone: string) => Promise<string>;
}

export const useStudioStore = create<StudioStore>((set, get) => ({
  templates: [],
  selectedTemplate: null,
  resumeData: null,
  isDownloading: false,
  error: null,

  fetchTemplates: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/studio/templates');
      const res = await response.json();
      set({ templates: res.data });
      if (res.data.length > 0) {
        set({ selectedTemplate: res.data[0] });
      }
    } catch (err: any) {
      set({ error: "Failed to load templates." });
    }
  },

  selectTemplate: (tpl) => set({ selectedTemplate: tpl }),
  
  setResumeData: (data) => set({ resumeData: data }),

  downloadDocument: async (format: 'pdf' | 'docx') => {
    const { selectedTemplate, resumeData } = get();
    if (!selectedTemplate || !resumeData) return;

    set({ isDownloading: true, error: null });

    try {
      const response = await fetch(`http://localhost:8000/api/studio/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_id: selectedTemplate.id,
          resume_data: resumeData
        }),
      });

      if (!response.ok) {
        // Handle server error nicely, especially if dependencies are missing
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `Export failed. Please check backend dependencies (pip install fpdf2 python-docx).`);
      }

      // Trigger file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `resume_${selectedTemplate.id}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      set({ isDownloading: false });
    } catch (err: any) {
      set({ error: err.message, isDownloading: false });
    }
  },

  aiRewrite: async (text: string, tone: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/studio/ai-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone }),
      });
      const res = await response.json();
      return res.data.rewritten;
    } catch (err) {
      return text;
    }
  }
}));
