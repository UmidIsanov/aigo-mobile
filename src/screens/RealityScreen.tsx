import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, Chip, Gap, Screen, Steps, Title } from '../components/ui';
import { StackProps } from '../navigation/types';
import { colors, fonts, radius, spacing, type } from '../theme';

export default function RealityScreen({ navigation }: StackProps<'Reality'>) {
  return (
    <Screen footer={<Button label="Покажи на примерах" onPress={() => navigation.navigate('Professions')} />}>
      <Steps total={5} active={1} />
      <Gap h={spacing.xl} />
      <Chip label="Что происходит сейчас" tone="danger" dot={colors.bgDanger} />
      <Gap h={spacing.sm} />
      <Title>Работа меняется быстрее, чем школа</Title>
      <Gap h={spacing.lg} />

      <View style={styles.statCard}>
        <View style={styles.row}>
          <Stat value="+170 млн" label="новых рабочих мест появится к 2030" color={colors.bgAccent} />
          <Stat value="−92 млн" label="рабочих мест исчезнет или изменится" color={colors.bgDanger} />
        </View>
        <View style={[styles.row, { alignItems: 'center' }]}>
          <Text style={styles.big}>39%</Text>
          <Text style={[type.bodyM, { color: colors.textOnInverse, flex: 1 }]}>
            ключевых навыков, нужных на работе, изменятся к 2030 году
          </Text>
        </View>
        <Text style={[type.caption, { color: colors.textOnInverseSecondary }]}>
          Источник: World Economic Forum, Future of Jobs Report 2025
        </Text>
      </View>

      <Gap h={spacing.md} />
      <Card style={styles.note}>
        <View style={styles.noteIcon}>
          <Text style={{ fontFamily: fonts.headingBold, color: colors.textBrand }}>!</Text>
        </View>
        <Text style={[type.bodyM, { color: colors.textPrimary, flex: 1 }]}>
          Профессии редко исчезают целиком. Чаще меняются задачи внутри них: рутину берёт AI, а человеку остаётся думать, проверять и создавать.
        </Text>
      </Card>
    </Screen>
  );
}

function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={[type.bodyS, { color: colors.textOnInverse }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: { backgroundColor: colors.bgInverse, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', gap: spacing.sm },
  stat: { flex: 1, backgroundColor: colors.bgInverseSubtle, borderRadius: radius.md, padding: 14, gap: 6 },
  statValue: { fontFamily: fonts.headingBold, fontSize: 19 },
  big: { fontFamily: fonts.headingBold, fontSize: 32, color: colors.bgWarning },
  note: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  noteIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.bgBrandSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
