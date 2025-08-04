import React from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  StatusBar,
  Modal
} from 'react-native';
import { searchMedia, obtainMedia, getCountries } from '../services/MediaService';
import { getCategories } from '../services/CategoryService'
import { globalStyles, globalScaledStyles } from '../styles/GlobalStyle';
import { commonNavigationOptions } from './CommonScreen';
import { translate } from '../config/i18n';
import { capitalizeWords } from '../services/UtilService';
import { setPopularCategory, obtainPopularCategory } from '../services/HomeSearchNavigationHack';
import TableCell from '../components/TableCell';
import InfiniteListView from 'rn-infinite-scroll';
import { ScaledSheet } from 'react-native-size-matters';

class SearchScreen extends React.Component {

  static navigationOptions = commonNavigationOptions;

  constructor(props) {
    super(props);

    this.state = {
      searchCriteria: '',
      searchResult: [],
      modalVisible: false,
      categoryModalVisible: false,
      priceModalVisible: false,
      locationModalVisible: false,
      conditionModalVisible: false,
      selectedCategory: { id: 0, category: 'All' },
      selectedPrice: { id: 0, text: 'Any' },
      selectedLocation: { id: 0, country: 'International', code: '??' },
      selectedCondition: { id: 0, text: 'Any' },
      filterOptions: null,
      isScrollLoading: true
    };
  }

  willFocusSubscription = this.props.navigation.addListener(
    'willFocus',
    async() => {
      const popularCategory = obtainPopularCategory()
      if (popularCategory !== null) {
        const searchResult = await searchMedia("", popularCategory.id, this.state.filterOptions);
        this.selectedCategory = popularCategory;
        this.setState({ searchResult: searchResult, selectedCategory: this.selectedCategory });
        setPopularCategory(null);
      }
    }
  );

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setCategoryModalVisible(visible) {
    this.setState({categoryModalVisible: visible});
  }

  setPriceModalVisible(visible) {
    this.setState({modalVisible: !visible, priceModalVisible: visible});
  }

  setLocationModalVisible(visible) {
    this.setState({modalVisible: !visible, locationModalVisible: visible});
  }

  setConditionModalVisible(visible) {
    this.setState({modalVisible: !visible, conditionModalVisible: visible});
  }

  search = async () => {
    const searchResult = await searchMedia(this.state.searchCriteria, this.state.selectedCategory.id, this.state.filterOptions);
    this.setState({ searchResult: searchResult, isScrollLoading: false });
  }

  updateSearch = (text) => {
    this.setState({ searchCriteria: text });
  };

  seeDetail = async (item) => {
    const media = await obtainMedia(item.id);
    if (media !== null) {
      this.props.navigation.navigate('ViewMediaDetail', { media: media });
    }
  }

  loadCategories = async () => {
    await getCategories().then((responseJson) => {
      const allCategory = {
        category: 'All',
        id: 0,
        image: '',
      }
      responseJson.splice(0, 0, allCategory);
      this.setState({ isLoading: false, categories: responseJson });
    })
    .catch((error) => {
      //
    });
  };

  loadCountries = async () => {
    await getCountries().then((responseJson) => {
      const international = {
        country: 'International',
        id: 0,
        code: '??',
      }
      responseJson.splice(0, 0, international);
      this.setState({ isLoading: false, countries: responseJson });
    })
    .catch((error) => {
      //
    });
  }

  loadPrices = async () => {
    const priceOptions = [
      {
        text: 'Any',
        id: 0
      },
      {
        text: 'Lowest First',
        id: 1
      },
      {
        text: 'Highest First',
        id: 2
      }
    ]
    this.setState({ isLoading: false, priceOptions: priceOptions });
  };

  loadConditions = async () => {
    const conditionOptions = [
      {
        text: 'Any',
        id: 0
      },
      {
        text: 'Used',
        id: 1
      },
      {
        text: 'New',
        id: 2
      }
    ]
    this.setState({ isLoading: false, conditionOptions: conditionOptions });
  };

  selectCategory = (category) => {
      this.setState({ selectedCategory: category, categoryModalVisible: false });
  };

  selectPrice = (price) => {
      this.setState({ modalVisible: true, selectedPrice: price, priceModalVisible: false });
  };

