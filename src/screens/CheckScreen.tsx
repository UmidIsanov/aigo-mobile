import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Chip, Gap, Screen, Steps, Title } from '../components/ui';
import { checkQuestions, levelNames, levelTexts, Skill, skillNames } from '../data/content';
import { StackProps } from '../navigation/types';
import { assessmentLevel, useApp } from '../state/AppState';
import { colors, fonts, radius, spacing, type } from '../theme';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function CheckScreen({ navigation }: StackProps<'Check'>) {
  const { addXp, saveAssessment } = useApp();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const q = checkQuestions[index];
  const correct = picked === q.answer;
  const isLast = index === checkQuestions.length - 1;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setAnswers((a) => [...a, i === q.answer]);
    if (i === q.answer) addXp(10);
  };

  const next = () => {
    if (!isLast) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    saveAssessment(answers);
    setShowResult(true);
  };

  if (showResult) return <Result answers={answers} onNext={() => navigation.navigate('Insight')} />;

  return (
    <Screen footer={<Button label={isLast ? 'Посмотреть результат' : 'Следующее задание'} disabled={picked === null} onPress={next} />}>
      <Steps total={7} active={4} />
      <Gap h={spacing.xl} />
      <View style={styles.row}>
        <Chip label="Проверка мышления" tone="info" />
        <Chip label={`Задание ${index + 1} из ${checkQuestions.length}`} />
      </View>
      <Gap h={spacing.sm} />
      <Title>Как ты думаешь?</Title>
      {index === 0 ? (
        <>
          <Gap h={spacing.xs} />
          <Body>5 коротких заданий. Это не экзамен — так мы поймём, с какого уровня тебе интереснее начать.</Body>
        </>
      ) : null}
      <Gap h={spacing.md} />

      <View style={styles.question}>
        <Text style={[type.overline, { color: colors.textBrand }]}>{skillNames[q.skill].toUpperCase()}</Text>
        <Text style={styles.questionText}>{q.text}</Text>
      </View>
      <Gap h={spacing.md} />

      {q.options.map((o, i) => {
        const isAnswer = picked !== null && i === q.answer;
        const wrong = picked === i && !correct;
        const dimmed = picked !== null && !isAnswer && !wrong;
        return (
          <Pressable
            key={o}
            onPress={() => pick(i)}
            style={[
              styles.option,
              isAnswer && { borderColor: colors.borderSuccess, backgroundColor: colors.bgSuccessSubtle, borderWidth: 2 },
              wrong && { borderColor: colors.bgDanger, backgroundColor: colors.bgDangerSubtle, borderWidth: 2 },
              dimmed && { opacity: 0.5 },
            ]}
          >
            <View style={[styles.letter, isAnswer && { backgroundColor: colors.bgSuccess }, wrong && { backgroundColor: colors.bgDanger }]}>
              <Text style={[styles.letterText, (isAnswer || wrong) && { color: colors.textOnBrand }]}>{LETTERS[i]}</Text>
            </View>
            <Text style={[type.bodyM, { flex: 1, fontFamily: fonts.bodyMedium, color: colors.textPrimary }]}>{o}</Text>
          </Pressable>
        );
      })}

      {picked !== null ? (
        <View style={[styles.feedback, { borderColor: correct ? colors.borderSuccess : colors.bgDanger }]}>
          <Text style={[type.headingS, { color: correct ? colors.textSuccess : colors.textDanger }]}>{correct ? 'Верно! +10 XP' : 'Не совсем'}</Text>
          <Text style={[type.bodyM, { color: colors.textPrimary }]}>{q.explanation}</Text>
        </View>
      ) : null}
    </Screen>
  );
}

function Result({ answers, onNext }: { answers: boolean[]; onNext: () => void }) {
  const score = answers.filter(Boolean).length;
  const level = assessmentLevel(score, answers.length);
  const skills = [...new Set(checkQuestions.map((q) => q.skill))] as Skill[];
  const strong = skills.filter((s) => checkQuestions.every((q, i) => q.skill !== s || answers[i]));
  const growth = skills.filter((s) => !strong.includes(s));

  return (
    <Screen footer={<Button label="Дальше" onPress={onNext} />}>
      <Steps total={7} active={4} />
      <Gap h={spacing.xl} />
      <View style={styles.result}>
        <Text style={styles.resultTitle}>
          Твой результат: {score} из {answers.length}
        </Text>
        <View style={styles.resultBars}>
          {answers.map((ok, i) => (
            <View key={i} style={[styles.resultBar, { backgroundColor: ok ? colors.bgAccent : 'rgba(255,255,255,0.25)' }]} />
          ))}
        </View>
        <Text style={[type.overline, { color: 'rgba(255,255,255,0.7)' }]}>СТАРТОВЫЙ УРОВЕНЬ</Text>
        <Text style={[type.headingL, { color: colors.textOnBrand }]}>{levelNames[level]}</Text>
        <Text style={[type.bodyM, { color: 'rgba(255,255,255,0.85)' }]}>{levelTexts[level]}</Text>
      </View>
      <Gap h={spacing.md} />
      <SkillGroup title="Твои сильные стороны" items={strong} tone="success" />
      <SkillGroup title="Что прокачаем" items={growth} tone="info" />
    </Screen>
  );
}

function SkillGroup({ title, items, tone }: { title: string; items: Skill[]; tone: 'success' | 'info' }) {
  if (!items.length) return null;
  return (
    <View style={styles.group}>
      <Text style={[type.bodyS, { fontFamily: fonts.bodyBold, color: tone === 'success' ? colors.textSuccess : colors.textInfo }]}>{title}</Text>
      <View style={styles.chips}>
        {items.map((s) => (
          <Chip key={s} label={skillNames[s]} tone={tone} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs },
  question: { backgroundColor: colors.bgSurface, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs, borderWidth: 1.5, borderColor: colors.borderDefault },
  questionText: { fontFamily: fonts.headingMedium, fontSize: 16, lineHeight: 23, color: colors.textPrimary },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    padding: spacing.sm,
    marginBottom: 10,
  },
  letter: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.bgCanvas, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontFamily: fonts.headingBold, fontSize: 13, color: colors.textSecondary },
  feedback: { backgroundColor: colors.bgSurface, borderRadius: radius.md, borderWidth: 1.5, padding: spacing.md, gap: 6, marginTop: 4 },
  result: { backgroundColor: colors.bgBrand, borderRadius: radius.xl, padding: spacing.xl, gap: spacing.xs },
  resultTitle: { fontFamily: fonts.headingBold, fontSize: 22, lineHeight: 28, color: colors.textOnBrand },
  resultBars: { flexDirection: 'row', gap: 6, marginVertical: spacing.sm },
  resultBar: { flex: 1, height: 8, borderRadius: 4 },
  group: { backgroundColor: colors.bgSurface, borderRadius: radius.lg, padding: spacing.md, gap: spacing.xs, borderWidth: 1.5, borderColor: colors.borderDefault, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
