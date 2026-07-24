import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import InsightsChart from "../components/InsightsChart";
import ErrorState from "../components/ErrorState";
import Loading from "../components/Loading";
import ScreenHeader from "../components/ScreenHeader";
import StatCard from "../components/StatCard";
import { useBusiness } from "../hooks/useBusiness";
import { useInsights } from "../hooks/useInsights";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function DashboardScreen() {
  const insightsQuery = useInsights();
  const businessQuery = useBusiness();

  const header = (
    <ScreenHeader title="Dashboard" subtitle={businessQuery.data?.name} />
  );

  if (insightsQuery.isPending) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        {header}
        <Loading message="Loading insights…" />
      </SafeAreaView>
    );
  }

  if (insightsQuery.isError) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        {header}
        <ErrorState
          message={insightsQuery.error.message}
          onRetry={() => {
            insightsQuery.refetch();
            businessQuery.refetch();
          }}
        />
      </SafeAreaView>
    );
  }

  const insights = insightsQuery.data;

  const stats: {
    label: string;
    value: number;
    icon: IoniconName;
    accent: string;
    accentTint: string;
  }[] = [
    {
      label: "Profile Views",
      value: insights.profile_views,
      icon: "eye",
      accent: colors.primary,
      accentTint: colors.primaryTint,
    },
    {
      label: "Search Views",
      value: insights.search_views,
      icon: "search",
      accent: colors.violet,
      accentTint: colors.violetTint,
    },
    {
      label: "Website Clicks",
      value: insights.website_clicks,
      icon: "globe",
      accent: colors.teal,
      accentTint: colors.tealTint,
    },
    {
      label: "Phone Calls",
      value: insights.phone_calls,
      icon: "call",
      accent: colors.success,
      accentTint: colors.successTint,
    },
    {
      label: "Direction Requests",
      value: insights.direction_requests,
      icon: "navigate",
      accent: colors.orange,
      accentTint: colors.orangeTint,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={insightsQuery.isRefetching || businessQuery.isRefetching}
            onRefresh={() => {
              insightsQuery.refetch();
              businessQuery.refetch();
            }}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {header}

        <View style={styles.grid}>
          {stats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              accent={stat.accent}
              accentTint={stat.accentTint}
            />
          ))}
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Overview</Text>
          <Text style={styles.chartSubtitle}>
            All insight metrics at a glance
          </Text>
          <InsightsChart insights={insights} />
        </View>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  chartCard: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  chartTitle: {
    ...typography.sectionTitle,
  },
  chartSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
});
