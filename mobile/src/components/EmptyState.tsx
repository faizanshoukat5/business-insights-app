import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { IoniconName } from "../theme/icons";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

interface EmptyStateProps {
  icon?: IoniconName;
  title: string;
  subtitle?: string;
}

export default function EmptyState({
  icon = "file-tray-outline",
  title,
  subtitle,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={32} color={colors.textSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xxl,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.sectionTitle,
  },
  subtitle: {
    ...typography.bodySecondary,
    textAlign: "center",
    maxWidth: 280,
  },
});
