import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

interface LoadingProps {
  message?: string;
}

const SLOW_HINT_DELAY_MS = 8000;

/**
 * Centered spinner. After 8 seconds it adds a hint about the free-tier
 * backend cold start so a long first load doesn't look broken.
 */
export default function Loading({ message = "Loading…" }: LoadingProps) {
  const [showSlowHint, setShowSlowHint] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSlowHint(true), SLOW_HINT_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.message}>{message}</Text>
      {showSlowHint && (
        <Text style={styles.hint}>
          Waking up the server — free hosting can take up to a minute on first
          load
        </Text>
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
    gap: spacing.md,
  },
  message: {
    ...typography.bodySecondary,
  },
  hint: {
    ...typography.caption,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 18,
  },
});
