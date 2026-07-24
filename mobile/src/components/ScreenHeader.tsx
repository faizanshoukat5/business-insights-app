import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
}

export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    ...typography.screenTitle,
  },
  subtitle: {
    ...typography.bodySecondary,
  },
});
