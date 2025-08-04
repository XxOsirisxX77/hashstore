import React from 'react';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function BusinessTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'rgba(189, 37, 60, 0.90)',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name="home" 
              size={25} 
              color={focused ? 'rgba(189, 37, 60, 0.90)' : color}
              style={{ marginTop: 5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name="search" 
              size={25} 
              color={focused ? 'rgba(189, 37, 60, 0.90)' : color}
              style={{ marginTop: 5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="manage-media"
        options={{
          title: 'Manage Media',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name="plus" 
              size={25} 
              color={focused ? 'rgba(189, 37, 60, 0.90)' : color}
              style={{ marginTop: 5 }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Icon 
              name="user-circle" 
              size={25} 
              color={focused ? 'rgba(189, 37, 60, 0.90)' : color}
              style={{ marginTop: 5 }}
            />
          ),
        }}
      />
    </Tabs>
  );
}