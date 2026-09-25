import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, Gap, ProgressBar, Screen } from '../components/ui';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { checkQuestions, levelNames, Skill, skillNames } from '../data/content';
import { assessmentLevel, levelInfo, useApp, XP_PER_LEVEL } from '../state/AppState';
import { colors, fonts, radius, spacing, type } from '../theme';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const { name, xp, lessonProgress, interests, assessment } = useApp();
  const lvl = levelInfo(xp);
  const level = assessment ? assessmentLevel(assessment.filter(Boolean).length, assessment.length) : null;

  // Starting skill values come from the onboarding thinking check; lessons add critical-thinking practice.
  const skillValue = (skill: Skill, bonus = 0) => {
    const idx = checkQuestions.flatMap((q, i) => (q.skill === skill ? [i] : []));
    const right = idx.filter((i) => assessment?.[i]).length;
    return Math.min(100, 20 + Math.round((right / Math.max(1, idx.length)) * 50) + bonus);
  };
  const skills = [
    { name: skillNames.prompting, value: skillValue('prompting'), color: colors.bgBrand },
    { name: skillNames.critical, value: skillValue('critical', (lessonProgress - 3) * 5), color: colors.bgDanger },
    { name: skillNames.logic, value: skillValue('logic'), color: colors.bgInfo },
    { name: skillNames.problem, value: skillValue('problem'), color: colors.bgAccent },
  ];

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.headingM, { color: colors.textPrimary }]}>Привет, {name}!</Text>
          <Text style={[type.bodyS, { color: colors.textSecondary }]}>
            Уровень {lvl.level} · {lvl.title}
            {level ? ` · старт: ${levelNames[level]}` : ''}
          </Text>
        </View>
        <Chip label="5 дней" tone="danger" dot={colors.bgDanger} />
      </View>
      <Gap h={spacing.md} />

      <Card style={{ padding: spacing.md, gap: 10 }}>
        <View style={styles.between}>
          <Text style={[type.bodyM, { fontFamily: fonts.bodySemi, color: colors.textPrimary }]}>
            {lvl.inLevel} / {XP_PER_LEVEL} XP
          </Text>
          <Text style={[type.bodyS, { color: colors.textSecondary }]}>до уровня {lvl.next}</Text>
        </View>
        <ProgressBar value={(lvl.inLevel / XP_PER_LEVEL) * 100} height={10} track={colors.bgBrandSubtle} />
      </Card>
      <Gap h={spacing.sm} />

      <View style={styles.module}>
        <Text style={[type.overline, { color: colors.bgAccent }]}>МОДУЛЬ 1 · AI WORLD</Text>
        <Text style={[type.headingM, { color: colors.textOnBrand }]}>Урок 3. Можно ли верить AI?</Text>
        <View style={styles.progressRow}>
          <View style={{ flex: 1 }}>
            <ProgressBar value={lessonProgress * 10} color={colors.bgAccent} track="rgba(255,255,255,0.25)" />
          </View>
          <Text style={[type.bodyS, { fontFamily: fonts.bodySemi, color: colors.textOnBrand }]}>{lessonProgress}/10</Text>
        </View>
        <Button label="Продолжить" variant="light" size="m" onPress={() => navigation.navigate('Lesson')} />
      </View>
      <Gap h={spacing.sm} />

      <View style={styles.row}>
        <View style={[styles.tile, { backgroundColor: colors.bgAccent }]}>
          <Text style={[type.overline, { color: colors.textPrimary }]}>CHALLENGE</Text>
          <Text style={[type.bodyM, { fontFamily: fonts.bodySemi, color: colors.textPrimary }]}>
            Освой новый AI-инструмент за 15 минут
          </Text>
          <Chip label="+50 XP" tone="inverse" style={{ backgroundColor: colors.bgInverse }} />
        </View>
        <Card style={[styles.tile, { padding: spacing.md }]}>
          <Text style={[type.overline, { color: colors.textSecondary }]}>ПОРТФОЛИО</Text>
          <Text style={{ fontFamily: fonts.headingBold, fontSize: 28, color: colors.textPrimary }}>1</Text>
          <Text style={[type.bodyS, { color: colors.textSecondary }]}>проект: «Мой AI-помощник для учёбы»</Text>
        </Card>
      </View>
      <Gap h={spacing.sm} />

      <Card style={{ padding: spacing.md, gap: spacing.sm }}>
        <View style={styles.between}>
          <Text style={[type.headingS, { color: colors.textPrimary }]}>Мои навыки</Text>
          {interests.length ? <Chip label={interests.slice(0, 2).join(', ')} tone="brand" /> : null}
        </View>
        {skills.map((s) => (
          <View key={s.name} style={{ gap: 6 }}>
            <View style={styles.between}>
              <Text style={[type.bodyS, { fontFamily: fonts.bodyMedium, color: colors.textPrimary }]}>{s.name}</Text>
              <Text style={[type.bodyS, { color: colors.textSecondary }]}>{Math.min(100, s.value)}%</Text>
            </View>
            <ProgressBar value={s.value} color={s.color} track={colors.bgCanvas} height={6} />
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.bgWarning,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.headingBold, fontSize: 18, color: colors.textPrimary },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.xs },
  module: { backgroundColor: colors.bgBrand, borderRadius: radius.lg, padding: spacing.lg, gap: 10 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  row: { flexDirection: 'row', gap: spacing.sm },
  tile: { flex: 1, borderRadius: 22, padding: spacing.md, gap: spacing.xs },
});
