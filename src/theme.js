export const colors = {
  primary: '#F02E74',
  primaryDark: '#C81E5B',
  primaryLight: '#FDE7F0',
  pinkSoft: '#FFF5F9',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F8F8FA',
  border: '#F1F1F4',
  text: '#17171C',
  textMuted: '#6E6E78',
  textLight: '#A1A1AA',
  success: '#12A150',
  successLight: '#E8F8EF',
  warning: '#F5A524',
  star: '#F5A524',
  danger: '#E5484D',
  dangerLight: '#FDECEC',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(17, 17, 24, 0.45)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 26,
  pill: 999,
};

export const shadows = {
  card: { boxShadow: '0px 4px 14px rgba(17, 17, 24, 0.06)' },
  subtle: { boxShadow: '0px 2px 8px rgba(17, 17, 24, 0.05)' },
  floating: { boxShadow: '0px 10px 26px rgba(240, 46, 116, 0.24)' },
  modal: { boxShadow: '0px 18px 40px rgba(17, 17, 24, 0.18)' },
};

export const type = {
  h1: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  body: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  muted: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
  small: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
};
