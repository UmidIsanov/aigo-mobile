import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Gap, Radio, Screen, Steps, Title } from '../components/ui';
import { Actor, quiz } from '../data/content';
import { StackProps } from '../navigation/types';
import { useApp } from '../state/AppState';
import { colors, fonts, radius, spacing, type } from '../theme';

export default function QuizScreen({ navigation }: StackProps<'Quiz'>) {
  const { award } = useApp();
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState<Actor | null>(null);
  const [earned, setEarned] = useState(0);
  const [gotXp, setGotXp] = useState(false);
  const question = quiz[q];
  const correct = picked === question.answer;
  const isLast = q === quiz.length - 1;

  const pick = (a: Actor) => {
    if (picked) return;
    setPicked(a);
    // XP is paid once per question, so going back and re-answering doesn't farm points.
    const paid = a === question.answer && award(`quiz-${q + 1}`, 10);
    setGotXp(paid);
    if (paid) setEarned((e) => e + 10);
  };

  const next = () => {
    if (isLast) return navigation.navigate('Check');
    setQ(q + 1);
    setPicked(null);
  };

  return (
    <Screen
      footer={<Button label={isLast ? 'Дальше' : 'Следующий вопрос'} disabled={!picked} onPress={next} />}
    >
      <View style={styles.top}>
        <View style={{ flex: 1 }}>
          <Steps total={7} active={3} />
        </View>
        <Chip label={`+${earned} XP`} tone="accent" />
      </View>
      <Gap h={spacing.xl} />
      <Chip label={`Вопрос ${q + 1} из ${quiz.length}`} />
      <Gap h={spacing.sm} />
      <Title>Кто справится лучше?</Title>
      <Gap h={spacing.md} />

      <View style={styles.question}>
        <Text style={[type.overline, { color: colors.bgAccent }]}>ЗАДАЧА</Text>
        <Text style={styles.questionText}>{question.task}</Text>
      </View>
      <Gap h={spacing.md} />

      {question.options.map((o) => {
        const isPicked = picked === o.actor;
        const isAnswer = picked && o.actor === question.answer;
        const wrong = isPicked && !correct;
        return (
          <Pressable
            key={o.actor}
            onPress={() => pick(o.actor)}
            style={[
              styles.option,
              isAnswer && { borderColor: colors.borderSuccess, backgroundColor: colors.bgSuccessSubtle, borderWidth: 2 },
              wrong && { borderColor: colors.bgDanger, backgroundColor: colors.bgDangerSubtle, borderWidth: 2 },
            ]}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[type.bodyL, { fontFamily: fonts.bodySemi, color: colors.textPrimary }]}>{o.actor}</Text>
              <Text style={[type.bodyS, { color: colors.textSecondary }]}>{o.hint}</Text>
            </View>
            <Radio selected={!!(isPicked || isAnswer)} color={wrong ? colors.bgDanger : colors.bgSuccess} />
          </Pressable>
        );
      })}

      {picked ? (
        <View style={[styles.feedback, { borderColor: correct ? colors.borderSuccess : colors.bgDanger }]}>
          <Text style={[type.headingS, { color: correct ? colors.textSuccess : colors.textDanger }]}>
            {correct ? (gotXp ? 'Верно! +10 XP' : 'Верно! XP за этот вопрос уже получен.') : 'Не совсем'}
          </Text>
          <Text style={[type.bodyM, { color: colors.textPrimary }]}>{question.explanation}</Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  question: { backgroundColor: colors.bgInverse, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs },
  questionText: { fontFamily: fonts.headingMedium, fontSize: 15, lineHeight: 22, color: colors.textOnInverse },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    paddingVertical: spacing.sm,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  feedback: { backgroundColor: colors.bgSurface, borderRadius: radius.md, borderWidth: 1.5, padding: spacing.md, gap: 6, marginTop: 4 },
});
