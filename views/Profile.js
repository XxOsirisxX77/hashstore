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
  StatusBar,
  Modal,
  TouchableHighlight
} from 'react-native';
import { getProfileFromDatabaseAsync } from '../services/UserService';
import { getStoreItemsFromDatabase, obtainMedia, getLikedMedia } from '../services/MediaService';
import { obtainInstagramToken, onInstagramSignOut } from '../services/AuthService';
import { shouldReloadProfile, reloadProfile } from '../services/ProfileMediaNavigationHack';
import { globalStyles, globalScaledStyles } from '../styles/GlobalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonNavigationOptions } from './CommonScreen';
import TableCell from '../components/TableCell';
import { ScaledSheet } from 'react-native-size-matters';

class ProfileScreen extends React.Component {
  static navigationOptions = commonNavigationOptions;

  constructor(props) {
    super(props);
    const { navigation } = this.props;

    this.state = {
      isLoading: true,
      isLoadingItems: true,
      canTap: true,
      selectedTabIndex: 0,
      modalVisible: false
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
      this.loadLikedMedia();
      reloadProfile(false);
      navigation.setParams({ hasChanged: false });
      this.setState({ canTap: true });
    }
  );

  loadLikedMedia = async () => {
    await getLikedMedia().then((responseJson) => {
      this.setState({ isLoading: false, likedItems: responseJson });
    })
    .catch((error) => {
      this.setState({ isLoading: false, isError: true });
      this.props.navigation.navigate('Login');
    });
  };

  loadScreen = async () => {
    await getProfileFromDatabaseAsync().then((responseJson) => {
      this.setState({ isLoading: false, user: responseJson });
    })
    .catch((error) => {
      this.setState({ isLoading: false, isError: true });
      this.props.navigation.navigate('Login');
    });

    this.loadLikedMedia();

    await getStoreItemsFromDatabase().then((responseJson) => {
      if (responseJson.error !== undefined) {
        this.setState({ isLoadingItems: false, isErrorItems: true });
        return;
      }
      this.setState({ isLoadingItems: false, databaseItems: responseJson, selectedTabIndex: this.state.user.is_business ? 0 : 1 });
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
        this.props.navigation.navigate('MediaDetail', { media: media });
      }
    }
  };

  seeViewDetail = async (item) => {
    if (item !== undefined && this.state.canTap) {
      const media = await obtainMedia(item.id);
      if (media !== null) {
        this.props.navigation.navigate('ViewMediaDetail', { media: media });
      }
    }
  };

  changeTab = (index) => {
    if (this.state.selectedTabIndex !== index && index > -1 && index < 3) {
      this.setState({ selectedTabIndex: index });
    }
  };

  signOut = () => {
    this.setModalVisible(false);
    onInstagramSignOut();
    this.props.navigation.navigate('Login');
  };

  storeForm = () => {
    this.setModalVisible(false);
    this.props.navigation.navigate('BusinessRegister', { user: this.state.user });
  };

