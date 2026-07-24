import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

interface RatingStarsProps {
  /** Rating on a 0–5 scale (e.g. 4.2). Rendered rounded to the nearest half. */
  rating: number;
  size?: number;
}

export default function RatingStars({ rating, size = 16 }: RatingStarsProps) {
  const rounded = Math.round(rating * 2) / 2;
  const stars: React.ReactElement[] = [];

  for (let position = 1; position <= 5; position++) {
    let name: "star" | "star-half" | "star-outline" = "star-outline";
    if (rounded >= position) {
      name = "star";
    } else if (rounded >= position - 0.5) {
      name = "star-half";
    }
    stars.push(
      <Ionicons key={position} name={name} size={size} color={colors.star} />
    );
  }

  return (
    <View
      style={styles.row}
      accessibilityLabel={`Rated ${rating} out of 5 stars`}
    >
      {stars}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});
