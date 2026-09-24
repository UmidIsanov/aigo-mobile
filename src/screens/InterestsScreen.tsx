import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Button, Chip, Gap, Screen, Steps, Title } from '../components/ui';
import { interests } from '../data/content';
import { StackProps } from '../navigation/types';
import { useApp } from '../state/AppState';
import { colors, fonts, radius, spacing, type } from '../theme';

const MIN = 3;

export default function InterestsScreen({ navigation }: StackProps<'Interests'>) {
  const { interests: selected, toggleInterest } = useApp();
  const ready = selected.length >= MIN;
  const example = selected[0] ?? 'космос';

  return (
    <Screen
      footer={
        <Button
          label={ready ? 'Собрать мой путь' : `Выбери ещё ${MIN - selected.length}`}
          disabled={!ready}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main', params: { screen: 'Home' } }] })}
        />
      }
    >
      <Steps total={5} active={4} />
      <Gap h={spacing.xl} />
      <Chip label="Последний шаг" />
      <Gap h={spacing.sm} />
      <Title>Что тебе интересно?</Title>
      <Gap h={spacing.xs} />
      <Body>Выбери 3 или больше — соберём задания и проекты вокруг твоих интересов.</Body>
      <Gap h={spacing.xl} />

      <View style={styles.grid}>
        {interests.map((i) => {
          const on = selected.includes(i);
          return (
            <Pressable
              key={i}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              onPress={() => toggleInterest(i)}
              style={[styles.item, on && styles.itemOn]}
            >
              <Text style={[type.bodyL, { fontFamily: on ? fonts.bodySemi : fonts.bodyMedium, color: on ? colors.textOnBrand : colors.textPrimary }]}>
                {on ? '✓  ' : ''}
                {i}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {ready ? (
        <View style={styles.preview}>
          <View style={styles.previewIcon}>
            <Text style={{ fontFamily: fonts.headingBold, color: colors.textPrimary }}>{selected.length}</Text>
          </View>
          <Text style={[type.bodyM, { flex: 1, color: colors.textPrimary }]}>
            Пример задания для тебя: «Придумай с AI идею проекта про {example.toLowerCase()} и проверь, не ошибся ли он в фактах»
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    backgroundColor: colors.bgSurface,
  },
  itemOn: { backgroundColor: colors.bgBrand, borderColor: colors.bgBrand },
  preview: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bgAccentSubtle,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.bgAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
