import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Platform,
  ActionSheetIOS,
  Alert,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonNavigationOptions } from './CommonScreen';
import { globalStyles } from '../styles/GlobalStyle';
import { obtainMedia, likeMedia, likedMedia } from '../services/MediaService';
import { capitalizeWords } from '../services/UtilService';


class ViewMediaDetailScreen extends React.Component {
  static navigationOptions = commonNavigationOptions;

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      mediaProp: navigation.getParam('media', null)
    };
  }

  willFocusSubscription = this.props.navigation.addListener(
    'willFocus',
    payload => {
      this.likedMedia();
    }
  );

  showProfile = () => {
    this.props.navigation.navigate({
        routeName: 'ViewProfile',
        params: {
            title: '',
            name: 'ViewProfile',
            hasChanged: true,
            id: this.state.media.users.id
        },
        key: 'ViewProfile' + new Date()
    });
  };

  likedMedia = async () => {
    await likedMedia(this.state.mediaProp.id).then((responseJson) => {
      this.setState({ isLoading: false, liked: responseJson });
    })
    .catch((error) => {
      //
    });
  };

  likeMedia = async () => {
    await likeMedia(this.state.mediaProp.id).then((responseJson) => {
      this.setState({ isLoading: false, liked: responseJson });
    })
    .catch((error) => {
      //
    });
  };

  loadMedia = async () => {
    await obtainMedia(this.state.mediaProp.id).then((responseJson) => {
      this.setState({ isLoading: false, media: responseJson });
    })
    .catch((error) => {
      //
    });
  };

  componentDidMount() {
    this.loadMedia();
    this.likedMedia();
  }

  render() {
    if (this.state.media === undefined) {
      return null;
    }
    return (
      <ScrollView style={[styles.mainContainer]}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.headerContainer]}>
          <View style={[styles.userProfileContainer]}>
            <TouchableOpacity style={[styles.userProfileTouch]} onPress={ this.showProfile }>
              <Image style={[styles.userImage]} source={{  uri: this.state.media.users.profile_picture }}/>
              <Text style={[globalStyles.textLightRegular, styles.usernameText]}>
                @{this.state.media.users.username}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.itemContainer]}>
          <View style={styles.itemTitleContainer}>
            <Text style={[globalStyles.textLightRegular, styles.itemTitle]}>
              { this.state.media.title }
            </Text>
            <View style={[styles.itemConditionContainer]}>
              <Text style={[globalStyles.textBoldRegular, styles.itemCondition]}>
                { capitalizeWords(this.state.media.quality) }
              </Text>
            </View>
          </View>
          <Image style={[styles.itemImage]}
            source={{ uri: this.state.media.image }}
          />
        </View>
        <View style={[styles.detailContainer]}>
          <View style={[styles.locationContainer]}>
            <Image style={[styles.locationImage]} source={ require('../assets/images/location-icon.png')}/>
            <Text style={[globalStyles.textLightRegular, styles.locationText]}>
              { this.state.media.users.country.country }
            </Text>
            <TouchableOpacity style={[styles.heartTouch]} onPress={() => { this.likeMedia() }}>
              <Icon name={this.state.liked ? 'heart' : 'heart-o'} style={ this.state.liked ? [styles.heartIconActive] : [styles.heartIcon]} size={28}/>
            </TouchableOpacity>
          </View>
          <View style={[styles.priceContainer]}>
            { this.state.media.quantity !== null && this.state.media.quantity < 5 && this.state.media.quantity > 0 &&
              <Text style={[globalStyles.textBoldRegular, styles.quantityText]}>
                Only { this.state.media.quantity } left
              </Text>
            }
            { this.state.media.quantity !== null && this.state.media.quantity < 1 &&
              <Text style={[globalStyles.textBoldRegular, styles.quantityText]}>
                Out of stock
              </Text>
            }
            <Text style={[globalStyles.textBoldRegular, this.state.media.quantity !== null && this.state.media.quantity < 5 ? styles.priceText : styles.priceTextAlone]}>
              { this.state.media.users.currency.code }{ this.state.media.users.currency.symbol } { this.state.media.price }
            </Text>
          </View>
          <View style={[styles.descriptionContainer]}>
            <Text style={[globalStyles.textLightRegular, styles.descriptionText]}>
              { this.state.media.description }
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(189, 189, 189, 0.15)'
  },

  //---- HEADER ----
  headerContainer: {
    flex: 1,
    height: 40,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    flexDirection: 'row'
  },
  userProfileContainer: {
    flex: 1/2,
    flexDirection: 'row',
  },
  userProfileTouch: {
    flex: 1,
    flexDirection: 'row'
  },
  userImage: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.52)'
  },
  usernameText: {
    color: 'rgba(61, 85, 240, 1)',
    marginLeft: 20
  },

  //----- ITEM -----
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  itemTitleContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  itemTitle: {
    flex: 1,
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 40
  },
  itemConditionContainer: {
    flex: 0.2,
    justifyContent: 'center',
    backgroundColor: 'rgba(22, 89, 157, 1)',
    borderRadius: 4,
    alignSelf: 'center',
    alignItems: 'center',
    height: 32,
    marginRight: 20,
  },
  itemCondition: {
    color: 'white',
    fontSize: 14,
    justifyContent: 'center',
    textAlign: 'center'
  },
  itemImage: {
    height: 386
  },

  //------- DETAIL -----
  detailContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 20,
    marginTop: 20,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  locationImage: {
    flex: 1 - 0.9,
    height: 31,
    resizeMode: 'contain',
    opacity: 0.5,
    marginRight: 10
  },
  locationText: {
    flex: 1 - 0.1,
    fontSize: 20,
    textAlign: 'left'
  },
  heartTouch: {
    alignSelf: 'flex-end',
    justifyContent: 'center'
  },
  heartIcon: {
    color: 'black'
  },
  heartIconActive: {
    color: 'rgba(189, 37, 60, 0.90)'
  },

  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20
  },
  quantityText: {
    flex: 1/2,
    fontSize: 16,
    color: 'rgba(187, 100, 37, 1)',
    marginLeft: 10
  },
  priceText: {
    flex: 1/2,
    fontSize: 20,
    textAlign: 'right',
  },
  priceTextAlone: {
    flex: 1,
    fontSize: 20,
    textAlign: 'right',
  },

  //------ DESCRIPTION ----
  descriptionContainer: {
    flex: 1/3,
    marginTop: 20,
    marginLeft: 15
  },
  descriptionText: {

  }

});

export default ViewMediaDetailScreen;
