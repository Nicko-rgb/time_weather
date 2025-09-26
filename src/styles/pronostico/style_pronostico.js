import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Constantes de diseño
const COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981',
  accent: '#fbbf24',
  background: '#0f172a',
  surface: 'rgba(255, 255, 255, 0.15)',
  surfaceLight: 'rgba(255, 255, 255, 0.25)',
  surfaceDark: 'rgba(255, 255, 255, 0.1)',
  text: {
    primary: '#fff',
    secondary: '#e2e8f0',
    tertiary: '#cbd5e0',
    muted: '#94a3b8',
  },
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  info: '#60a5fa',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 25,
};

const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 64,
};

const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const styles = StyleSheet.create({
  // === LAYOUT BASE ===
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  backgroundImage: {
    flex: 1,
  },
  
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  
  scrollContainer: {
    paddingBottom: SPACING.lg,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },

  // === BARRA DE BÚSQUEDA ===
  searchContainer: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  
  searchBarWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  searchIcon: {
    marginRight: SPACING.sm,
  },
  
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: '500',
    ...Platform.select({
      ios: { paddingVertical: SPACING.sm },
      android: { paddingVertical: SPACING.xs },
    }),
  },
  
  clearSearchButton: {
    padding: SPACING.xs,
  },
  
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.round,
    padding: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
    minHeight: 48,
    ...SHADOWS.medium,
  },
  
  searchButtonDisabled: {
    backgroundColor: COLORS.text.muted,
    opacity: 0.6,
  },

  // === CLIMA ACTUAL ===
  currentWeatherSection: {
    marginBottom: SPACING.lg,
  },
  
  weatherCard: {
    backgroundColor: COLORS.surfaceLight,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.xxl,
    alignItems: 'center',
    ...SHADOWS.large,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  weatherCardTitle: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.text.primary,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  
  locationName: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.secondary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  
  lastUpdate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  
  weatherIconLarge: {
    marginRight: SPACING.md,
    ...SHADOWS.medium,
  },
  
  currentTemperature: {
    fontSize: FONT_SIZES.display,
    color: COLORS.accent,
    fontWeight: '300',
    lineHeight: FONT_SIZES.display + 8,
  },
  
  weatherCondition: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text.secondary,
    fontWeight: '500',
    marginBottom: SPACING.xl,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  
  weatherDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  weatherDetailItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: SPACING.sm,
  },
  
  detailIcon: {
    marginBottom: SPACING.xs,
  },
  
  detailLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.tertiary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  detailValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },

  // === PRONÓSTICO DIARIO ===
  forecastSection: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.text.primary,
    fontWeight: '700',
    marginBottom: SPACING.md,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  
  forecastList: {
    gap: SPACING.sm,
  },
  
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surfaceDark,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.small,
  },
  
  forecastDay: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text.secondary,
    fontWeight: '600',
    width: 70,
    textTransform: 'capitalize',
  },
  
  forecastIcon: {
    marginHorizontal: SPACING.md,
  },
  
  temperatureRange: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: SPACING.md,
  },
  
  maxTemperature: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text.primary,
    fontWeight: '700',
    lineHeight: FONT_SIZES.lg + 2,
  },
  
  minTemperature: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text.muted,
    fontWeight: '500',
  },
  
  precipitationInfo: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.info,
    fontWeight: '500',
    width: 45,
    textAlign: 'right',
  },

  // === BOTONES DE ACCIÓN ===
  actionButtonsContainer: {
    marginBottom: SPACING.lg,
  },
  
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.round,
    alignSelf: 'center',
    minWidth: 160,
    ...SHADOWS.medium,
  },
  
  primaryButtonText: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.round,
    alignSelf: 'center',
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  secondaryButtonText: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    marginLeft: SPACING.sm,
  },

  // === PIE DE PÁGINA ===
  footer: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  footerText: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZES.xs,
    opacity: 0.8,
    textAlign: 'center',
  },
  
  footerSubtext: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZES.xs,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },

  // === ESTADOS DE CARGA Y ERROR ===
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  
  loadingText: {
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  errorContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    margin: SPACING.md,
  },
  
  errorIcon: {
    marginBottom: SPACING.md,
  },
  
  errorTitle: {
    color: COLORS.error,
    fontSize: FONT_SIZES.lg,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  
  errorMessage: {
    color: COLORS.text.secondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: FONT_SIZES.md + 4,
  },
  
  retryText: {
    color: COLORS.text.muted,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },

  // === UTILIDADES ===
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  fullWidth: {
    width: '100%',
  },
  
  shadow: SHADOWS.medium,
  
  // === RESPONSIVE ===
  ...Platform.select({
    ios: {
      iosShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    },
    android: {
      androidElevation: {
        elevation: 8,
      },
    },
  }),
});

// Exportar constantes para uso en componentes
export { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS };