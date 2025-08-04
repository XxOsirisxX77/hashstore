import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ManageMediaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Media</Text>
      <Text style={styles.subtitle}>This screen will be implemented based on the original ManageMedia.js</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: '#666',
  },
});