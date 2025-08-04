import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Button,
  StatusBar
} from 'react-native';
import { getProfileFromApiAsync } from '../services/UserService';
import { getStoreItemsFromDatabase, obtainMedia } from '../services/MediaService';
import { obtainInstagramToken, onInstagramSignOut } from '../services/AuthService';
import { shouldReloadProfile, reloadProfile } from '../services/ProfileMediaNavigationHack';
import { globalStyles, globalScaledStyles } from '../styles/GlobalStyle';
import { commonNavigationOptions } from './CommonScreen';
import { ScaledSheet } from 'react-native-size-matters';

class ViewProfileScreen extends React.Component {
  static navigationOptions = commonNavigationOptions;

  constructor(props) {
    super(props);
    const { navigation } = this.props;

    this.state = {
      isLoading: true,
      isLoadingItems: true,
      canTap: true,
      selectedTabIndex: 0,
    };

  }

  willFocusSubscription = this.props.navigation.addListener(
    'willFocus',
    payload => {
      this.setState({ canTap: false });
      const { navigation } = this.props;
      let hasChanged = navigation.getParam('hasChanged', false);
      if (hasChanged) {
        this.loadScreen();
      } else {
        hasChanged = shouldReloadProfile();
        if (hasChanged) {
          this.loadScreen();
        }
      }
      reloadProfile(false);
      navigation.setParams({ hasChanged: false });
      this.setState({ canTap: true });
    }
  );

  loadScreen = async () => {
    //TODO -- GetProfileFromDataBase
    await getProfileFromApiAsync().then((responseJson) => {
      this.setState({ isLoading: false, user: responseJson });
    })
    .catch((error) => {
      this.setState({ isLoading: false, isError: true });
      this.props.navigation.navigate('Login');
    });

    await getStoreItemsFromDatabase().then((responseJson) => {
      if (responseJson.error !== undefined) {
        this.setState({ isLoadingItems: false, isErrorItems: true });
        return;
      }
      this.setState({ isLoadingItems: false, databaseItems: responseJson });
    })
    .catch((error) => {
      this.setState({ isLoadingItems: false, isErrorItems: true });
      this.props.navigation.navigate('Login');
      //Check if Token expired / revoked - Send back to Login Screen
    });

  };

  seeDetail = async (item) => {
    if (item !== undefined && this.state.canTap) {
      const media = await obtainMedia(item.id);
      if (media !== null) {
        this.props.navigation.navigate({
                    routeName: 'ViewMediaDetail',
                    params: {
                        title: '',
                        name: 'ViewMediaDetail',
                        media: media
                    },
                    key: 'ViewMediaDetail' + new Date()
                })
      }
    }
  };

  changePictureSize = () => {
    if (this.state.profilePictureHeight === null) {
      return;
    }
    return {
      width: this.state.profilePictureHeight,
      flex: 1,
      borderRadius: this.state.profilePictureHeight / 2,
      borderWidth: 1,
      borderColor: 'rgba(128, 128, 128, 0.52)'
    }
  }

  componentDidMount() {
    this.loadScreen();
  }

  render() {
    if (this.state.isLoadingItems) {
      return null;
    } else if (!this.state.isLoading && this.state.isError) {
      return (
        <View>
          <StatusBar barStyle="light-content" />
          <Text>
            An Unexpected Error Has Occurred In Profile.
          </Text>
        </View>
      );
    } else if (!this.state.isLoadingItems && this.state.isErrorItems) {
      return (
        <View>
          <StatusBar barStyle="light-content" />
          <Text>
            An Unexpected Error Has Occurred.
          </Text>
        </View>
      );
    }
    const {height, width} = Dimensions.get('window');
    const itemWidth = (width - 15) / 2;
    return (
      <View style={[styles.mainContainer]}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.userInfoContainer]}>
          <Text style={[globalScaledStyles.textBoldRegular, scaledStyles.usernameFont, styles.center]}>
            @{ this.state.user.username }
          </Text>
          <Image
          onLayout={(event) => {
              var {x, y, width, height} = event.nativeEvent.layout;
              this.setState({ profilePictureHeight: height })
            }}
            style={[styles.center, scaledStyles.profilePicture, this.changePictureSize(), styles.marginTB20]}
            source={{ uri: this.state.user.profile_picture }}
          />
          <Text style={[globalScaledStyles.textBoldRegular, scaledStyles.nameFont, styles.center]}>
            { this.state.user.full_name }
          </Text>
        </View>
        <View style={[styles.tabDetailContainer]}>
          <FlatList
            data={ this.state.databaseItems }
            numColumns={3}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({item}) =>
              <TouchableOpacity style={[styles.itemContainer]} onPress={() => this.seeDetail(item) }>
                <Image style={[ styles.item ]} source={{ uri: item.thumbnail }}/>
              </TouchableOpacity>
            }
          />
        </View>
      </View>
  );
  }
}
//{minWidth: { itemWidth }, maxWidth: { itemWidth }}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(189, 189, 189, 0.15)'
  },
  userInfoContainer: {
    flex: 1 - 0.2,
    flexDirection: 'column',
  },
  center: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  profilePicture: {
    //flex: 1,
    width: 141,
    height: 141,
    borderRadius: 141 / 2,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.52)'
  },
  marginTB20: {
    marginTop: 20,
    marginBottom: 20
  },
  usernameFont: {
    //flex: 1,
    fontSize: 22,
    color: 'rgba(98, 92, 92, 1)'
  },
  nameFont: {
    fontSize: 26,
    color: 'rgba(98, 92, 92, 1)'
  },
  tabContainer: {
    flex: 1 - 0.85,
    flexDirection: 'row',
    height: 53,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.15)'
  },
  tabDetailContainer: {
    flex: 1
  },
  itemContainer: {
    flex: 1/3
  },
  item: {
    height: 135,
    margin: 1
  },
});

const scaledStyles = ScaledSheet.create({
  profilePicture: {
    height: '135@ms'
  },
  usernameFont: {
    fontSize: '22@ms',
    color: 'rgba(98, 92, 92, 1)'
  },
  nameFont: {
    fontSize: '26@ms',
    color: 'rgba(98, 92, 92, 1)'
  },
});

export default ViewProfileScreen;
