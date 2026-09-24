import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type AgeGroup = '10-12' | '13-16';

type AppState = {
  name: string;
  age: AgeGroup | null;
  interests: string[];
  xp: number;
  lessonProgress: number;
  setAge: (a: AgeGroup) => void;
  toggleInterest: (i: string) => void;
  addXp: (n: number) => void;
  completeLessonTask: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [age, setAge] = useState<AgeGroup | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [xp, setXp] = useState(290);
  const [lessonProgress, setLessonProgress] = useState(3);

  const value = useMemo<AppState>(
    () => ({
      name: 'Алекс',
      age,
      interests,
      xp,
      lessonProgress,
      setAge,
      toggleInterest: (i) =>
        setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i])),
      addXp: (n) => setXp((x) => x + n),
      completeLessonTask: () => setLessonProgress((p) => Math.min(10, p + 1)),
    }),
    [age, interests, xp, lessonProgress],
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