  selectLocation = (location) => {
      this.setState({ modalVisible: true, selectedLocation: location, locationModalVisible: false });
  };

  selectCondition = (condition) => {
      this.setState({ modalVisible: true, selectedCondition: condition, conditionModalVisible: false });
  };

  applyFilter = async () => {
    const filter = {
      price: this.state.selectedPrice.id,
      location: this.state.selectedLocation.id,
      condition: this.state.selectedCondition.id
    };
    const searchResult = await searchMedia(this.state.searchCriteria, this.state.selectedCategory.id, filter);
    this.setState({ modalVisible: false, filterOptions: filter, searchResult: searchResult, isScrollLoading: false });
  }

  componentDidMount() {
    this.loadCategories();
    this.loadPrices();
    this.loadConditions();
    this.loadCountries();
  }

  canLoad = () => {
    return !this.state.isScrollLoading;
  };

  onLoad = async () => {
    this.setState({isScrollLoading : true});
    setTimeout(async () => {
      //TODO - APPLY PAGINATED FILTER ON SQL

      // const searchResult = await searchMedia(this.state.searchCriteria, this.state.selectedCategory.id, this.state.filterOptions);
      // this.setState({
      //   isScrollLoading: false,
      //   searchResult: [...this.state.searchResult, ...searchResult]
      // });
      this.setState({isScrollLoading : false});
    }, 2000);
  };

  renderRow = (item) => {
    return (
        <TouchableOpacity onPress={() => this.seeDetail(item) } style={[styles.touchItemContainer]}>
          <View style={[scaledStyles.itemContainer]}>
            <Image style={[ styles.itemImage ]} source={{ uri: item.thumbnail }}/>
            <View style={[ styles.detailContainer]}>
              <Text style={[globalStyles.textLightRegular]}>
                @{ item.users.username }
              </Text>
              <View style={[styles.itemDescriptionContainer]}>
                <Text style={[globalStyles.textBoldRegular]} numberOfLines={2} ellipsizeMode="tail">
                  { item.title }
                </Text>
              </View>
              <Text style={[globalStyles.textBoldRegular]}>
                { item.users.currency.code }{ item.users.currency.symbol } { item.price }
              </Text>
              <Text style={[globalStyles.textLightRegular]}>

              </Text>
            </View>
          </View>
        </TouchableOpacity>
    );
  };

