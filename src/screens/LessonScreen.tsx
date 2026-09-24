import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, Gap, Screen } from '../components/ui';
import { lessonTask } from '../data/content';
import { StackProps } from '../navigation/types';
import { useApp } from '../state/AppState';
import { colors, fonts, radius, spacing, type } from '../theme';

// AI Tutor hint ladder from the PRD: Mistake → Hint → Try again → Second hint → Explanation.
type Stage = 'answering' | 'hint1' | 'hint2' | 'explained' | 'solved';

const LADDER = ['Ошибка', 'Подсказка', 'Попытка', 'Подсказка 2', 'Разбор'];

const ladderStep: Record<Stage, number> = { answering: -1, hint1: 1, hint2: 3, explained: 4, solved: 4 };

type Message = { from: 'me' | 'tutor'; text: string; label?: string };

export default function LessonScreen({ navigation }: StackProps<'Lesson'>) {
  const { addXp, completeLessonTask, lessonProgress } = useApp();
  const [taskNumber] = useState(Math.min(10, lessonProgress + 1));
  const [stage, setStage] = useState<Stage>('answering');
  const [messages, setMessages] = useState<Message[]>([]);
  const done = stage === 'solved' || stage === 'explained';

  const answer = (i: number) => {
    const text = lessonTask.options[i];
    const mine: Message = { from: 'me', text };
    if (i === lessonTask.correct) {
      const xp = stage === 'answering' ? 30 : stage === 'hint1' ? 20 : 10;
      addXp(xp);
      completeLessonTask();
      setStage('solved');
      setMessages((m) => [
        ...m,
        mine,
        { from: 'tutor', label: `Отлично! +${xp} XP`, text: lessonTask.explanation },
      ]);
      return;
    }
    if (stage === 'answering') {
      setStage('hint1');
      setMessages((m) => [...m, mine, { from: 'tutor', label: 'AI Tutor · Подсказка 1', text: lessonTask.hints[0] }]);
    } else if (stage === 'hint1') {
      setStage('hint2');
      setMessages((m) => [...m, mine, { from: 'tutor', label: 'AI Tutor · Подсказка 2', text: lessonTask.hints[1] }]);
    } else {
      completeLessonTask();
      setStage('explained');
      setMessages((m) => [...m, mine, { from: 'tutor', label: 'AI Tutor · Разбор', text: lessonTask.explanation }]);
    }
  };

  const moreHint = () => {
    if (stage === 'hint1') {
      setStage('hint2');
      setMessages((m) => [...m, { from: 'tutor', label: 'AI Tutor · Подсказка 2', text: lessonTask.hints[1] }]);
    }
  };

  return (
    <Screen
      footer={
        done ? (
          <Button label="Вернуться на главную" onPress={() => navigation.goBack()} />
        ) : stage === 'hint1' ? (
          <Button label="Ещё подсказка" variant="secondary" onPress={moreHint} />
        ) : null
      }
    >
      <View style={styles.header}>
        <Pressable accessibilityLabel="Назад" onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={{ fontSize: 18, color: colors.textPrimary }}>←</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[type.bodyM, { fontFamily: fonts.bodySemi, color: colors.textPrimary }]}>Урок 3 · Задание {taskNumber}/10</Text>
          <Text style={[type.bodyS, { color: colors.textSecondary }]}>Проверка ответов AI</Text>
        </View>
        <Chip label="Medium" tone="warning" />
      </View>
      <Gap h={spacing.md} />

      <Card style={{ gap: 10 }}>
        <Text style={[type.overline, { color: colors.textBrand }]}>ЗАДАНИЕ</Text>
        <Text style={styles.claim}>{lessonTask.claim}</Text>
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
            <View style={styles.tutorBubble}>
              <Text style={[type.bodyS, { fontFamily: fonts.bodyBold, color: colors.textBrand }]}>{m.label}</Text>
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
          {lessonTask.options.map((o, i) => (
            <Pressable key={o} onPress={() => answer(i)} style={styles.option}>
              <Text style={[type.bodyM, { fontFamily: fonts.bodyMedium, color: colors.textPrimary }]}>{o}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Gap h={spacing.md} />
      <View style={styles.ladder}>
        <Text style={[type.bodyS, { fontFamily: fonts.bodySemi, color: colors.textOnInverse }]}>Как помогает AI Tutor</Text>
        <View style={styles.ladderRow}>
          {LADDER.map((l, i) => {
            const active = i <= ladderStep[stage] || (stage !== 'answering' && i === 0);
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
