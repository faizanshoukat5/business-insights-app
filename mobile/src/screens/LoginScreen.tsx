import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";

const DEMO_EMAIL = "admin@abcsalon.com";
const DEMO_PASSWORD = "Password123";
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const { login } = useAuth();
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "Enter a valid email address";
    }
    if (!password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async () => {
    setServerError(null);
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      // Success: AuthContext gains a token and RootNavigator switches screens.
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setFieldErrors({});
    setServerError(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.brand}>
            <View style={styles.brandIcon}>
              <Ionicons name="stats-chart" size={30} color={colors.primary} />
            </View>
            <Text style={styles.title}>Business Insights</Text>
            <Text style={styles.subtitle}>
              Sign in to view your business performance
            </Text>
          </View>

          {serverError && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={styles.errorBannerText}>{serverError}</Text>
            </View>
          )}

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View
                style={[
                  styles.inputWrap,
                  fieldErrors.email ? styles.inputWrapError : null,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={colors.textSecondary}
                />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                  accessibilityLabel="Email"
                  returnKeyType="next"
                  textContentType="emailAddress"
                  autoComplete="email"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
              </View>
              {fieldErrors.email && (
                <Text style={styles.fieldError}>{fieldErrors.email}</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputWrap,
                  fieldErrors.password ? styles.inputWrapError : null,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.textSecondary}
                />
                <TextInput
                  ref={passwordRef}
                  style={styles.input}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                  }}
                  placeholder="Your password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                  accessibilityLabel="Password"
                  returnKeyType="go"
                  textContentType="password"
                  autoComplete="password"
                  onSubmitEditing={handleSubmit}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((visible) => !visible)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {fieldErrors.password && (
                <Text style={styles.fieldError}>{fieldErrors.password}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, isSubmitting ? styles.buttonDisabled : null]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
            >
              {isSubmitting ? (
                <>
                  <ActivityIndicator size="small" color={colors.textInverse} />
                  <Text style={styles.buttonText}>Signing in…</Text>
                </>
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
            {isSubmitting && (
              <Text style={styles.slowHint}>
                First sign-in can take up to a minute while the free-tier server
                wakes up.
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.demoCard}
            onPress={fillDemoCredentials}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Fill demo credentials"
          >
            <View style={styles.demoHeader}>
              <Ionicons
                name="information-circle"
                size={18}
                color={colors.primary}
              />
              <Text style={styles.demoTitle}>Demo credentials</Text>
            </View>
            <Text style={styles.demoLine}>Email: {DEMO_EMAIL}</Text>
            <Text style={styles.demoLine}>Password: {DEMO_PASSWORD}</Text>
            <Text style={styles.demoHint}>Tap to fill the form</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.xl,
    gap: spacing.xl,
  },
  brand: {
    alignItems: "center",
    gap: spacing.sm,
  },
  brandIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.screenTitle,
  },
  subtitle: {
    ...typography.bodySecondary,
    textAlign: "center",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerTint,
    borderRadius: 12,
    padding: spacing.md,
  },
  errorBannerText: {
    ...typography.bodySecondary,
    color: colors.danger,
    flex: 1,
  },
  form: {
    gap: spacing.lg,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySecondary,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 50,
  },
  inputWrapError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    ...typography.body,
    paddingVertical: 0,
  },
  fieldError: {
    ...typography.caption,
    color: colors.danger,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
  },
  buttonDisabled: {
    opacity: 0.8,
  },
  buttonText: {
    ...typography.button,
  },
  slowHint: {
    ...typography.caption,
    textAlign: "center",
  },
  demoCard: {
    backgroundColor: colors.primaryTint,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  demoTitle: {
    ...typography.sectionTitle,
    fontSize: 14,
    color: colors.primaryDark,
  },
  demoLine: {
    ...typography.bodySecondary,
    fontSize: 13,
    color: colors.primaryDark,
  },
  demoHint: {
    ...typography.caption,
    color: colors.primary,
    marginTop: spacing.xs,
  },
});
