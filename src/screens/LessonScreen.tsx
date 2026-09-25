import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, Gap, Screen, Tone } from '../components/ui';
import { course, currentTask, Difficulty, nextTask, TaskRef } from '../data/course';
import { StackProps } from '../navigation/types';
import { useApp } from '../state/AppState';
import { colors, fonts, radius, spacing, type } from '../theme';

// AI Tutor hint ladder from the PRD: Mistake → Hint → Try again → Second hint → Explanation.
type Stage = 'answering' | 'hint1' | 'hint2' | 'explained' | 'solved';

const LADDER = ['Ошибка', 'Подсказка', 'Попытка', 'Подсказка 2', 'Разбор'];
const ladderStep: Record<Stage, number> = { answering: -1, hint1: 1, hint2: 3, explained: 4, solved: 4 };
const xpFor: Partial<Record<Stage, number>> = { answering: 30, hint1: 20, hint2: 10 };
const difficultyTone: Record<Difficulty, Tone> = { easy: 'accent', medium: 'warning', challenge: 'danger' };
const difficultyLabel: Record<Difficulty, string> = { easy: 'Easy', medium: 'Medium', challenge: 'Challenge' };

type Message = { from: 'me' | 'tutor'; text: string; label?: string; success?: boolean };

export default function LessonScreen({ navigation }: StackProps<'Lesson'>) {
  const { completed, cursor } = useApp();
  const ref = currentTask(completed, cursor);

  if (!ref) {
    return (
      <Screen footer={<Button label="Мой путь" onPress={() => navigation.navigate('Main', { screen: 'Path' })} />}>
        <View style={styles.doneWrap}>
          <View style={styles.doneIcon}>
            <Text style={{ fontSize: 36 }}>🎉</Text>
          </View>
          <Text style={[type.headingL, { color: colors.textPrimary, textAlign: 'center' }]}>Все доступные модули пройдены!</Text>
          <Text style={[type.bodyL, { color: colors.textSecondary, textAlign: 'center' }]}>
            Ты прошёл модули 1–3. Новые модули скоро откроются — а пока можно повторить любой урок на вкладке «Путь».
          </Text>
        </View>
      </Screen>
    );
  }
  // Keyed by task id so every task starts with a fresh hint ladder.
  return <TaskView key={ref.id} current={ref} onBack={() => navigation.goBack()} />;
}

