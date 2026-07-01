export interface CandidateData {
  name: string;
  resumeText: string;
  skills: string[];
  experience: number;
  education: string;
  certifications: string[];
  projects: {
    name: string;
    tech: string[];
    impact: string;
    complexity?: number;
    relevance?: number;
  }[];
  jobDescription?: string;
  // added for Recruiter notes
  resumeQuality?: {
    actionVerbsCount: number;
    readabilityScore: number;
    grammarScore: number;
  };
  leadershipDetails?: {
    teamSize: number;
    initiatives: number;
    mentorshipCount: number;
  };
}

export interface JobDescriptionData {
  text: string;
  requiredSkills: string[];
  requiredExperience: number;
}

export interface ScoreBreakdown {
  overallScore: number;
  technicalScore: number;
  experienceScore: number;
  educationScore: number;
  projectsScore: number;
  communicationScore: number;
  leadershipScore: number;
}

export interface RecruiterEvaluation {
  strengths: string[];
  concerns: string[];
  notes: string[];
  decision: string;
  suggestedSalary: string;
  idealRoleMatch: string;
}

export interface AnalysisResult {
  scores: ScoreBreakdown;
  evaluation: RecruiterEvaluation;
  hiringProbability: {
    shortlisting: number;
    interview: number;
    hiring: number;
    placement: number;
    suggestions: string[];
  };
}

const mockJobDetails: JobDescriptionData = {
  text: "We are looking for a Senior Frontend Developer with React, TypeScript, and Node.js experience.",
  requiredSkills: ["React", "TypeScript", "Node.js", "AWS", "Python", "Tailwind"],
  requiredExperience: 5
};

export function calculateScores(candidate: CandidateData, job: JobDescriptionData = mockJobDetails): AnalysisResult {
  // 1. Technical Skills (Matching Skills / Total Required Skills) * 100
  const matchedSkills = candidate.skills.filter(s => 
    job.requiredSkills.some(rs => rs.toLowerCase() === s.toLowerCase())
  );
  const technicalScore = Math.min((matchedSkills.length / job.requiredSkills.length) * 100, 100) || 0;

  // 2. Experience Score MIN((Years / Required Years) * 100, 100)
  const experienceScore = Math.min((candidate.experience / job.requiredExperience) * 100, 100) || 0;

  // 3. Education Score: PhD: 100, Master's: 85, Bachelor's: 70, Others: 50
  let educationScore = 50;
  const eduLower = candidate.education.toLowerCase();
  if (eduLower.includes("phd") || eduLower.includes("doctorate")) {
    educationScore = 100;
  } else if (eduLower.includes("master")) {
    educationScore = 85;
  } else if (eduLower.includes("bachelor")) {
    educationScore = 70;
  }

  // 4. Project Score = (Complexity + Relevance + Impact) / 3 (Assuming max 100)
  let projectsScore = 0;
  if (candidate.projects.length > 0) {
    const projScores = candidate.projects.map(p => {
      const complexity = p.complexity || 80; // mock default
      const relevance = p.relevance || 75; // mock default
      const impactScore = p.impact.length > 10 ? 90 : 50; 
      return (complexity + relevance + impactScore) / 3;
    });
    projectsScore = projScores.reduce((a, b) => a + b, 0) / projScores.length;
  }

  // 5. Communication Score = Resume readability + Action verbs + Grammar
  const comms = candidate.resumeQuality || { readabilityScore: 85, actionVerbsCount: 15, grammarScore: 90 };
  const actionVerbsScore = Math.min((comms.actionVerbsCount / 20) * 100, 100);
  const communicationScore = (comms.readabilityScore + actionVerbsScore + comms.grammarScore) / 3;

  // 6. Leadership Score = (Team Size*2) + (Initiatives*5) + (Mentorship*3) -> scaled to 100
  const lead = candidate.leadershipDetails || { teamSize: 5, initiatives: 3, mentorshipCount: 2 };
  const rawLead = (lead.teamSize * 2) + (lead.initiatives * 5) + (lead.mentorshipCount * 3);
  // Assume max raw score expected is around 50 for 100%
  const leadershipScore = Math.min((rawLead / 50) * 100, 100);

  // 7. Overall Score
  // Weights: Skills 35%, Experience 25%, Education 15%, Projects 15%, Communication 5%, Leadership 5%
  const overallScore = 
    (technicalScore * 0.35) +
    (experienceScore * 0.25) +
    (educationScore * 0.15) +
    (projectsScore * 0.15) +
    (communicationScore * 0.05) +
    (leadershipScore * 0.05);

  // Generate Recruiter Evaluation
  const strengths = [];
  const concerns = [];
  const notes = [];

  if (technicalScore > 80) strengths.push("Strong foundational skills detected.");
  else concerns.push("Skill gap detected against job requirements.");

  if (experienceScore >= 100) strengths.push(`Meets or exceeds the ${job.requiredExperience} years of required experience.`);
  else concerns.push(`Slightly under-indexed on required experience (${candidate.experience} vs ${job.requiredExperience} yrs).`);

  if (educationScore >= 70) strengths.push("Solid educational background.");
  if (communicationScore > 85) notes.push("Resume is well-written, clear, and uses strong action verbs.");
  else notes.push("Resume could use better formatting and stronger action verbs.");

  if (projectsScore > 80) notes.push("Impressive projects with measurable impact.");

  let decision = "PENDING";
  if (overallScore >= 85) decision = "LIKELY SHORTLIST";
  else if (overallScore >= 70) decision = "MAYBE SHORTLIST";
  else if (overallScore >= 50) decision = "NEEDS IMPROVEMENT";
  else decision = "REJECT RISK";

  // Hiring Probabilities mapping (slight variations from overall to look realistic)
  const shortlisting = Math.min(overallScore + 5, 100);
  const interview = Math.max(overallScore - 10, 0);
  const hiring = Math.max(overallScore - 15, 0);
  const placement = overallScore;

  const suggestions = [];
  if (technicalScore < 75) suggestions.push("Add more relevant keywords matching the job description (e.g., " + job.requiredSkills.filter(s => !matchedSkills.includes(s)).join(", ") + ").");
  if (experienceScore < 80) suggestions.push("Highlight freelance or personal projects to compensate for traditional experience years.");
  if (projectsScore < 80) suggestions.push("Quantify your project impacts (e.g., 'Increased sales by X%').");
  if (leadershipScore < 50) suggestions.push("Include any instances where you mentored peers or led an initiative.");

  if (suggestions.length === 0) suggestions.push("Your profile looks solid! Ensure your LinkedIn is up to date and prepare for technical interviews.");

  return {
    scores: {
      overallScore,
      technicalScore,
      experienceScore,
      educationScore,
      projectsScore,
      communicationScore,
      leadershipScore
    },
    evaluation: {
      strengths,
      concerns,
      notes,
      decision,
      suggestedSalary: "$120k - $150k",
      idealRoleMatch: "Senior Frontend Engineer"
    },
    hiringProbability: {
      shortlisting,
      interview,
      hiring,
      placement,
      suggestions
    }
  };
}
