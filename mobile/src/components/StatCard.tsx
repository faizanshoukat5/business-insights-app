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
}

export default function StatCard({
  label,
  value,
  icon,
  accent = colors.primary,
  accentTint = colors.primaryTint,
}: StatCardProps) {
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
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  value: {
    ...typography.statValue,
  },
  label: {
    ...typography.bodySecondary,
    fontSize: 13,
  },
});
