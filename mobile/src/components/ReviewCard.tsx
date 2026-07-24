import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Review } from "../api/endpoints";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { formatDate } from "../utils/format";
import RatingStars from "./RatingStars";

const AVATAR_PALETTE = [
  { background: colors.primaryTint, foreground: colors.primary },
  { background: colors.successTint, foreground: colors.success },
  { background: colors.warningTint, foreground: colors.warning },
  { background: colors.pinkTint, foreground: colors.pink },
  { background: colors.violetTint, foreground: colors.violet },
  { background: colors.orangeTint, foreground: colors.orange },
  { background: colors.tealTint, foreground: colors.teal },
] as const;

/** Stable color pick per reviewer name, so avatars stay consistent. */
function avatarColorsFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const avatar = avatarColorsFor(review.name);
  const initial = review.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View
          style={[styles.avatar, { backgroundColor: avatar.background }]}
        >
          <Text style={[styles.avatarText, { color: avatar.foreground }]}>
            {initial}
          </Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {review.name}
          </Text>
          <View style={styles.metaRow}>
            <RatingStars rating={review.rating} size={13} />
            <Text style={styles.date}>{formatDate(review.date)}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.sectionTitle,
    fontSize: 15,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  date: {
    ...typography.caption,
  },
  comment: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
