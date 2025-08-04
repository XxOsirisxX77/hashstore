import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from './auth/AuthContext';
import { View, Text } from 'react-native';

export default function Index() {
  const { signedInType, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (signedInType === 0) {
        router.replace('/(auth)/login');
      } else if (signedInType === 1) {
        router.replace('/(tabs)/home');
      } else if (signedInType === 2) {
        router.replace('/(business)/home');
      }
    }
  }, [signedInType, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return null;
}