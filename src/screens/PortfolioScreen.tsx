import { StyleSheet, Text, View } from 'react-native';
import { Body, Card, Chip, Gap, Screen, Title } from '../components/ui';
import { colors, fonts, spacing, type } from '../theme';

// Each project records problem, solution, AI's role and the human's role (PRD §27).
const project = {
  title: 'Мой AI-помощник для учёбы',
  problem: 'Трудно готовиться к контрольной по истории — много дат и событий.',
  solution: 'Карточки для повторения, которые AI составляет по конспекту.',
  ai: 'Составил вопросы и карточки по моему конспекту.',
  human: 'Проверил факты по учебнику, убрал 3 ошибки AI, выбрал формат.',
  skills: ['Постановка задач', 'Проверка фактов'],
};

export default function PortfolioScreen() {
  return (
    <Screen>
      <Title>Портфолио</Title>
      <Gap h={spacing.xs} />
      <Body>Здесь собираются твои проекты. Главная награда — то, что ты создал.</Body>
      <Gap h={spacing.lg} />
      <Card style={{ gap: spacing.sm }}>
        <Chip label="Мини-проект · Модуль 1" tone="accent" />
        <Text style={[type.headingM, { color: colors.textPrimary }]}>{project.title}</Text>
        <Field label="Проблема" value={project.problem} />
        <Field label="Решение" value={project.solution} />
        <View style={styles.roles}>
          <Role label="Роль AI" value={project.ai} bg={colors.bgBrandSubtle} fg={colors.textBrand} />
          <Role label="Моя роль" value={project.human} bg={colors.bgDangerSubtle} fg={colors.textDanger} />
        </View>
        <View style={styles.skills}>
          {project.skills.map((s) => (
            <Chip key={s} label={s} tone="neutral" />
          ))}
        </View>
      </Card>
    </Screen>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={[type.overline, { color: colors.textSecondary }]}>{label.toUpperCase()}</Text>
      <Text style={[type.bodyM, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

function Role({ label, value, bg, fg }: { label: string; value: string; bg: string; fg: string }) {
  return (
    <View style={[styles.role, { backgroundColor: bg }]}>
      <Text style={[type.bodyS, { fontFamily: fonts.bodyBold, color: fg }]}>{label}</Text>
      <Text style={[type.bodyS, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  roles: { flexDirection: 'row', gap: spacing.xs },
  role: { flex: 1, borderRadius: 14, padding: spacing.sm, gap: 4 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