  goPublish = () => {
    this.props.navigation.navigate('ManageMedia');
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount() {
    this.loadScreen();
  }

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

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          >
          <StatusBar barStyle="dark-content" />
          <View style={[styles.settingsModal]}>
            <View style={[styles.modalMainContainer]}>
              <View style={[globalStyles.separator, styles.modalCloseContainer]}>
                <TouchableOpacity style={[styles.modalClose]}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Image style={[styles.closeModalImage]} source={require('../assets/images/close.png')}/>
                </TouchableOpacity>
                <Text style={[globalStyles.textBoldRegular, styles.modalHeaderText]}>
                  Settings
                </Text>
              </View>
              <View style={[styles.tableView]}>
                <TableCell onPress={() => { return; }} text="Help" isNavigation={true}/>
                <TableCell onPress={ this.storeForm } text={ this.state.user.is_business ? 'Update Store' : 'Become a Store'} isNavigation={true}/>
                <View style={[styles.cellSeparator]}/>
                <TableCell onPress={() => { return; }} text="Terms of Service" isNavigation={true}/>
                <TableCell onPress={ this.signOut } text="Log Out" isNavigation={false} cellStyle={[scaledStyles.cellBottom]}/>
              </View>
            </View>
          </View>
        </Modal>

        <View style={[styles.userInfoContainer]}>
          <View style={[styles.userImageContainer]}>
            <Image onLayout={(event) => {
                var {x, y, width, height} = event.nativeEvent.layout;
                this.setState({ profilePictureHeight: height })
              }}
              style={[styles.center, this.changePictureSize(), styles.marginTB20]}
              source={{ uri: this.state.user.profile_picture }}
            />
          </View>
          <View style={[styles.userSettingsContainer]}>
            <View style={[styles.userDetailsContainer]}>
              <Text style={[globalScaledStyles.textBoldRegular, scaledStyles.usernameFont]} adjustsFontSizeToFit numberOfLines={1}>
                @{ this.state.user.username }
              </Text>
              <Text style={[globalScaledStyles.textBoldRegular, scaledStyles.nameFont]} adjustsFontSizeToFit numberOfLines={1}>
                { this.state.user.full_name }
              </Text>
            </View>
            <TouchableOpacity style={[styles.settingsTouch]} onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
              <Icon name="cog" style={[styles.settingsIcon]} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.tabContainer]}>
          { this.state.user.is_business &&
            <View style={[styles.tabContainerView]}>
              <TouchableOpacity style={[styles.tabIconTouch]} onPress={() => { this.changeTab(0) }}>
                <Icon name="home" style={[styles.tabIcon]} size={28} color={this.state.selectedTabIndex === 0 ? 'rgba(151, 15, 2, 0.8)' : 'rgba(0, 0, 0, 0.6)'}/>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabIconTouch]} onPress={() => { this.changeTab(1) }}>
                <Icon name="heart-o" style={[styles.tabIcon]} size={28} color={this.state.selectedTabIndex === 1 ? 'rgba(151, 15, 2, 0.8)' : 'rgba(0, 0, 0, 0.6)'}/>
              </TouchableOpacity>
            </View>
          }
        </View>

        <View style={[styles.tabDetailContainer]}>
        { this.state.selectedTabIndex === 0 && this.state.databaseItems.length > 0 &&
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
        }
        { this.state.selectedTabIndex === 0 && this.state.databaseItems.length === 0 &&
          <View style={[styles.noItemStoreContainer]}>
            <Text style={[globalStyles.textLightRegular, styles.noItemText]}>
              It seems like you haven't published any item in your store.
            </Text>
            <TouchableOpacity style={[globalStyles.defaultButton, styles.itemButtonContainer]} onPress={ this.goPublish }>
              <Text style={[globalStyles.textBoldRegular, styles.noItemButtonText]}>
                Get Started
              </Text>
            </TouchableOpacity>
          </View>
        }
        {this.state.selectedTabIndex === 1 && this.state.likedItems.length > 0 &&
          <FlatList
            data={ this.state.likedItems }
            numColumns={3}
            keyExtractor={(item, index) => index}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({item}) =>
              <TouchableOpacity style={[styles.itemContainer]} onPress={() => this.seeViewDetail(item.media) }>
                <Image style={[ styles.item ]} source={{ uri: item.media.thumbnail }}/>
              </TouchableOpacity>
            }
          />
        }
        { this.state.selectedTabIndex === 1 && this.state.likedItems.length === 0 &&
          <View style={[styles.noItemStoreContainer]}>
            <Text style={[globalStyles.textLightRegular, styles.noItemText]}>
              You haven't liked any item yet.
            </Text>
          </View>
        }
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

  settingsModal: {
    flex: 1,
    backgroundColor: 'rgba(189, 189, 189, 0.15)'
  },
  modalMainContainer: {
    flex: 1,
    marginTop: 80,
    flexDirection: 'column',
  },
  modalCloseContainer: {
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
  },
  modalClose: {
    flex: 0
  },
  closeModalImage: {
    width: 25,
    height: 25,
    resizeMode: 'contain'
  },
  modalHeaderText: {
    flex: 1,
    textAlign: 'center',
    marginRight: 25
  },
  tableView: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 12,

  },
  cellSeparator: {
    height: 36
  },


  userInfoContainer: {
    flex: 0.4,
    flexDirection: 'row',
  },
  userImageContainer: {
    flex: 0.7
  },
  userDetailsContainer: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  userSettingsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  settingsTouch: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginRight: 5,
    marginTop: 5,
    backgroundColor: 'rgba(189, 189, 189, 0.5)',
    borderRadius: 35 / 2,

  },
  settingsIcon: {
    alignSelf: 'center',
    opacity: 0.9
  },
  center: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  // profilePicture: {
  //   width: '100%',
  //   flex: 1,
  //   //height: '100%',
  //   borderRadius: 152.66665649414062 / 2,
  //   borderWidth: 1,
  //   borderColor: 'rgba(128, 128, 128, 0.52)'
  // },
  marginTB20: {
    marginTop: 20,
    marginBottom: 20
  },
  // usernameFont: {
  //   //fontSize: 22,
  //   color: 'rgba(98, 92, 92, 1)'
  // },
  // nameFont: {
  //   //fontSize: 26,
  //   color: 'rgba(98, 92, 92, 1)'
  // },
  tabContainer: {
    flex: 0.1,
    flexDirection: 'row',
    height: 53,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.15)'
  },
  tabContainerView: {
    flex: 1,
    flexDirection: 'row',
  },
  tabIconTouch: {
    flex: 1/2,
    justifyContent: 'center',
  },
  tabIcon: {
    alignSelf: 'center'
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
  icon: {
    width: 20,
    height: 20
  },
  noItemStoreContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  noItemText: {
    textAlign: 'center'
  },
  itemButtonContainer: {
    width: 150,
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(181, 31, 51, 0.8)'
  },
  noItemButtonText: {
    color: 'white',
    alignSelf: 'center',
    textTransform: 'uppercase',
    fontSize: 14
  }
});

const scaledStyles = ScaledSheet.create({
  usernameFont: {
    fontSize: '22@ms',
    color: 'rgba(98, 92, 92, 1)'
  },
  nameFont: {
    fontSize: '26@ms',
    color: 'rgba(98, 92, 92, 1)'
  },
  cellBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '150@vs'
  },
});

export default ProfileScreen;
