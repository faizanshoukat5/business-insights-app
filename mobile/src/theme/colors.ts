export const colors = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primaryTint: "#DBEAFE",

  background: "#F8FAFC",
  surface: "#FFFFFF",

  textPrimary: "#0F172A",
  textSecondary: "#64748B",
  textInverse: "#FFFFFF",

  border: "#E2E8F0",
  gridLine: "#EEF2F7",

  danger: "#DC2626",
  dangerTint: "#FEE2E2",
  warning: "#D97706",
  warningTint: "#FEF3C7",
  success: "#16A34A",
  successTint: "#DCFCE7",
  violet: "#7C3AED",
  violetTint: "#EDE9FE",
  teal: "#0D9488",
  tealTint: "#CCFBF1",
  pink: "#DB2777",
  pinkTint: "#FCE7F3",
  orange: "#EA580C",
  orangeTint: "#FFEDD5",

  star: "#F59E0B",
} as const;

export type AppColor = keyof typeof colors;
