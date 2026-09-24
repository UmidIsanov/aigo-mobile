// Design tokens — mirror the Figma variables (color/*, spacing/*, radius/*).
// Brand is Facebook blue (#1877F2).

export const colors = {
  bgCanvas: '#F0F2F5',
  bgSurface: '#FFFFFF',
  bgInverse: '#0F1B33',
  bgInverseSubtle: '#1E2C4A',
  bgBrand: '#1877F2',
  bgBrandSubtle: '#E7F0FE',
  bgAccent: '#C6F432',
  bgAccentSubtle: '#F1FCCB',
  bgDanger: '#FF6B5B',
  bgDangerSubtle: '#FFE4E0',
  bgInfo: '#3EC5FF',
  bgInfoSubtle: '#DDF5FF',
  bgWarning: '#FFD23F',
  bgWarningSubtle: '#FFF4CC',
  bgSuccess: '#16A34A',
  bgSuccessSubtle: '#DCFCE7',
  bgTrack: '#E4E6EB',

  textPrimary: '#0F1B33',
  textSecondary: '#65676B',
  textOnBrand: '#FFFFFF',
  textOnInverse: '#FFFFFF',
  textOnInverseSecondary: '#A8B3CF',
  textBrand: '#1877F2',
  textAccent: '#4D7C0F',
  textDanger: '#D9412F',
  textInfo: '#0A7FB0',
  textWarning: '#A16207',
  textSuccess: '#16A34A',

  borderDefault: '#E4E6EB',
  borderBrand: '#1877F2',
  borderSuccess: '#16A34A',
} as const;

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32 } as const;

export const radius = { sm: 12, md: 18, lg: 24, xl: 28, full: 999 } as const;

export const fonts = {
  headingBold: 'Unbounded_700Bold',
  headingSemi: 'Unbounded_600SemiBold',
  headingMedium: 'Unbounded_500Medium',
  body: 'Onest_400Regular',
  bodyMedium: 'Onest_500Medium',
  bodySemi: 'Onest_600SemiBold',
  bodyBold: 'Onest_700Bold',
} as const;

export const type = {
  display: { fontFamily: fonts.headingBold, fontSize: 26, lineHeight: 32 },
  headingL: { fontFamily: fonts.headingBold, fontSize: 22, lineHeight: 28 },
  headingM: { fontFamily: fonts.headingSemi, fontSize: 17, lineHeight: 22 },
  headingS: { fontFamily: fonts.headingSemi, fontSize: 15, lineHeight: 20 },
  bodyL: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23 },
  bodyM: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20 },
  bodyS: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18 },
  button: { fontFamily: fonts.bodySemi, fontSize: 17 },
  chip: { fontFamily: fonts.bodySemi, fontSize: 13 },
  overline: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 0.8 },
  caption: { fontFamily: fonts.body, fontSize: 11, lineHeight: 14 },
} as const;

export const shadowCard = {
  shadowColor: '#0F1B33',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 3,
} as const;
