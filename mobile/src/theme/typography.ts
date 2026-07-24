import type { TextStyle } from "react-native";
import { colors } from "./colors";

export const typography = {
  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textPrimary,
    lineHeight: 21,
  },
  bodySecondary: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textInverse,
  },
} satisfies Record<string, TextStyle>;
