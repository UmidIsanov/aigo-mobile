import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Chip, Gap, Radio, Screen, Steps, Title } from '../components/ui';
import { StackProps } from '../navigation/types';
import { AgeGroup, useApp } from '../state/AppState';
import { colors, fonts, radius, shadowCard, spacing, type } from '../theme';

const options: { id: AgeGroup; role: string; desc: string; tint: string }[] = [
  { id: '10-12', role: 'Исследователь', desc: 'Игры, истории и простые эксперименты с AI', tint: colors.bgWarningSubtle },
  { id: '13-16', role: 'Создатель', desc: 'Реальные задачи, проекты и первые AI-продукты', tint: colors.bgAccentSubtle },
];

export default function AgeScreen({ navigation }: StackProps<'Age'>) {
  const { age, setAge } = useApp();
  return (
    <Screen footer={<Button label="Дальше" disabled={!age} onPress={() => navigation.navigate('Reality')} />}>
      <Steps total={5} active={0} />
      <Gap h={spacing.xl} />
      <Chip label="Шаг 1 из 5" />
      <Gap h={spacing.sm} />
      <Title>Сколько тебе лет?</Title>
      <Gap h={spacing.xs} />
      <Body>Подберём язык, примеры и задания под твой возраст.</Body>
      <Gap h={spacing.xl} />
      {options.map((o) => {
        const selected = age === o.id;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => setAge(o.id)}
            style={[styles.card, selected && styles.cardSelected]}
          >
            <View style={[styles.badge, { backgroundColor: o.tint }]}>
              <Text style={styles.badgeText}>{o.id.replace('-', '–')}</Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[type.headingS, { color: colors.textPrimary }]}>{o.role}</Text>
              <Text style={[type.bodyM, { color: colors.textSecondary }]}>{o.desc}</Text>
            </View>
            <Radio selected={selected} />
          </Pressable>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSurface,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    marginBottom: spacing.sm,
  },
  cardSelected: { borderColor: colors.borderBrand, borderWidth: 2.5, ...shadowCard },
  badge: { width: 64, height: 64, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.headingBold, fontSize: 16, color: colors.textPrimary },
});
