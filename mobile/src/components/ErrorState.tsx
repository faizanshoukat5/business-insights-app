import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle" size={32} color={colors.danger} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.button}
          onPress={onRetry}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Retry"
        >
          <Ionicons name="refresh" size={18} color={colors.textInverse} />
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.dangerTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.sectionTitle,
  },
  message: {
    ...typography.bodySecondary,
    textAlign: "center",
    maxWidth: 300,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginTop: spacing.lg,
  },
  buttonText: {
    ...typography.button,
  },
});
