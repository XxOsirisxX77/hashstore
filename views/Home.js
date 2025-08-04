import React from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, FlatList, StyleSheet, ScrollView } from 'react-native';
import { onInstagramSignOut } from '../services/AuthService';
import { getPopularCategories, getDiscoverStores } from '../services/HomeService';
import { commonNavigationOptions } from './CommonScreen';
import { globalStyles, globalScaledStyles } from '../styles/GlobalStyle';
import { setPopularCategory } from '../services/HomeSearchNavigationHack';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { ScaledSheet } from 'react-native-size-matters';

class HomeScreen extends React.Component {
  static navigationOptions = commonNavigationOptions;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      discoveryStores: []
    };
  }

  loadCategories = async () => {
    await getPopularCategories().then((responseJson) => {
      this.setState({ isLoading: false, categories: responseJson });
    })
    .catch((error) => {
      //
    });
  };

  loadDiscoveryStores = async () => {
    await getDiscoverStores().then((responseJson) => {
      this.setState({ isLoading: false, discoveryStores: responseJson });
    })
    .catch((error) => {
      //
    });
  }

  goToProfile = async (userId) => {
    this.props.navigation.navigate({
        routeName: 'ViewProfile',
        params: {
            title: '',
            name: 'ViewProfile',
            hasChanged: true,
            id: userId
        },
        key: 'ViewProfile' + new Date()
    });
  };

  viewItem = async (media) => {
    this.props.navigation.navigate({
        routeName: 'ViewMediaDetail',
        params: {
            title: '',
            name: 'ViewMediaDetail',
            media: media
        },
        key: 'ViewMediaDetail' + new Date()
    });
  };

  searchPopularCategory = (category) => {
    setPopularCategory(category);
    this.props.navigation.navigate('Search');
  };

  changePopularCategoryBorder = () => {
    if (this.state.popularCategoryPictureHeight === null) {
      return;
    }
    return {
      borderRadius: this.state.popularCategoryPictureHeight / 2
    }
  }

  componentDidMount() {
    activateKeepAwake();
    this.loadCategories();
    this.loadDiscoveryStores();
  }

  componentWillUnmount() {
    deactivateKeepAwake();
  }

  render() {
    return (
      <View style={[styles.mainContainer]}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.popularContainer]}>
          <Text style={[globalScaledStyles.textBoldRegular, styles.popularCategoryHeaderText]}>
            Popular
          </Text>
          <ScrollView style={[styles.popularScrollContainer]} scrollEnabled={false} >
            <FlatList
              data={ this.state.categories }
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ flexGrow: 1 }}
              renderItem={({item}) =>
                <TouchableOpacity style={[styles.popularCategoryContainer, scaledStyles.popularCategoryContainer]} onPress={() => this.searchPopularCategory(item)}>
                  <Image
                    onLayout={(event) => {
                      var {x, y, width, height} = event.nativeEvent.layout;
                      this.setState({ popularCategoryPictureHeight: height })
                    }}
                    style={[styles.popularCategoryImage, scaledStyles.popularCategoryImage, this.changePopularCategoryBorder()]} source={{ uri: item.image }}/>
                  <Text style={[globalScaledStyles.textBoldRegular, styles.popularCategoryText, scaledStyles.popularCategoryText]}>
                    { item.category }
                  </Text>
                </TouchableOpacity>
              }
            />
          </ScrollView>
        </View>
        <View style={[globalStyles.screenBordersMargin, styles.discoveryContainer]}>
          <Text style={[globalScaledStyles.textBoldRegular, styles.discoveryHeaderText, scaledStyles.discoveryHeaderText]}>
            Discover new stores
          </Text>
          <ScrollView style={[globalStyles.discoveryScroller]}>
            <FlatList
              data={ this.state.discoveryStores }
              extraData={this.state}
              numColumns={1}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ flexGrow: 1 }}
              renderItem={({item}) =>
                <View style={[styles.discoverySectionContainer]}>
                  <View style={[styles.discoveryUserContainer]}>
                    <TouchableOpacity style={[styles.discoveryUserTouch]} onPress={() => this.goToProfile(item.id)}>
                      <Image style={[styles.discoveryUserImage]} source={{ uri: item.profile_picture }}/>
                      <Text style={[globalScaledStyles.textBoldRegular, styles.discoveryUserName]}>
                        @{ item.username }
                      </Text>
                    </TouchableOpacity>
                    <View style={[scaledStyles.discoveryCategoryTextContainer]}>
                      <Text style={[globalScaledStyles.textBoldRegular, styles.discoveryCategoryText]}>
                         { item.category.category }
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.discoveryItemContainer]}>
                    <FlatList
                      data={ item.medias }
                      extraData={this.state}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={{ flexGrow: 1 }}
                      renderItem={({item}) =>
                        <TouchableOpacity style={[styles.discoveryItemTouch]} onPress={() => this.viewItem(item)}>
                          <Image style={[styles.discoveryItemImage]} source={{ uri: item.image }}/>
                        </TouchableOpacity>
                      }
                    />
                  </View>
                </View>
              }
            />
            </ScrollView>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(189, 189, 189, 0.15)',
  },
  popularContainer: {
    flex: 0.5,
    flexDirection: 'column',
    marginTop: 12
  },
  popularCategoryHeaderText: {
    alignSelf: 'center'
  },
  popularScrollContainer: {
    flex: 1
  },
  popularCategoryContainer: {
    //flex: 1,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 19
  },
  popularCategoryImage: {
    // width: 132,
    // height: 132,
    // borderRadius: 132/2,
    borderColor: 'rgba(128, 128, 128, 0.52)',
    borderWidth: 1
  },
  popularCategoryText: {
    // fontSize: 14,
    alignSelf: 'center',
    // marginTop: 7,
    color: 'rgba(106, 106, 106, 1)'
  },
  discoveryContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  discoveryScroller: {
    flex: 1,
    flexDirection: 'colum'
  },
  discoveryHeaderText: {
    alignSelf: 'center',
    marginBottom: 19,
  },
  discoverySectionContainer: {
    flex: 1
  },
  discoveryUserContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  discoveryUserTouch: {
    flex: 1,
    flexDirection: 'row'
  },
  discoveryUserImage: {
    width: 47,
    height: 47,
    borderRadius: 47/2,
    borderColor: 'rgba(128, 128, 128, 0.52)',
    borderWidth: 1
  },
  discoveryUserName: {
    alignSelf: 'center',
    fontSize: 14,
    marginLeft: 22
  },
  discoveryCategoryTextContainer: {
    backgroundColor: 'rgba(22, 89, 157, 1)',
    paddingLeft: 36,
    paddingRight: 36,
    paddingTop: 3,
    paddingBottom: 3,
    borderRadius: 4,
    height: 28,
    alignSelf: 'center',
  },
  discoveryCategoryText: {
    fontSize: 14,
    alignSelf: 'center',
    color: 'white'
  },
  discoveryItemContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 20
  },
  discoveryItemTouch: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5
  },
  discoveryItemImage: {
    width: 69,
    height: 69,
    resizeMode: 'contain',
    borderColor: 'rgba(128, 128, 128, 0.52)',
  }
});

const scaledStyles = ScaledSheet.create({
  popularCategoryContainer: {
    height: '130@vs'
  },
  popularCategoryImage: {
    width: '90@vs',
    height: '90@vs',
    borderColor: 'rgba(128, 128, 128, 0.52)',
    borderWidth: 1
  },
  popularCategoryText: {
    fontSize: '14@ms',
    marginTop: '7@ms'
  },
  discoveryHeaderText: {
    marginTop: '10@ms'
  },
  discoveryCategoryTextContainer: {
    backgroundColor: 'rgba(22, 89, 157, 1)',
    paddingLeft: '36@ms',
    paddingRight: '36@ms',
    paddingTop: '3@ms',
    paddingBottom: '3@ms',
    borderRadius: '4@ms',
    height: '28@ms',
    alignSelf: 'center',
  },
});

export default HomeScreen;
