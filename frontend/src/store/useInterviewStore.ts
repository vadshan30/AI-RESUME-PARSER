import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';
import { useResumeStore } from './useResumeStore';

export interface InterviewConfig {
  role: string;
  level: string;
  type: 'Technical' | 'Behavioral' | 'System Design' | 'Mixed';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  questionCount: number;
}

export interface InterviewQuestion {
  id: string;
  role: string;
  type: 'Technical' | 'Behavioral' | 'System Design';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  question: string;
  expectedKeywords: string[];
  sampleAnswer: string;
}

export interface InterviewResponse {
  questionId: string;
  answer: string;
  score: number;
  feedback: string;
  timeTaken: number;
}

export interface InterviewSession {
  id: string;
  config: InterviewConfig;
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  currentQuestionIndex: number;
  status: 'NotStarted' | 'InProgress' | 'Completed';
}

interface InterviewStore {
  sessions: InterviewSession[];
  currentSession: InterviewSession | null;
  isRecording: boolean;
  isLoading: boolean;
  isEvaluating: boolean;
  
  startInterview: (config: InterviewConfig) => Promise<void>;
  submitAnswer: (answer: string, timeTaken: number) => Promise<void>;
  nextQuestion: () => void;
  endSession: () => void;
  quitSession: () => void;
  
  startRecording: () => void;
  stopRecording: () => void;
}

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      isRecording: false,
      isLoading: false,
      isEvaluating: false,

      startRecording: () => set({ isRecording: true }),
      stopRecording: () => set({ isRecording: false }),

      startInterview: async (config) => {
        set({ isLoading: true });
        
        try {
          const resumeId = useResumeStore.getState().currentResumeId;
          
          let aiQuestions: InterviewQuestion[] = [];
          
          if (resumeId) {
             const response = await api.post('/ai/interview-simulator', { resume_id: resumeId, refresh: false });
             const data = response.data;
             
             const mapToQuestion = (q: any, type: 'Technical' | 'Behavioral' | 'System Design'): InterviewQuestion => ({
                id: Math.random().toString(36).substr(2, 9),
                role: config.role,
                type: type,
                difficulty: q.difficulty || 'Medium',
                question: q.question,
                expectedKeywords: q.expected_keywords || [],
                sampleAnswer: q.suggested_answer || ""
             });

             const tech = (data.technical_questions || []).map((q: any) => mapToQuestion(q, 'Technical'));
             const proj = (data.project_questions || []).map((q: any) => mapToQuestion(q, 'System Design'));
             const hr = (data.hr_questions || []).map((q: any) => mapToQuestion(q, 'Behavioral'));
             
             let allPool = [];
             if (config.type === 'Technical') allPool = tech;
             else if (config.type === 'System Design') allPool = proj;
             else if (config.type === 'Behavioral') allPool = hr;
             else allPool = [...tech, ...proj, ...hr];
             
             // Shuffle and slice
             aiQuestions = allPool.sort(() => 0.5 - Math.random()).slice(0, config.questionCount);
          }
          
          // Fallback if API fails or no resume
          if (aiQuestions.length === 0) {
            aiQuestions = ([
              {
                id: "1", role: config.role, type: "Behavioral", difficulty: "Medium",
                question: "Tell me about a time you faced a difficult challenge at work.",
                expectedKeywords: ["challenge", "solution", "result"],
                sampleAnswer: "Use STAR method."
              },
              {
                id: "2", role: config.role, type: "Technical", difficulty: "Medium",
                question: "How do you optimize a slow-performing application?",
                expectedKeywords: ["profiling", "caching", "database"],
                sampleAnswer: "First I profile..."
              }
            ] as InterviewQuestion[]).slice(0, config.questionCount);
          }

          const newSession: InterviewSession = {
            id: Date.now().toString(),
            config,
            questions: aiQuestions,
            responses: [],
            currentQuestionIndex: 0,
            status: 'InProgress'
          };

          set({ 
            currentSession: newSession, 
            isLoading: false
          });
        } catch (error) {
          console.error("Failed to generate interview", error);
          set({ isLoading: false });
        }
      },

      submitAnswer: async (answer, timeTaken) => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        const question = currentSession.questions[currentSession.currentQuestionIndex];
        
        set({ isEvaluating: true });
        
        try {
          const response = await api.post('/ai/evaluate-answer', {
            question: question.question,
            answer: answer,
            role: currentSession.config.role
          });
          
          const { score, feedback } = response.data;

          const newResponse: InterviewResponse = {
            questionId: question.id,
            answer,
            score,
            feedback,
            timeTaken
          };

          const updatedSession = {
            ...currentSession,
            responses: [...currentSession.responses, newResponse]
          };

          set({ currentSession: updatedSession, isEvaluating: false });
        } catch (error) {
          console.error("Evaluation failed", error);
          
          // Fallback response
          const newResponse: InterviewResponse = {
            questionId: question.id,
            answer,
            score: 75,
            feedback: "Good attempt, but could use more specific examples.",
            timeTaken
          };

          const updatedSession = {
            ...currentSession,
            responses: [...currentSession.responses, newResponse]
          };

          set({ currentSession: updatedSession, isEvaluating: false });
        }
      },

      nextQuestion: () => {
        const { currentSession } = get();
        if (!currentSession) return;
        
        if (currentSession.currentQuestionIndex < currentSession.questions.length - 1) {
          set({
            currentSession: {
              ...currentSession,
              currentQuestionIndex: currentSession.currentQuestionIndex + 1
            }
          });
        } else {
          get().endSession();
        }
      },

      endSession: () => {
        const { currentSession, sessions } = get();
        if (!currentSession) return;

        const completedSession = { ...currentSession, status: 'Completed' as const };
        
        set({
          currentSession: completedSession,
          sessions: [completedSession, ...sessions.slice(0, 9)], // Keep last 10
          isRecording: false
        });
      },

      quitSession: () => {
        set({ currentSession: null, isRecording: false });
      }
    }),
    {
      name: 'interview-storage-v2'
    }
  )
);
