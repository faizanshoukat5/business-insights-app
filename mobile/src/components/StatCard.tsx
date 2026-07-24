import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { formatNumber } from "../utils/format";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface StatCardProps {
  label: string;
  value: number;
  icon: IoniconName;
  /** Icon color. */
  accent?: string;
  /** Icon circle background. */
  accentTint?: string;
  /** Full-width horizontal layout, for the odd last card in a 2-column grid. */
  wide?: boolean;
}

export default function StatCard({
  label,
  value,
  icon,
  accent = colors.primary,
  accentTint = colors.primaryTint,
  wide = false,
}: StatCardProps) {
  if (wide) {
    return (
      <View style={[styles.card, styles.cardWide]}>
        <View
          style={[
            styles.iconCircle,
            styles.iconCircleWide,
            { backgroundColor: accentTint },
          ]}
        >
          <Ionicons name={icon} size={20} color={accent} />
        </View>
        <View>
          <Text style={styles.value}>{formatNumber(value)}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: accentTint }]}>
        <Ionicons name={icon} size={20} color={accent} />
      </View>
      <Text style={styles.value}>{formatNumber(value)}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: "48%",
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  cardWide: {
    flexBasis: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  iconCircleWide: {
    marginBottom: 0,
  },
  value: {
    ...typography.statValue,
  },
  label: {
    ...typography.bodySecondary,
    fontSize: 13,
  },
});
