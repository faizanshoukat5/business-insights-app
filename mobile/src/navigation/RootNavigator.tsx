import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import MainTabs from "./MainTabs";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RestoreSplash() {
  return (
    <View style={styles.splash}>
      <View style={styles.splashIcon}>
        <Ionicons name="stats-chart" size={34} color={colors.primary} />
      </View>
      <Text style={styles.splashTitle}>Business Insights</Text>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

export default function RootNavigator() {
  const { token, isRestoring } = useAuth();

  if (isRestoring) {
    return <RestoreSplash />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  splashIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  splashTitle: {
    ...typography.screenTitle,
    fontSize: 20,
  },
});