function TaskView({ current, onBack }: { current: TaskRef; onBack: () => void }) {
  const { award, completeTask, setCursor } = useApp();
  const [stage, setStage] = useState<Stage>('answering');
  const [messages, setMessages] = useState<Message[]>([]);
  const lesson = course[current.module].lessons[current.lesson];
  const task = lesson.tasks[current.task];
  const done = stage === 'solved' || stage === 'explained';
  const next = nextTask(current.id);
  const lessonFinished = !next || next.lesson !== current.lesson || next.module !== current.module;
  const moduleFinished = !next || next.module !== current.module;

  const tutor = (label: string, text: string, success?: boolean): Message => ({ from: 'tutor', label, text, success });

  const answer = (i: number) => {
    const mine: Message = { from: 'me', text: task.options[i] };
    // Pin this task so finishing it doesn't immediately swap the view to the next unfinished one.
    setCursor(current.id);
    if (i === task.answer) {
      const xp = xpFor[stage] ?? 10;
      // award() pays once per task, so replaying a lesson can't farm XP.
      const paid = award(current.id, xp);
      completeTask(current.id);
      setStage('solved');
      const text = paid ? task.explanation : `${task.explanation} Ты уже решал это задание — XP начисляется только один раз.`;
      setMessages((m) => [...m, mine, tutor(paid ? `Отлично! +${xp} XP` : 'Верно!', text, true)]);
    } else if (stage === 'answering') {
      setStage('hint1');
      setMessages((m) => [...m, mine, tutor('AI Tutor · Подсказка 1', task.hints[0])]);
    } else if (stage === 'hint1') {
      setStage('hint2');
      setMessages((m) => [...m, mine, tutor('AI Tutor · Подсказка 2', task.hints[1])]);
    } else {
      // The answer was revealed, so this task can no longer earn XP.
      award(current.id, 0);
      completeTask(current.id);
      setStage('explained');
      setMessages((m) => [...m, mine, tutor('AI Tutor · Разбор', task.explanation)]);
    }
  };

  const moreHint = () => {
    setStage('hint2');
    setMessages((m) => [...m, tutor('AI Tutor · Подсказка 2', task.hints[1])]);
  };

  const nextLabel = !next ? 'Завершить' : moduleFinished ? 'Следующий модуль' : lessonFinished ? 'Следующий урок' : 'Следующее задание';

  return (
    <Screen
      footer={
        done ? (
          <Button label={nextLabel} onPress={() => setCursor(next?.id ?? null)} />
        ) : stage === 'hint1' ? (
          <Button label="Ещё подсказка" variant="secondary" onPress={moreHint} />
        ) : null
      }
    >
      <View style={styles.header}>
        <Pressable accessibilityLabel="Назад" onPress={onBack} style={styles.back}>
          <Text style={{ fontSize: 18, color: colors.textPrimary }}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[type.bodyM, { fontFamily: fonts.bodySemi, color: colors.textPrimary }]}>
            Модуль {current.module + 1} · Урок {current.lesson + 1}
          </Text>
          <Text numberOfLines={1} style={[type.bodyS, { color: colors.textSecondary }]}>
            {lesson.title}
          </Text>
        </View>
        <Chip label={difficultyLabel[task.difficulty]} tone={difficultyTone[task.difficulty]} />
      </View>
      <Gap h={spacing.sm} />
      <View style={styles.lessonBars}>
        {lesson.tasks.map((_, i) => (
          <View
            key={i}
            style={[styles.lessonBar, { backgroundColor: i < current.task || (i === current.task && done) ? colors.bgBrand : colors.bgTrack }]}
          />
        ))}
      </View>
      <Gap h={spacing.md} />

      <Card style={{ gap: 10 }}>
        <Text style={[type.overline, { color: colors.textBrand }]}>
          ЗАДАНИЕ {current.task + 1} ИЗ {lesson.tasks.length}
        </Text>
        <Text style={styles.claim}>{task.question}</Text>
      </Card>
      <Gap h={spacing.md} />

      {messages.map((m, i) =>
        m.from === 'me' ? (
          <View key={i} style={styles.meRow}>
            <View style={styles.meBubble}>
              <Text style={[type.bodyM, { color: colors.textOnBrand }]}>{m.text}</Text>
            </View>
          </View>
        ) : (
          <View key={i} style={styles.tutorRow}>
            <View style={styles.tutorAvatar}>
              <Text style={styles.tutorAvatarText}>AI</Text>
            </View>
            <View style={[styles.tutorBubble, m.success && styles.tutorBubbleSuccess]}>
              <Text style={[type.bodyS, { fontFamily: fonts.bodyBold, color: m.success ? colors.textSuccess : colors.textBrand }]}>
                {m.label}
              </Text>
              <Text style={[type.bodyM, { color: colors.textPrimary }]}>{m.text}</Text>
            </View>
          </View>
        ),
      )}

      {!done ? (
        <View style={{ gap: spacing.xs }}>
          <Text style={[type.bodyS, { color: colors.textSecondary }]}>
            {stage === 'answering' ? 'Выбери ответ:' : 'Попробуй ещё раз:'}
          </Text>
          {task.options.map((o, i) => (
            <Pressable key={o} onPress={() => answer(i)} style={styles.option}>
              <Text style={[type.bodyM, { fontFamily: fonts.bodyMedium, color: colors.textPrimary }]}>{o}</Text>
            </Pressable>
          ))}
        </View>
      ) : lessonFinished ? (
        <View style={styles.banner}>
          <Text style={{ fontSize: 22 }}>🏆</Text>
          <Text style={styles.bannerText}>{moduleFinished ? `Модуль ${current.module + 1} пройден!` : `Урок «${lesson.title}» пройден!`}</Text>
        </View>
      ) : null}

      <Gap h={spacing.md} />
      <View style={styles.ladder}>
        <Text style={[type.bodyS, { fontFamily: fonts.bodySemi, color: colors.textOnInverse }]}>Как помогает AI Tutor</Text>
        <View style={styles.ladderRow}>
          {LADDER.map((l, i) => {
            const active = i <= ladderStep[stage] || (stage !== 'answering' && stage !== 'solved' && i === 0);
            return (
              <View key={l} style={styles.ladderItem}>
                <View style={[styles.ladderDot, active ? { backgroundColor: colors.bgAccent } : styles.ladderDotOff]} />
                <Text style={[styles.ladderText, { color: active ? colors.textOnInverse : colors.textOnInverseSecondary }]}>{l}</Text>
              </View>
            );
          })}
        </View>
        <Text style={[type.caption, { color: colors.textOnInverseSecondary }]}>
          Готовый ответ — только в конце. Сначала ты думаешь сам.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonBars: { flexDirection: 'row', gap: 6 },
  lessonBar: { flex: 1, height: 6, borderRadius: 3 },
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.bgAccentSubtle, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.xs },
  bannerText: { fontFamily: fonts.headingSemi, fontSize: 15, color: colors.textPrimary, flex: 1 },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingTop: 80 },
  doneIcon: { width: 80, height: 80, borderRadius: 28, backgroundColor: colors.bgAccent, alignItems: 'center', justifyContent: 'center' },
  claim: { fontFamily: fonts.headingMedium, fontSize: 15, lineHeight: 22, color: colors.textPrimary },
  meRow: { alignItems: 'flex-end', marginBottom: 10 },
  meBubble: { backgroundColor: colors.bgBrand, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 16, maxWidth: '85%' },
  tutorRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  tutorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgInverse,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tutorAvatarText: { fontFamily: fonts.headingBold, fontSize: 11, color: colors.bgAccent },
  tutorBubbleSuccess: { backgroundColor: colors.bgSuccessSubtle, borderColor: colors.borderSuccess },
  tutorBubble: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
  },
  option: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
  },
  ladder: { backgroundColor: colors.bgInverse, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  ladderRow: { flexDirection: 'row' },
  ladderItem: { flex: 1, alignItems: 'center', gap: 6 },
  ladderDot: { width: 14, height: 14, borderRadius: 7 },
  ladderDotOff: { borderWidth: 1.5, borderColor: colors.textOnInverseSecondary },
  ladderText: { fontFamily: fonts.bodyMedium, fontSize: 10, textAlign: 'center' },
});
