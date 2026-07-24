import React from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import Loading from "../components/Loading";
import ReviewCard from "../components/ReviewCard";
import ScreenHeader from "../components/ScreenHeader";
import { useReviews } from "../hooks/useReviews";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";

export default function ReviewsScreen() {
  const reviewsQuery = useReviews();

  if (reviewsQuery.isPending) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScreenHeader title="Reviews" />
        <Loading message="Loading reviews…" />
      </SafeAreaView>
    );
  }

  // Full-screen error only on the INITIAL-load failure (no cached data). A
  // failed pull-to-refresh keeps the existing reviews list on screen.
  if (reviewsQuery.isError && !reviewsQuery.data) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <ScreenHeader title="Reviews" />
        <ErrorState
          message={reviewsQuery.error.message}
          onRetry={() => reviewsQuery.refetch()}
        />
      </SafeAreaView>
    );
  }

  const reviews = reviewsQuery.data;
  const countLabel = `${reviews.length} ${
    reviews.length === 1 ? "review" : "reviews"
  }`;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <FlatList
        data={reviews}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemWrap}>
            <ReviewCard review={item} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <ScreenHeader title="Reviews" subtitle={countLabel} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No reviews yet"
            subtitle="Customer reviews will appear here once they come in."
          />
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={reviewsQuery.isRefetching}
            onRefresh={() => reviewsQuery.refetch()}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  itemWrap: {
    paddingHorizontal: spacing.lg,
  },
  separator: {
    height: spacing.md,
  },
});
