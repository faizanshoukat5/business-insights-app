import React from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Insights } from "../api/endpoints";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { formatNumber } from "../utils/format";

interface InsightsChartProps {
  insights: Insights;
}

const BAR_WIDTH = 30;
const Y_AXIS_LABEL_WIDTH = 40;
const INITIAL_SPACING = 12;

/** Round up to a clean axis maximum (e.g. 1200 -> 1500). */
function niceMax(value: number): number {
  if (value <= 0) return 100;
  const padded = value * 1.2;
  const magnitude = Math.pow(10, Math.floor(Math.log10(padded)));
  const step = magnitude / 2;
  return Math.ceil(padded / step) * step;
}

/**
 * Single-series bar chart of the five insight metrics.
 * One blue hue on purpose — the bars encode magnitude of one measure, so
 * multiple colors would carry no information.
 */
export default function InsightsChart({ insights }: InsightsChartProps) {
  const { width } = useWindowDimensions();

  const values = [
    { label: "Views", value: insights.profile_views },
    { label: "Search", value: insights.search_views },
    { label: "Clicks", value: insights.website_clicks },
    { label: "Calls", value: insights.phone_calls },
    { label: "Routes", value: insights.direction_requests },
  ];

  const data = values.map((item) => ({
    value: item.value,
    label: item.label,
    frontColor: colors.primary,
    topLabelComponent: () => (
      <Text style={styles.topLabel}>{formatNumber(item.value)}</Text>
    ),
  }));

  // Fit five bars inside: screen - screen padding (2x16) - card padding (2x16).
  const chartWidth = width - spacing.lg * 4;
  const plotWidth = chartWidth - Y_AXIS_LABEL_WIDTH - INITIAL_SPACING;
  const barSpacing = Math.max(
    8,
    Math.floor((plotWidth - values.length * BAR_WIDTH) / values.length)
  );

  const maxValue = niceMax(Math.max(...values.map((item) => item.value)));

  // The chart itself is opaque to screen readers, so expose a spoken summary of
  // every metric on the wrapping view.
  const accessibilityLabel =
    "Insights overview chart: " +
    `Profile Views ${insights.profile_views}, ` +
    `Search Views ${insights.search_views}, ` +
    `Website Clicks ${insights.website_clicks}, ` +
    `Phone Calls ${insights.phone_calls}, ` +
    `Direction Requests ${insights.direction_requests}`;

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <BarChart
        data={data}
        width={plotWidth}
        height={180}
        maxValue={maxValue}
        noOfSections={3}
        barWidth={BAR_WIDTH}
        spacing={barSpacing}
        initialSpacing={INITIAL_SPACING}
        endSpacing={0}
        barBorderTopLeftRadius={4}
        barBorderTopRightRadius={4}
        disableScroll
        isAnimated
        yAxisThickness={0}
        xAxisThickness={1}
        xAxisColor={colors.border}
        rulesType="solid"
        rulesColor={colors.gridLine}
        yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
        yAxisTextStyle={styles.axisLabel}
        xAxisLabelTextStyle={styles.axisLabel}
        formatYLabel={(label: string) => formatNumber(Number(label))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
  },
  axisLabel: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  topLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
    width: 44,
    textAlign: "center",
    marginBottom: 2,
  },
});
