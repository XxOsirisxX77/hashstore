import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, StatusBar } from 'react-native';
import { router } from 'expo-router';
import InstagramLogin from 'react-native-instagram-login';
import { obtainInstagramToken, onInstagramSignIn, authorizeUser } from '../../services/AuthService';
import { getProfileFromApiAsync } from '../../services/UserService';
import { globalStyles, globalScaledStyles} from '../../styles/GlobalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { translate } from '../../config/i18n';
import { ScaledSheet } from 'react-native-size-matters';
import NetworkIssue from '../../components/NetworkIssue';
import { useAuth } from '../auth/AuthContext';

export default function LoginScreen() {
  const [networkIssue, setNetworkIssue] = useState(false);
  const instagramLoginRef = useRef<any>(null);
  const { signIn } = useAuth();

  const login = async (token: string) => {
    if (token !== null) {
      try {
        const userProfile = await getProfileFromApiAsync(token);
        setNetworkIssue(false);
        if (userProfile) {
          const credentials = {
            username: userProfile.username,
            password: token
          };
          await authorizeUser(credentials);
          await onInstagramSignIn(token);
          await signIn(token);
          // Navigation will be handled by the auth context
        }
      } catch (error: any) {
        if (error.toString().indexOf('TypeError: Network request failed') > -1) {
          setNetworkIssue(true);
        }
      }
    }
  };

  const validateToken = async () => {
    try {
      const result = await obtainInstagramToken();
      if (result) {
        await login(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  if (networkIssue) {
    return (
      <NetworkIssue retryMethod={() => { validateToken(); }}/>
    );
  }

  return (
    <ImageBackground source={require('../../assets/images/radial-gradient.png')} style={[styles.mainContainer]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.logoContainer]}>
        <Image style={[styles.appLogo]} source={require('../../assets/images/app-logo.png')}/>
        <Image style={[styles.appName]} source={require('../../assets/images/hashstore-name.png')}/>
      </View>
      <View style={[styles.loginButtonContainer]}>
        <TouchableOpacity onPress={() => { instagramLoginRef.current?.show(); }} style={[styles.loginButtonTouch]}>
          <View style={[styles.loginButton]}>
            <Icon name="instagram" style={[styles.loginButtonIcon]}/>
            <Text style={[globalStyles.textBoldRegular, styles.loginButtonText]}>{translate.t('login')}</Text>
          </View>
        </TouchableOpacity>
        <InstagramLogin
            ref={instagramLoginRef}
            appId='b6a9c039ffd849daa916f510330a5e4c'
            redirectUrl='http://localhost:8080/users/instagram_access'
            scopes={['public_content', 'follower_list']}
            onLoginSuccess={(token) => login(token)}
            onLoginFailure={(data) => console.log(data)}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  logoContainer: {
    flex: 1/2,
    flexDirection: 'column',
    marginTop: 180
  },
  appLogo: {
    flex: 1 - 0.5,
    height: 151,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  appName: {
    flex: 1 - 0.7,
    height: 48,
    marginTop: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  loginButtonContainer: {
    flex: 1/2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonTouch: {
    flex: 1,
    backgroundColor: 'rgba(181, 31, 51, 0.5)',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 59,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    flex: 1,
    flexDirection: 'row',
    width: 250
  },
  loginButtonIcon: {
    flex: 1 - 0.8,
    color: 'white',
    fontSize: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    textAlign: 'center',
    marginTop: 8
  },
  loginButtonText: {
    flex: 1,
    color: 'white',
    fontSize: 14,
    textTransform: 'uppercase',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 5,
    marginTop: 18
  },
});