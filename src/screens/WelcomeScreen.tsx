import { StyleSheet, Text, View } from 'react-native';
import { Body, Button, Gap, Screen } from '../components/ui';
import { StackProps } from '../navigation/types';
import { colors, fonts, radius, spacing, type } from '../theme';

export default function WelcomeScreen({ navigation }: StackProps<'Welcome'>) {
  return (
    <Screen
      footer={
        <>
          <Button label="Начать" onPress={() => navigation.navigate('Age')} />
          <Button label="У меня уже есть аккаунт" variant="ghost" onPress={() => navigation.replace('Main', { screen: 'Home' })} />
        </>
      }
    >
      <View style={styles.logo}>
        <View style={styles.logoMark}>
          <Text style={styles.logoMarkText}>Ai</Text>
        </View>
        <Text style={styles.logoText}>Go</Text>
      </View>

      <View style={styles.illustration}>
        <View style={[styles.dot, { top: 10, left: 12, backgroundColor: colors.bgDanger }]} />
        <View style={[styles.star, { top: 0, right: 20 }]} />
        <View style={[styles.circle, { left: 0, backgroundColor: colors.bgInverse }]}>
          <Text style={[styles.circleText, { marginRight: 60 }]}>ТЫ</Text>
        </View>
        <View style={[styles.circle, { right: 0, backgroundColor: colors.bgBrand }]}>
          <Text style={[styles.circleText, { marginLeft: 60 }]}>AI</Text>
        </View>
        <View style={styles.plus}>
          <Text style={styles.plusText}>+</Text>
        </View>
        <View style={styles.square} />
      </View>

      <Text style={[type.display, { color: colors.textPrimary }]}>Мир меняется.{'\n'}Давай разберёмся вместе.</Text>
      <Gap h={spacing.sm} />
      <Body>
        AI уже меняет профессии и то, как люди учатся и работают. Здесь ты поймёшь, что происходит — и научишься работать с AI, а не бояться его.
      </Body>
    </Screen>
  );
}

const CIRCLE = 190;

const styles = StyleSheet.create({
  logo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  logoMark: { backgroundColor: colors.bgBrand, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 8 },
  logoMarkText: { fontFamily: fonts.headingBold, fontSize: 13, color: colors.textOnBrand },
  logoText: { fontFamily: fonts.headingBold, fontSize: 18, color: colors.textPrimary },
  illustration: { height: 280, marginVertical: spacing.lg, justifyContent: 'center' },
  circle: {
    position: 'absolute',
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: { fontFamily: fonts.headingBold, fontSize: 28, color: colors.textOnInverse },
  plus: {
    alignSelf: 'center',
    width: 64,
    height: 120,
    borderRadius: radius.full,
    backgroundColor: colors.bgAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: { fontFamily: fonts.headingBold, fontSize: 36, color: colors.textPrimary },
  dot: { position: 'absolute', width: 22, height: 22, borderRadius: 11 },
  star: { position: 'absolute', width: 36, height: 36, borderRadius: 8, backgroundColor: colors.bgWarning, transform: [{ rotate: '45deg' }] },
  square: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.bgInfo,
    transform: [{ rotate: '18deg' }],
  },
});
