import React from 'react';
import { Text, View, Button, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {createBottomTabNavigator, createStackNavigator, createAppContainer, createSwitchNavigator} from 'react-navigation';

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

class IconWithBadge extends React.Component {
  render() {
    const { name, badgeCount, color, size } = this.props;
    return (
      <View style={{ width: 24, height: 24, margin: 5 }}>
        <Ionicons name={name} size={size} color={color} />
        {badgeCount > 0 && (
          <View
            style={{
              // /If you're using react-native < 0.57 overflow outside of the parent
              // will not work on Android, see https://git.io/fhLJ8
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
  }
}

const HomeIconWithBadge = props => {
  // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
  return <IconWithBadge {...props} badgeCount={3} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === 'Home') {
    iconName = `ios-information-circle${focused ? '' : '-outline'}`;
    // We want to add badges to home tab icon
    IconComponent = HomeIconWithBadge;
  } else if (routeName === 'Settings') {
    iconName = `ios-options${focused ? '' : '-outline'}`;
  }

  // You can return any component that you like here!
  return <IconComponent name={iconName} size={25} color={tintColor} />;
};

  const SignedOutStack = createStackNavigator({
    Login: { screen: LoginScreen }
  });

  const MenuButton = (props) => {
  	return (
    	<View>
        <Icon.Button name="bars" backgroundColor="transparent" onPress={() => { props.navigation.toggleDrawer() } }/>
    	</View>
    );
  };

  const HomeStack = createStackNavigator({
    Home: { screen: HomeScreen },
    ViewMediaDetail: { screen: ViewMediaDetailScreen },
    ViewProfile: { screen: ViewProfileScreen },
  });

  const ProfileStack = createStackNavigator({
    Profile: { screen: ProfileScreen },
    MediaDetail: { screen: MediaDetailScreen },
    UpdateMedia: { screen: UpdateMediaScreen },
    BusinessRegister: { screen: BusinessRegisterScreen },
    ViewMediaDetail: { screen: ViewMediaDetailScreen },
    ViewProfile: { screen: ViewProfileScreen },
  });

  const ManageMediaStack = createStackNavigator({
    ManageMedia: { screen: ManageMediaScreen },
    ReviewMedia: { screen: ReviewMediaScreen }
  });

  const SearchStack = createStackNavigator({
    Search: { screen: SearchScreen },
    ViewMediaDetail: { screen: ViewMediaDetailScreen },
    ViewProfile: { screen: ViewProfileScreen },
  });

  const SignedInBusinessTabNavigator = createBottomTabNavigator(
    {
      Home: {
        screen: HomeStack,
        navigationOptions: {
          tabBarLabel: " ",
          tabBarIcon: ({ focused, tintColor }) => {
            if (focused) {
              tintColor = 'rgba(189, 37, 60, 0.90)';
            }
            return <Icon name="home" style={{marginTop: 5}} size={25} color={tintColor}/>;
          },
        }
      },

      Search: {
        screen: SearchStack,
        navigationOptions: {
          tabBarLabel: " ",
          tabBarIcon: ({ focused, tintColor }) => {
            if (focused) {
              tintColor = 'rgba(189, 37, 60, 0.90)';
            }
            return <Icon name="search" style={{marginTop: 5}} size={25} color={tintColor}/>;
          },
        }
      },

      ManageMedia: {
        screen: ManageMediaStack,
        navigationOptions: {
          tabBarLabel: " ",
          tabBarIcon: ({ focused, tintColor }) => {
            if (focused) {
              tintColor = 'rgba(189, 37, 60, 0.90)';
            }
            return <Icon name="plus" style={{marginTop: 5}} size={25} color={tintColor}/>;
          },
        }
      },

      Profile: {
        screen: ProfileStack,
        navigationOptions: {
          tabBarLabel: " ",
          tabBarIcon: ({ focused, tintColor }) => {
            if (focused) {
              tintColor = 'rgba(189, 37, 60, 0.90)';
            }
            return <Icon name="user-circle" style={{marginTop: 5}} size={25} color={tintColor}/>;
          },
        }
      },

    },
    {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "ManageMedia") {
          // iconName = `ios-information-circle${focused ? '' : '-outline'}`;
          iconName = "home";
        } else if (routeName === "Profile") {
          iconName = "account";
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Icon name={iconName} size={25} color={tintColor} />;
      }
    })
    }
  );

  const SignedInTabNavigator = createBottomTabNavigator(
    {
      Home: {
        screen: HomeStack,
        navigationOptions: {
          tabBarLabel: " ",
          tabBarIcon: ({ focused, tintColor }) => {
            if (focused) {
              tintColor = 'rgba(189, 37, 60, 0.90)';
            }
            return <Icon name="home" style={{marginTop: 5}} size={25} color={tintColor}/>;
          },
        }
      },

      Search: {
        screen: SearchStack,
        navigationOptions: {
          tabBarLabel: " ",
          tabBarIcon: ({ focused, tintColor }) => {
            if (focused) {
              tintColor = 'rgba(189, 37, 60, 0.90)';
            }
            return <Icon name="search" style={{marginTop: 5}} size={25} color={tintColor}/>;
          },
        }
      },

      Profile: {
        screen: ProfileStack,
        navigationOptions: {
          tabBarLabel: " ",
          tabBarIcon: ({ focused, tintColor }) => {
            if (focused) {
              tintColor = 'rgba(189, 37, 60, 0.90)';
            }
            return <Icon name="user-circle" style={{marginTop: 5}} size={25} color={tintColor}/>;
          },
        }
      },

    },
    {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        return <Icon name={iconName} size={25} color={tintColor} />;
      }
    })
    }
  );

const createRootLayout = (signedInType) => {
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedInTabNavigator
      },
      SignedInBusiness: {
        screen: SignedInBusinessTabNavigator
      },
      SignedOut: {
        screen: SignedOutStack
      }
    },
    {
      initialRouteName: signedInType == 0 ? "SignedOut" : signedInType == 1 ? "SignedIn" : signedInType == 2 ? "SignedInBusiness" : "SignedOut"
    }
  )
};

export const AppContainer = (signedInType = 0) => {
   return createAppContainer(createRootLayout(signedInType));
 }
