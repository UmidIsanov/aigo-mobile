import { createContext, ReactNode, useContext, useMemo, useRef, useState } from 'react';

export type AgeGroup = '10-12' | '13-16';

type AppState = {
  name: string;
  age: AgeGroup | null;
  interests: string[];
  xp: number;
  /** Onboarding thinking check: one entry per question, true if answered correctly. */
  assessment: boolean[] | null;
  /** Course task ids the student has finished (solved or saw the explanation). */
  completed: string[];
  /** Course task the student is on; null means "first unfinished task". */
  cursor: string | null;
  setAge: (a: AgeGroup) => void;
  toggleInterest: (i: string) => void;
  /** Adds XP for a question once; returns false if this question was already rewarded. */
  award: (questionId: string, xp: number) => boolean;
  completeTask: (taskId: string) => void;
  setCursor: (taskId: string | null) => void;
  saveAssessment: (answers: boolean[]) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [assessment, saveAssessment] = useState<boolean[] | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  // A ref, not state, so two quick taps can't both pass the "already rewarded" check.
  const rewarded = useRef(new Set<string>());

  const value = useMemo<AppState>(
    () => ({
      name: 'Алекс',
      age,
      interests,
      xp,
      assessment,
      completed,
      cursor,
      setAge,
      toggleInterest: (i) =>
        setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])),
      award: (questionId, amount) => {
        if (rewarded.current.has(questionId)) return false;
        rewarded.current.add(questionId);
        setXp((x) => x + amount);
        return true;
      },
      completeTask: (id) => setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id])),
      setCursor,
      saveAssessment,
    }),
    [age, interests, xp, assessment, completed, cursor],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppStateProvider');
  return v;
}

export const XP_PER_LEVEL = 500;

export function levelInfo(xp: number) {
  const titles = ['AI Explorer', 'AI Researcher', 'Critical Thinker', 'AI Creator', 'AI Coder'];
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  return {
    level,
    title: titles[Math.min(level - 1, titles.length - 1)],
    next: titles[Math.min(level, titles.length - 1)],
    inLevel: xp % XP_PER_LEVEL,
  };
}

export type AssessmentLevel = 'start' | 'middle' | 'advanced';

export function assessmentLevel(score: number, total: number): AssessmentLevel {
  if (score === total) return 'advanced';
  return score >= Math.ceil(total / 2) ? 'middle' : 'start';
}