  render() {

    return(
      <View style={[styles.screenContainer]}>
        <StatusBar barStyle="light-content" />

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.categoryModalVisible}
          >
          <StatusBar barStyle="dark-content" />
          <View style={[styles.categoryModal]}>
            <View style={[styles.modalMainContainer]}>
              <View style={[globalStyles.separator, styles.modalCloseContainer]}>
                <TouchableOpacity style={[styles.modalClose]}
                  onPress={() => {
                    this.setCategoryModalVisible(!this.state.categoryModalVisible);
                  }}>
                  <Image style={[styles.closeModalImage]} source={require('../assets/images/close.png')}/>
                </TouchableOpacity>
                <Text style={[globalStyles.textBoldRegular, styles.modalHeaderText]}>
                  Category
                </Text>
              </View>
              <View style={[styles.tableView]}>
                <FlatList
                  data={ this.state.categories }
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ flexGrow: 1 }}
                  renderItem={({item}) =>
                      <TableCell onPress={() => { this.selectCategory(item) }} text={ item.category } style={[ styles.categoryTable ]} icon="check" isSelected={this.state.selectedCategory.id === item.id}/>
                  }
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          >
          <StatusBar barStyle="dark-content" />
          <View style={[styles.filterModal]}>
            <View style={[styles.modalMainContainer]}>
              <View style={[globalStyles.separator, styles.modalCloseContainer]}>
                <TouchableOpacity style={[styles.modalClose]}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}>
                  <Image style={[styles.closeModalImage]} source={require('../assets/images/close.png')}/>
                </TouchableOpacity>
                <Text style={[globalStyles.textBoldRegular, styles.modalHeaderText]}>
                  Filter
                </Text>
              </View>
              <View style={[styles.tableView]}>
                <TableCell onPress={() => { this.setPriceModalVisible(true) }} text="Price" isNavigation={false} value={ this.state.selectedPrice.text }/>
                <TableCell onPress={() => { this.setLocationModalVisible(true) }} text="Location" isNavigation={false} value={ this.state.selectedLocation.country }/>
                <TableCell onPress={() => { this.setConditionModalVisible(true) }} text="Condition" isNavigation={false} value={ this.state.selectedCondition.text }/>
              </View>
              <View style={[scaledStyles.applyFilterContainer]}>
                <TouchableOpacity style={[globalStyles.defaultButton, styles.applyFilterTouch]} onPress={() => { this.applyFilter(); }}>
                  <Text style={[globalStyles.textBoldRegular, styles.applyFilterButton]}>
                    APPLY FILTER
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.priceModalVisible}
          >
          <StatusBar barStyle="dark-content" />
          <View style={[styles.categoryModal]}>
            <View style={[styles.modalMainContainer]}>
              <View style={[globalStyles.separator, styles.modalCloseContainer]}>
                <TouchableOpacity style={[styles.modalClose]}
                  onPress={() => {
                    this.setPriceModalVisible(!this.state.priceModalVisible);
                  }}>
                  <Image style={[styles.closeModalImage]} source={require('../assets/images/close.png')}/>
                </TouchableOpacity>
                <Text style={[globalStyles.textBoldRegular, styles.modalHeaderText]}>
                  Price
                </Text>
              </View>
              <View style={[styles.tableView]}>
                <FlatList
                  data={ this.state.priceOptions }
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ flexGrow: 1 }}
                  renderItem={({item}) =>
                      <TableCell onPress={() => { this.selectPrice(item) }} text={ item.text } style={[ styles.categoryTable ]} icon="check" isSelected={this.state.selectedPrice.id === item.id}/>
                  }
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.locationModalVisible}
          >
          <StatusBar barStyle="dark-content" />
          <View style={[styles.categoryModal]}>
            <View style={[styles.modalMainContainer]}>
              <View style={[globalStyles.separator, styles.modalCloseContainer]}>
                <TouchableOpacity style={[styles.modalClose]}
                  onPress={() => {
                    this.setLocationModalVisible(!this.state.locationModalVisible);
                  }}>
                  <Image style={[styles.closeModalImage]} source={require('../assets/images/close.png')}/>
                </TouchableOpacity>
                <Text style={[globalStyles.textBoldRegular, styles.modalHeaderText]}>
                  Location
                </Text>
              </View>
              <View style={[styles.tableView]}>
                <FlatList
                  data={ this.state.countries }
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ flexGrow: 1 }}
                  renderItem={({item}) =>
                      <TableCell onPress={() => { this.selectLocation(item) }} text={ item.country } style={[ styles.categoryTable ]} icon="check" isSelected={this.state.selectedLocation.id === item.id}/>
                  }
                />
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.conditionModalVisible}
          >
          <StatusBar barStyle="dark-content" />
          <View style={[styles.categoryModal]}>
            <View style={[styles.modalMainContainer]}>
              <View style={[globalStyles.separator, styles.modalCloseContainer]}>
                <TouchableOpacity style={[styles.modalClose]}
                  onPress={() => {
                    this.setConditionModalVisible(!this.state.conditionModalVisible);
                  }}>
                  <Image style={[styles.closeModalImage]} source={require('../assets/images/close.png')}/>
                </TouchableOpacity>
                <Text style={[globalStyles.textBoldRegular, styles.modalHeaderText]}>
                  Condition
                </Text>
              </View>
              <View style={[styles.tableView]}>
                <FlatList
                  data={ this.state.conditionOptions }
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ flexGrow: 1 }}
                  renderItem={({item}) =>
                      <TableCell onPress={() => { this.selectCondition(item) }} text={ item.text } style={[ styles.categoryTable ]} icon="check" isSelected={this.state.selectedCondition.id === item.id}/>
                  }
                />
              </View>
            </View>
          </View>
        </Modal>

        <View style={[styles.mainContainer]}>
          <View style={[styles.searchContainer]}>
            <View style={[styles.searchInputContainer]}>
              <View style={[styles.searchSection]}>
                <Image style={[styles.searchImage]} source={ require('../assets/images/search-icon.png')}/>
                <TextInput
                    style={[globalStyles.textLightRegular, styles.searchInput]}
                    placeholder={translate.t('search')}
                    onChangeText={(text) => this.updateSearch(text) }
                    returnKeyType='search'
                    onSubmitEditing={ this.search }
                />
              </View>
              <View style={[styles.categoryContainer]}>
                <Text style={[globalStyles.textMediumRegular, styles.categoryText]}>
                  {capitalizeWords(translate.t('category'))}
                </Text>
                <TouchableOpacity style={[scaledStyles.categoryButton]} onPress={() => { this.setCategoryModalVisible(true) }}>
                  <Text style={[globalScaledStyles.textMediumRegular, scaledStyles.categoryButtonText]}>
                    { this.state.selectedCategory.category }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.settingsButtonContainer]}>
              <TouchableOpacity onPress={ () => { this.setModalVisible(true) }}>
                <Image style={[scaledStyles.filterImage]} source={require('../assets/images/filter.png')}/>
              </TouchableOpacity>
            </View>
          </View>
          { this.state.searchResult.length > 0 &&
            <InfiniteListView
              data={ this.state.searchResult }
              canLoad={this.canLoad()}
              isLoading={this.state.isScrollLoading}
              onLoad={this.onLoad}
              onEndReachedThreshold={10}
              renderRow={ this.renderRow }
            />
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1
  },
  mainContainer: {
    flex: 1
  },
  categoryModal: {
    flex: 1,
    backgroundColor: 'rgba(189, 189, 189, 0.15)'
  },
  categorySelect: {
    flex: 1,
    flexDirection: 'row'
  },
  categoryTable: {
    flex: 1,
    flexDirection: 'row'
  },
  filterModal: {
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
  cellBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 200
  },
  applyFilterContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    marginBottom: 220
  },
  applyFilterTouch: {
    justifyContent: 'center',
    height: 46
  },
  applyFilterButton: {
    color: 'white',
    fontSize: 17
  },

  //-------- Search -----------

  searchContainer: {
    height: 74,
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(200, 200, 200, 0.30)'
  },
  searchInputContainer: {
    flex: 1 - 0.22,
    flexDirection: 'column',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: 15,
    marginTop: 5,
    borderWidth: 0,
    borderRadius: 10,
    height: 32,
  },
  searchImage: {
    width: 17,
    height: 19,
    marginLeft: 10,
    marginRight: 15,
    resizeMode: 'contain'
  },
  searchInput: {
    height: 29,
    // width: 274,
    flex: 1,
    borderRadius: 10,
    borderWidth: 0,
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.6 )'
  },
  categoryContainer: {
    marginLeft: 45,
    marginTop: 10,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  categoryText: {
    alignSelf: 'flex-start',
  },
  categoryButton: {
    backgroundColor: 'rgba(250, 153, 23, 0.8)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 25,
    borderRadius: 4,
    height: 26
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 17,
  },
  settingsButtonContainer: {
    flex: 1 - 0.8,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  filterImage: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(215, 215, 215, 1)',
    borderRadius: 9,
    marginTop: 10,
    marginRight: 10
  },

  //-------- Items -----------

  touchItemContainer: {
    flex: 1
  },
  itemContainer: {
    height: 168,
    borderColor: 'rgba(128, 128, 128, 0.15)',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row'
  },
  itemImage: {
    flex: 0.4,
    margin: 2
  },
  detailContainer: {
    flex: 2/3,
    marginLeft: 10
  },
  itemDescriptionContainer: {
    flex: 1,
    height: 52
  }
});

const scaledStyles = ScaledSheet.create({
  itemContainer: {
    height: '168@ms',
    borderColor: 'rgba(128, 128, 128, 0.15)',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row'
  },
  applyFilterContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    marginBottom: '150@vs'
  },
  filterImage: {
    width: '52@ms',
    height: '52@ms',
    backgroundColor: 'rgba(215, 215, 215, 1)',
    borderRadius: 9,
    marginTop: '10@ms',
    marginRight: '3@ms'
  },
  categoryButton: {
    backgroundColor: 'rgba(250, 153, 23, 0.8)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10@ms',
    marginLeft: '25@ms',
    marginRight: '0@ms',
    borderRadius: '4@ms',
    height: '26@ms'
  },
  categoryButtonText: {
    color: 'white',
    fontSize: '17@ms',
  }
});

export default SearchScreen;
