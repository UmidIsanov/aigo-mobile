import { StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Gap, Screen, Steps } from '../components/ui';
import { StackProps } from '../navigation/types';
import { colors, fonts, radius, spacing, type } from '../theme';

const points = [
  { title: 'AI ошибается', desc: 'Поэтому важно уметь проверять его ответы.', color: colors.bgDanger },
  { title: 'AI не знает твою цель', desc: 'Ставить задачу и решать, что хорошо, будешь ты.', color: colors.bgInfo },
  { title: 'Инструменты меняются каждый год', desc: 'Главный навык — быстро осваивать новое.', color: colors.bgWarning },
];

export default function InsightScreen({ navigation }: StackProps<'Insight'>) {
  return (
    <Screen dark footer={<Button label="Я готов(а) учиться" variant="accent" onPress={() => navigation.navigate('Interests')} />}>
      <Steps total={7} active={5} dark />
      <Gap h={spacing.xl} />
      <Chip label="Главное" tone="accent" style={{ backgroundColor: colors.bgAccent }} />
      <Gap h={spacing.md} />
      <Text style={styles.title}>AI меняет задачи. Ценность человека — в том, что он с ним делает</Text>
      <Gap h={spacing.xl} />

      <View style={styles.formula}>
        <Pill label="Твои навыки" bg={colors.bgSurface} fg={colors.textPrimary} />
        <Text style={styles.op}>+</Text>
        <Pill label="AI" bg={colors.bgBrand} fg={colors.textOnBrand} />
        <Text style={styles.op}>=</Text>
        <Pill label={'Новые\nвозможности'} bg={colors.bgAccent} fg={colors.textPrimary} />
      </View>
      <Gap h={spacing.xl} />

      {points.map((p) => (
        <View key={p.title} style={styles.point}>
          <View style={[styles.dot, { backgroundColor: p.color }]} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[type.bodyL, { fontFamily: fonts.bodySemi, color: colors.textOnInverse }]}>{p.title}</Text>
            <Text style={[type.bodyM, { color: colors.textOnInverseSecondary }]}>{p.desc}</Text>
          </View>
        </View>
      ))}
    </Screen>
  );
}

function Pill({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: fonts.headingBold, fontSize: 21, lineHeight: 27, color: colors.textOnInverse },
  formula: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pill: { flex: 1, minHeight: 52, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', padding: 6 },
  pillText: { fontFamily: fonts.bodyBold, fontSize: 12, textAlign: 'center' },
  op: { fontFamily: fonts.headingBold, fontSize: 18, color: colors.textOnInverse },
  point: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.bgInverseSubtle,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: 10,
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginTop: 5 },
});
