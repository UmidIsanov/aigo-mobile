import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, Gap, Screen, Steps, Title, Tone } from '../components/ui';
import { Actor, professions } from '../data/content';
import { StackProps } from '../navigation/types';
import { colors, radius, shadowCard, spacing, type } from '../theme';

const actorTone: Record<Actor, Tone> = { AI: 'brand', 'Человек': 'danger', 'Вместе': 'accent' };

export default function ProfessionsScreen({ navigation }: StackProps<'Professions'>) {
  const [index, setIndex] = useState(0);
  const p = professions[index];

  return (
    <Screen footer={<Button label="Проверь себя" onPress={() => navigation.navigate('Quiz')} />}>
      <Steps total={5} active={2} />
      <Gap h={spacing.xl} />
      <Chip label={`Пример ${index + 1} из ${professions.length}`} tone="info" />
      <Gap h={spacing.sm} />
      <Title>Как AI меняет работу: {p.name.toLowerCase()}</Title>
      <Gap h={spacing.md} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{ gap: spacing.xs, alignItems: 'center' }}
      >
        {professions.map((item, i) => {
          const active = i === index;
          return (
            <Pressable
              key={item.id}
              onPress={() => setIndex(i)}
              style={[styles.tab, active && { backgroundColor: colors.bgInverse, borderColor: colors.bgInverse }]}
            >
              <Text style={[type.chip, { color: active ? colors.textOnInverse : colors.textPrimary }]}>{item.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Gap h={spacing.md} />
      <View style={styles.tasks}>
        {p.tasks.map((t, i) => (
          <View key={t.title} style={[styles.taskRow, i < p.tasks.length - 1 && styles.divider]}>
            <Text style={[type.bodyM, styles.taskText]}>{t.title}</Text>
            <Chip label={t.actor} tone={actorTone[t.actor]} />
          </View>
        ))}
      </View>

      <Gap h={spacing.sm} />
      <View style={styles.takeaway}>
        <Text style={[type.bodyM, { color: colors.textPrimary }]}>Вывод: {p.takeaway}</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  tasks: { backgroundColor: colors.bgSurface, borderRadius: radius.lg, paddingHorizontal: 18, paddingVertical: 4, ...shadowCard },
  taskRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 14 },
  taskText: { flex: 1, fontFamily: 'Onest_500Medium', color: colors.textPrimary },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderDefault },
  takeaway: { backgroundColor: colors.bgWarningSubtle, borderRadius: radius.md, padding: 14 },
});
