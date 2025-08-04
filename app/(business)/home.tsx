import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Image, FlatList, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { onInstagramSignOut } from '../../services/AuthService';
import { getPopularCategories, getDiscoverStores } from '../../services/HomeService';
import { globalStyles, globalScaledStyles } from '../../styles/GlobalStyle';
import { setPopularCategory } from '../../services/HomeSearchNavigationHack';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { ScaledSheet } from 'react-native-size-matters';

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [discoveryStores, setDiscoveryStores] = useState([]);
  const [popularCategoryPictureHeight, setPopularCategoryPictureHeight] = useState<number | null>(null);

  useEffect(() => {
    activateKeepAwake();
    loadCategories();
    loadDiscoveryStores();

    return () => {
      deactivateKeepAwake();
    };
  }, []);

  const loadCategories = async () => {
    try {
      const responseJson = await getPopularCategories();
      setCategories(responseJson);
    } catch (error) {
      console.log('Error loading categories:', error);
    }
  };

  const loadDiscoveryStores = async () => {
    try {
      const responseJson = await getDiscoverStores();
      setDiscoveryStores(responseJson);
    } catch (error) {
      console.log('Error loading discovery stores:', error);
    }
  };

  const goToProfile = (userId: string) => {
    router.push({
      pathname: '/profile/view',
      params: { userId }
    });
  };

  const viewItem = (media: any) => {
    router.push({
      pathname: '/media/view',
      params: { media: JSON.stringify(media) }
    });
  };

  const searchPopularCategory = (category: any) => {
    setPopularCategory(category);
    router.push('/(tabs)/search');
  };

  const changePopularCategoryBorder = () => {
    if (popularCategoryPictureHeight === null) {
      return {};
    }
    return {
      borderRadius: popularCategoryPictureHeight / 2
    };
  };

  return (
    <View style={[styles.mainContainer]}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.popularContainer]}>
        <Text style={[globalScaledStyles.textBoldRegular, styles.popularCategoryHeaderText]}>
          Popular
        </Text>
        <ScrollView style={[styles.popularScrollContainer]} scrollEnabled={false}>
          <FlatList
            data={categories}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.popularCategoryContainer, scaledStyles.popularCategoryContainer]} 
                onPress={() => searchPopularCategory(item)}
              >
                <Image
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setPopularCategoryPictureHeight(height);
                  }}
                  style={[
                    styles.popularCategoryImage, 
                    scaledStyles.popularCategoryImage, 
                    changePopularCategoryBorder()
                  ]} 
                  source={{ uri: item.image }}
                />
                <Text style={[
                  globalScaledStyles.textBoldRegular, 
                  styles.popularCategoryText, 
                  scaledStyles.popularCategoryText
                ]}>
                  {item.category}
                </Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
      <View style={[globalStyles.screenBordersMargin, styles.discoveryContainer]}>
        <Text style={[
          globalScaledStyles.textBoldRegular, 
          styles.discoveryHeaderText, 
          scaledStyles.discoveryHeaderText
        ]}>
          Discover new stores
        </Text>
        <ScrollView style={[globalStyles.discoveryScroller]}>
          <FlatList
            data={discoveryStores}
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item }) => (
              <View style={[styles.discoverySectionContainer]}>
                <View style={[styles.discoveryUserContainer]}>
                  <TouchableOpacity 
                    style={[styles.discoveryUserTouch]} 
                    onPress={() => goToProfile(item.id)}
                  >
                    <Image 
                      style={[styles.discoveryUserImage]} 
                      source={{ uri: item.profile_picture }}
                    />
                    <Text style={[globalScaledStyles.textBoldRegular, styles.discoveryUserName]}>
                      @{item.username}
                    </Text>
                  </TouchableOpacity>
                  <View style={[scaledStyles.discoveryCategoryTextContainer]}>
                    <Text style={[globalScaledStyles.textBoldRegular, styles.discoveryCategoryText]}>
                      {item.category.category}
                    </Text>
                  </View>
                </View>
                <View style={[styles.discoveryItemContainer]}>
                  <FlatList
                    data={item.medias}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ flexGrow: 1 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        style={[styles.discoveryItemTouch]} 
                        onPress={() => viewItem(item)}
                      >
                        <Image 
                          style={[styles.discoveryItemImage]} 
                          source={{ uri: item.image }}
                        />
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </View>
            )}
          />
        </ScrollView>
      </View>
    </View>
  );
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
    marginLeft: 8,
    marginRight: 8,
    marginTop: 19
  },
  popularCategoryImage: {
    borderColor: 'rgba(128, 128, 128, 0.52)',
    borderWidth: 1
  },
  popularCategoryText: {
    alignSelf: 'center',
    color: 'rgba(106, 106, 106, 1)'
  },
  discoveryContainer: {
    flex: 1,
    flexDirection: 'column'
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