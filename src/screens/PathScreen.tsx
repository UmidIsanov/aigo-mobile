import { StyleSheet, Text, View } from 'react-native';
import { Body, Chip, Gap, Screen, Title } from '../components/ui';
import { modules } from '../data/content';
import { colors, fonts, radius, spacing, type } from '../theme';

// MVP ships content for the first three modules only (PRD §37).
const AVAILABLE = 3;

export default function PathScreen() {
  return (
    <Screen>
      <Title>Мой путь</Title>
      <Gap h={spacing.xs} />
      <Body>12 модулей: от понимания AI до своего AI-продукта.</Body>
      <Gap h={spacing.lg} />
      {modules.map((m, i) => {
        const current = i === 0;
        const open = i < AVAILABLE;
        return (
          <View key={m} style={[styles.row, current && styles.current, !open && { opacity: 0.55 }]}>
            <View style={[styles.num, { backgroundColor: current ? colors.bgBrand : open ? colors.bgBrandSubtle : colors.bgTrack }]}>
              <Text style={[styles.numText, { color: current ? colors.textOnBrand : colors.textPrimary }]}>{i + 1}</Text>
            </View>
            <Text style={[type.bodyL, { flex: 1, fontFamily: fonts.bodySemi, color: colors.textPrimary }]}>{m}</Text>
            {current ? <Chip label="Сейчас" /> : !open ? <Text style={type.bodyS}>🔒</Text> : null}
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
    padding: 14,
    marginBottom: spacing.xs,
  },
  current: { borderColor: colors.borderBrand, borderWidth: 2 },
  num: { width: 36, height: 36, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.headingBold, fontSize: 14 },
});
