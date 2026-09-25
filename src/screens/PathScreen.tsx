import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Body, Chip, Gap, Screen, Title } from '../components/ui';
import { modules } from '../data/content';
import { course, currentTask, taskId } from '../data/course';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { useApp } from '../state/AppState';
import { colors, fonts, radius, spacing, type } from '../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<TabParamList, 'Path'>, NativeStackScreenProps<RootStackParamList>>;

export default function PathScreen({ navigation }: Props) {
  const { completed, cursor, setCursor } = useApp();
  const current = currentTask(completed, cursor);

  const openLesson = (m: number, l: number) => {
    const tasks = course[m].lessons[l].tasks;
    const firstOpen = tasks.findIndex((_, i) => !completed.includes(taskId(m, l, i)));
    setCursor(taskId(m, l, firstOpen === -1 ? 0 : firstOpen));
    navigation.navigate('Lesson');
  };

  return (
    <Screen>
      <Title>Мой путь</Title>
      <Gap h={spacing.xs} />
      <Body>12 модулей: от понимания AI до своего AI-продукта.</Body>
      <Gap h={spacing.lg} />
      {modules.map((m, mi) => {
        const lessons = course[mi]?.lessons;
        const isCurrent = current?.module === mi;
        return (
          <View key={m} style={[styles.module, isCurrent && styles.current, !lessons && { opacity: 0.55 }]}>
            <View style={styles.row}>
              <View style={[styles.num, { backgroundColor: isCurrent ? colors.bgBrand : lessons ? colors.bgBrandSubtle : colors.bgTrack }]}>
                <Text style={[styles.numText, { color: isCurrent ? colors.textOnBrand : colors.textPrimary }]}>{mi + 1}</Text>
              </View>
              <Text style={[type.bodyL, { flex: 1, fontFamily: fonts.bodySemi, color: colors.textPrimary }]}>{m}</Text>
              {isCurrent ? <Chip label="Сейчас" /> : !lessons ? <Text style={type.bodyS}>🔒</Text> : null}
            </View>
            {lessons?.map((l, li) => {
              const done = l.tasks.filter((_, ti) => completed.includes(taskId(mi, li, ti))).length;
              const finished = done === l.tasks.length;
              return (
                <Pressable key={l.title} onPress={() => openLesson(mi, li)} style={styles.lesson}>
                  <View style={[styles.lessonIcon, finished && { backgroundColor: colors.bgSuccess }]}>
                    <Text style={{ color: finished ? colors.textOnBrand : colors.textBrand, fontSize: 12 }}>{finished ? '✓' : '▶'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[type.bodyM, { fontFamily: fonts.bodySemi, color: colors.textPrimary }]}>{l.title}</Text>
                    <Text style={[type.caption, { color: colors.textSecondary }]}>
                      {done} из {l.tasks.length} заданий
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  module: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    padding: 14,
    marginBottom: spacing.xs,
    gap: spacing.xs,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  current: { borderColor: colors.borderBrand, borderWidth: 2 },
  num: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.headingBold, fontSize: 14 },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bgCanvas,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginLeft: 48,
  },
  lessonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
