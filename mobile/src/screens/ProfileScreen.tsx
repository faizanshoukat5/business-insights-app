import React from "react";
import {
  Alert,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ErrorState from "../components/ErrorState";
import Loading from "../components/Loading";
import RatingStars from "../components/RatingStars";
import ScreenHeader from "../components/ScreenHeader";
import { useAuth } from "../context/AuthContext";
import { useBusiness } from "../hooks/useBusiness";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { formatNumber } from "../utils/format";

/** "ABC Salon" -> "AS" */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0].charAt(0);
  const second = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + second).toUpperCase();
}

export default function ProfileScreen() {
  const businessQuery = useBusiness();
  const { logout } = useAuth();

  const confirmLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => {
          void logout();
        },
      },
    ]);
  };

  if (businessQuery.isPending) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScreenHeader title="Profile" />
        <Loading message="Loading business profile…" />
      </SafeAreaView>
    );
  }

  // Full-screen error only on the INITIAL-load failure (no cached data). A
  // failed pull-to-refresh keeps the existing profile on screen.
  if (businessQuery.isError && !businessQuery.data) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScreenHeader title="Profile" />
        <ErrorState
          message={businessQuery.error.message}
          onRetry={() => businessQuery.refetch()}
        />
      </SafeAreaView>
    );
  }

  const business = businessQuery.data;

  const callBusiness = () => {
    Linking.openURL(`tel:${business.phone}`).catch(() => {
      Alert.alert("Unable to place call", `Phone: ${business.phone}`);
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={businessQuery.isRefetching}
            onRefresh={() => businessQuery.refetch()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <ScreenHeader title="Profile" />

        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initialsOf(business.name)}</Text>
          </View>
          <Text style={styles.businessName}>{business.name}</Text>
          <View style={styles.categoryChip}>
            <Text style={styles.categoryText}>{business.category}</Text>
          </View>
          <View style={styles.ratingRow}>
            <RatingStars rating={business.rating} size={18} />
            <Text style={styles.ratingText}>
              {business.rating.toFixed(1)} ({formatNumber(business.total_reviews)}{" "}
              reviews)
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="location" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{business.address}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.infoRow}
            onPress={callBusiness}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Call ${business.phone}`}
          >
            <View style={styles.infoIcon}>
              <Ionicons name="call" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoText}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={[styles.infoValue, styles.link]}>
                {business.phone}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={confirmLogout}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Log out"
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: spacing.xl,
  },
  heroCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primary,
  },
  businessName: {
    ...typography.screenTitle,
    fontSize: 22,
  },
  categoryChip: {
    backgroundColor: colors.primaryTint,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  categoryText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  ratingText: {
    ...typography.bodySecondary,
  },
  infoCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    ...typography.caption,
  },
  infoValue: {
    ...typography.body,
    fontWeight: "500",
  },
  link: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutButton: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.dangerTint,
    borderRadius: 12,
    height: 50,
  },
  logoutText: {
    ...typography.button,
    color: colors.danger,
  },
});
