import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from './auth/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(business)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}