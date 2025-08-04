import React from 'react';
import { Text, View, Button, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from './views/Profile';
import ViewProfileScreen from './views/ViewProfile';
import LoginScreen from './views/Login';
import ManageMediaScreen from './views/ManageMedia';
import ReviewMediaScreen from './views/ReviewMedia';
import MediaDetailScreen from './views/MediaDetail';
import ViewMediaDetailScreen from './views/ViewMediaDetail';
import UpdateMediaScreen from './views/UpdateMedia';
import BusinessRegisterScreen from './views/BusinessRegister';
import SearchScreen from './views/Search';
import HomeScreen from './views/Home'

import ProfileSideMenu from './views/ProfileSideMenu';

const IconWithBadge = ({ name, badgeCount, color, size }) => {
  return (
    <View style={{ width: 24, height: 24, margin: 5 }}>
      <Icon name={name} size={size} color={color} />
      {badgeCount > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: 'red',
            borderRadius: 6,
            width: 12,
            height: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {badgeCount}
          </Text>
        </View>
      )}
    </View>
  );
};

const HomeIconWithBadge = (props) => {
  return <IconWithBadge {...props} badgeCount={3} />;
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SignedOutStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

const MenuButton = (props) => {
  return (
    <View>
      <Icon.Button name="bars" backgroundColor="transparent" onPress={() => { props.navigation.toggleDrawer() } }/>
    </View>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ViewMediaDetail" component={ViewMediaDetailScreen} />
      <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="MediaDetail" component={MediaDetailScreen} />
      <Stack.Screen name="UpdateMedia" component={UpdateMediaScreen} />
      <Stack.Screen name="BusinessRegister" component={BusinessRegisterScreen} />
      <Stack.Screen name="ViewMediaDetail" component={ViewMediaDetailScreen} />
      <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
    </Stack.Navigator>
  );
};

const ManageMediaStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManageMedia" component={ManageMediaScreen} />
      <Stack.Screen name="ReviewMedia" component={ReviewMediaScreen} />
    </Stack.Navigator>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ViewMediaDetail" component={ViewMediaDetailScreen} />
      <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
    </Stack.Navigator>
  );
};

const SignedInBusinessTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          const tintColor = focused ? 'rgba(189, 37, 60, 0.90)' : color;
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'ManageMedia') {
            iconName = 'plus';
          } else if (route.name === 'Profile') {
            iconName = 'user-circle';
          }
          
          return <Icon name={iconName} style={{marginTop: 5}} size={25} color={tintColor} />;
        },
        tabBarLabel: ' ',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="ManageMedia" component={ManageMediaStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const SignedInTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          const tintColor = focused ? 'rgba(189, 37, 60, 0.90)' : color;
          
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Profile') {
            iconName = 'user-circle';
          }
          
          return <Icon name={iconName} style={{marginTop: 5}} size={25} color={tintColor} />;
        },
        tabBarLabel: ' ',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const RootNavigator = ({ signedInType }) => {
  let component;
  
  if (signedInType === 0) {
    component = SignedOutStack;
  } else if (signedInType === 1) {
    component = SignedInTabNavigator;
  } else if (signedInType === 2) {
    component = SignedInBusinessTabNavigator;
  } else {
    component = SignedOutStack;
  }
  
  return React.createElement(component);
};

export const AppContainer = (signedInType = 0) => {
  return (
    <NavigationContainer>
      <RootNavigator signedInType={signedInType} />
    </NavigationContainer>
  );
};
