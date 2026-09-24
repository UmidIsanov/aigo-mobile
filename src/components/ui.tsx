import { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadowCard, spacing, type } from '../theme';

type ScreenProps = {
  children: ReactNode;
  footer?: ReactNode;
  dark?: boolean;
  scroll?: boolean;
};

export function Screen({ children, footer, dark, scroll = true }: ScreenProps) {
  const bg = dark ? colors.bgInverse : colors.bgCanvas;
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: bg }]} edges={['top', 'bottom']}>
      {scroll ? (
        <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.content]}>{children}</View>
      )}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'light';
  size?: 'l' | 'm';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', size = 'l', disabled, style }: ButtonProps) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        size === 'm' && styles.buttonM,
        { backgroundColor: v.bg, borderColor: v.border ?? v.bg },
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.85 },
        style,
      ]}
    >
      <Text style={[type.button, size === 'm' && { fontSize: 15 }, { color: v.fg }]}>{label}</Text>
    </Pressable>
  );
}

const buttonVariants: Record<NonNullable<ButtonProps['variant']>, { bg: string; fg: string; border?: string }> = {
  primary: { bg: colors.bgBrand, fg: colors.textOnBrand },
  secondary: { bg: colors.bgSurface, fg: colors.textPrimary, border: colors.borderDefault },
  ghost: { bg: 'transparent', fg: colors.textBrand },
  accent: { bg: colors.bgAccent, fg: colors.textPrimary },
  light: { bg: colors.bgSurface, fg: colors.textBrand },
};

export type Tone = 'brand' | 'accent' | 'danger' | 'info' | 'warning' | 'success' | 'neutral' | 'inverse';

const chipTones: Record<Tone, { bg: string; fg: string }> = {
  brand: { bg: colors.bgBrandSubtle, fg: colors.textBrand },
  accent: { bg: colors.bgAccentSubtle, fg: colors.textAccent },
  danger: { bg: colors.bgDangerSubtle, fg: colors.textDanger },
  info: { bg: colors.bgInfoSubtle, fg: colors.textInfo },
  warning: { bg: colors.bgWarningSubtle, fg: colors.textWarning },
  success: { bg: colors.bgSuccessSubtle, fg: colors.textSuccess },
  neutral: { bg: colors.bgSurface, fg: colors.textPrimary },
  inverse: { bg: colors.bgInverse, fg: colors.textOnInverse },
};

export function Chip({ label, tone = 'brand', dot, style }: { label: string; tone?: Tone; dot?: string; style?: StyleProp<ViewStyle> }) {
  const t = chipTones[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }, tone === 'neutral' && styles.chipBorder, style]}>
      {dot ? <View style={[styles.dot, { backgroundColor: dot }]} /> : null}
      <Text style={[type.chip, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

export function ProgressBar({ value, color = colors.bgBrand, track = colors.bgTrack, height = 8 }: { value: number; color?: string; track?: string; height?: number }) {
  return (
    <View style={{ height, borderRadius: radius.full, backgroundColor: track, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(100, value))}%`, height, borderRadius: radius.full, backgroundColor: color }} />
    </View>
  );
}

export function Steps({ total, active, dark }: { total: number; active: number; dark?: boolean }) {
  return (
    <View style={styles.steps}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.step,
            { backgroundColor: i <= active ? (dark ? colors.bgAccent : colors.bgBrand) : dark ? colors.bgInverseSubtle : colors.bgTrack },
          ]}
        />
      ))}
    </View>
  );
}

export function Card({ children, style, elevated }: { children: ReactNode; style?: StyleProp<ViewStyle>; elevated?: boolean }) {
  return <View style={[styles.card, elevated && shadowCard, style]}>{children}</View>;
}

export function Title({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.headingL, { color: colors.textPrimary }, style]}>{children}</Text>;
}

export function Body({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[type.bodyL, { color: colors.textSecondary }, style]}>{children}</Text>;
}

export function Gap({ h = spacing.md }: { h?: number }) {
  return <View style={{ height: h }} />;
}

export function Radio({ selected, color = colors.bgBrand }: { selected: boolean; color?: string }) {
  return (
    <View style={[styles.radio, { borderColor: selected ? color : colors.borderDefault, backgroundColor: selected ? color : 'transparent' }]}>
      {selected ? <Text style={styles.radioCheck}>✓</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1 },
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.xs, paddingBottom: spacing.xl, flexGrow: 1 },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xs, paddingTop: spacing.xs, gap: spacing.xs },
  button: {
    minHeight: 56,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  buttonM: { minHeight: 44, paddingHorizontal: spacing.lg, alignSelf: 'flex-start' },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
  },
  chipBorder: { borderWidth: 1.5, borderColor: colors.borderDefault },
  dot: { width: 8, height: 8, borderRadius: 4 },
  steps: { flexDirection: 'row', gap: 6 },
  step: { flex: 1, height: 6, borderRadius: 3 },
  card: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.borderDefault,
  },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioCheck: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
