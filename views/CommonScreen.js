import React from 'react';
import {
  View,
  Image
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

export const commonNavigationOptions = {
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor: 'rgba(189, 37, 60, 0.90)'
  },
  headerTitle: (
    <Image
      resizeMode="contain"
      style={{width: moderateScale(140),
        height: moderateScale(60),
        resizeMode: 'contain',
        alignSelf: 'center',
      }}
      source={require('../assets/images/hashstore-name.png')}
    />
  ),
  headerRight: <View/>
};
