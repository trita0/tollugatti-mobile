import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuth } from "../src/features/auth/auth-context";

export default function ProfileScreen() {
  const { profile, isUpdatingProfile, lastError, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName((profile?.displayName as string | undefined) ?? "");
    setHandle((profile?.handle as string | undefined) ?? "");
    setCity((profile?.city as string | undefined) ?? "");
    setAvatarUrl((profile?.avatarUrl as string | undefined) ?? "");
  }, [profile]);

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.text}>Sign in to edit your profile.</Text>
        <Pressable style={styles.button} onPress={() => router.replace("/")}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const onSave = async () => {
    setSaveMessage(null);
    try {
      await updateProfile({
        displayName: displayName.trim() || undefined,
        handle: handle.trim() || undefined,
        city: city.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined
      });
      setSaveMessage("Profile updated successfully.");
    } catch {
      // Error text is already exposed via auth context.
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput value={displayName} onChangeText={setDisplayName} style={styles.input} />

        <Text style={styles.label}>Handle</Text>
        <TextInput value={handle} onChangeText={setHandle} style={styles.input} autoCapitalize="none" />

        <Text style={styles.label}>City</Text>
        <TextInput value={city} onChangeText={setCity} style={styles.input} />

        <Text style={styles.label}>Avatar URL</Text>
        <TextInput
          value={avatarUrl}
          onChangeText={setAvatarUrl}
          style={styles.input}
          autoCapitalize="none"
        />

        {lastError ? <Text style={styles.error}>{lastError}</Text> : null}
        {saveMessage ? <Text style={styles.success}>{saveMessage}</Text> : null}

        <Pressable style={styles.button} onPress={onSave} disabled={isUpdatingProfile}>
          <Text style={styles.buttonText}>{isUpdatingProfile ? "Saving..." : "Save"}</Text>
        </Pressable>

        <Pressable style={styles.buttonSecondary} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F3EFE6",
    gap: 12
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3EFE6",
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827"
  },
  text: {
    marginTop: 8,
    marginBottom: 12
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    gap: 8
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase"
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF"
  },
  button: {
    minHeight: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827"
  },
  buttonSecondary: {
    minHeight: 44,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4B5563"
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700"
  },
  error: {
    color: "#B91C1C"
  },
  success: {
    color: "#065F46"
  }
});
