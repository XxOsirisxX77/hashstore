import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Button,
  StatusBar,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { getProfileFromApiAsync, getProfileFromDatabaseAsync, upgradeToBusinessAccount } from '../services/UserService';
import { getStoreItemsFromDatabase, obtainMedia, getCountries, getCurrencies } from '../services/MediaService';
import { obtainInstagramToken, onInstagramSignOut } from '../services/AuthService';
import { shouldReloadProfile, reloadProfile } from '../services/ProfileMediaNavigationHack';
import { getCategories } from '../services/CategoryService'
import { globalStyles, globalScaledStyles } from '../styles/GlobalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';
import { commonNavigationOptions } from './CommonScreen';
// TODO: Replace with react-native-fbsdk-next for Facebook authentication
// import { Facebook } from 'expo';
import TableCell from '../components/TableCell';
import { ScaledSheet } from 'react-native-size-matters';

class BusinessRegisterScreen extends React.Component {
  static navigationOptions = commonNavigationOptions;

  constructor(props) {
    super(props);
    const { navigation } = this.props;
    const user = navigation.getParam('user', null);
    this.state = {
      user: user,
      categoryModalVisible: false,
      locationModalVisible: false,
      currencyModalVisible: false,
      loadingUser: true,
      isLoading: true,
      loadingCurrencies: true
    }
  }

  loadProfile = async () => {
    await getProfileFromDatabaseAsync().then(async (responseJson) => {
      let category = responseJson.category;
      let country = responseJson.country;
      let currency = responseJson.currency;
      if (category === null) {
        await getCategories().then((responseJson) => {
          const firstCategory = responseJson[0];
          if (firstCategory !== null) {
            category = firstCategory;
          }
        });
      }
      if (country === null) {
        await getCountries().then((responseJson) => {
          let international = responseJson.find(x => x.code === '??');
          if (international !== null) {
            country = international;
          }
        });
      }
      if (currency === null) {
        await getCurrencies().then((responseJson) => {
          let international = responseJson.find(x => x.code === 'USD');
          if (international !== null) {
            currency = international;
          }
        });
      }
      this.setState({ user: responseJson, selectedCategory: category, selectedLocation: country, selectedCurrency: currency, loadingUser: false });
    })
    .catch((error) => {
      this.setState({ isError: true });
      this.props.navigation.navigate('Login');
    });
  }

  loadCategories = async () => {
    await getCategories().then((responseJson) => {
      this.setState({ isLoading: false, categories: responseJson });
    })
    .catch((error) => {
      //
    });
  };

  loadCountries = async () => {
    await getCountries().then((responseJson) => {
      let international = responseJson.find(x => x.code === '??');
      if (international !== null) {
        responseJson.splice(responseJson.indexOf(international), 1);
        responseJson.splice(0, 0, international);
      }
      this.setState({ countries: responseJson, selectedLocation: international === undefined ? international : this.state.selectedLocation });
    })
    .catch((error) => {
      //
    });
  }

  loadCurrencies = async () => {
    await getCurrencies().then((responseJson) => {
      let international = responseJson.find(x => x.code === 'USD');
      if (international !== null) {
        responseJson.splice(responseJson.indexOf(international), 1);
        responseJson.splice(0, 0, international);
      }
      responseJson.forEach((currency) => {
        currency.fullText = currency.name + " - " + currency.code +  currency.symbol;
      });
      this.setState({ currencies: responseJson, selectedCurrency: this.state.selectedCurrency === undefined ? international : this.state.selectedCurrency, loadingCurrencies: false });
    })
    .catch((error) => {
      //
    });
  }

  selectCategory = (category) => {
    this.setState({ selectedCategory: category, categoryModalVisible: false });
  };

  selectLocation = (location) => {
    let currency = location.currencies;
    this.setState({ selectedLocation: location, locationModalVisible: false, selectedCurrency: currency });
  };

  selectCurrency = (currency) => {
    this.setState({ selectedCurrency: currency, currencyModalVisible: false });
  };

  modifyCategory(item, visible) {
    this.setState({ categoryModalVisible: visible, selectedCategory: item });
  }

  setCategoryModalVisible(visible) {
    this.setState({ categoryModalVisible: visible });
  }

  setLocationModalVisible(visible) {
    this.setState({ locationModalVisible: visible });
  }

  setCurrencyModalVisible(visible) {
    this.setState({ currencyModalVisible: visible });
  }

  async componentWillMount() {
    await this.loadCategories();
    await this.loadProfile();
  }

  async componentDidMount() {
    await this.loadCountries();
    await this.loadCurrencies();
  }

  createBusiness = async () => {
    // TODO: Implement Facebook authentication using react-native-fbsdk-next
    Alert.alert("Facebook Authentication", "Facebook login needs to be implemented with react-native-fbsdk-next");
    
    /* COMMENTED OUT - Needs migration to react-native-fbsdk-next
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('2050587248577640', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const data = await response.json();
        let user = {
          facebook_token: token,
          category: this.state.selectedCategory,
          country: this.state.selectedLocation,
          currency: this.state.selectedCurrency
        }
        await upgradeToBusinessAccount(user).then((responseJson) => {
          Alert.alert("Business Account", "You have successfully upgraded your account to Business Account.");
          this.setState({ user: responseJson });
        })
        .catch((error) => {
          //
        });
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
    */
  }

  render() {

    if (this.state.loadingUser || this.state.loadingCurrencies) {
      return <View></View>
    }


    return (
      <View style={[styles.mainContainer]}>
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
                <Text style={[globalScaledStyles.textBoldRegular, styles.modalHeaderText]}>
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
                <Text style={[globalScaledStyles.textBoldRegular, styles.modalHeaderText]}>
                  Shipping to
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
          visible={this.state.currencyModalVisible}
          >
          <StatusBar barStyle="dark-content" />
          <View style={[styles.categoryModal]}>
            <View style={[styles.modalMainContainer]}>
              <View style={[globalStyles.separator, styles.modalCloseContainer]}>
                <TouchableOpacity style={[styles.modalClose]}
                  onPress={() => {
                    this.setCurrencyModalVisible(!this.state.currencyModalVisible);
                  }}>
                  <Image style={[styles.closeModalImage]} source={require('../assets/images/close.png')}/>
                </TouchableOpacity>
                <Text style={[globalScaledStyles.textBoldRegular, styles.modalHeaderText]}>
                  Currency
                </Text>
              </View>
              <View style={[styles.tableView]}>
                <FlatList
                  data={ this.state.currencies }
                  numColumns={1}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={{ flexGrow: 1 }}
                  renderItem={({item}) =>
                      <TableCell onPress={() => { this.selectCurrency(item) }} text={ item.fullText } style={[ styles.categoryTable ]} icon="check" isSelected={this.state.selectedCurrency.id === item.id}/>
                  }
                />
              </View>
            </View>
          </View>
        </Modal>

        <View style={scaledStyles.formContainer}>
          <View style={styles.userFormContainer}>
            <Text style={[globalScaledStyles.textLightRegular]}>
              USERNAME
            </Text>
            <TextInput
                style={[globalScaledStyles.textLightRegular, globalStyles.defaultInput, styles.userInput]}
                value={this.state.user.username}
                editable={false}
            />
          </View>
          <View style={[scaledStyles.categoryFormContainer]}>
            <Text style={[globalScaledStyles.textLightRegular]}>
              DEFAULT CATEGORY
            </Text>
            <Text style={[globalScaledStyles.textThinRegular, styles.hintText]}>
              The default category is the category of the items that your store mostly sale.
            </Text>
            <TouchableOpacity style={[globalStyles.defaultPicker, styles.categoryButton]} onPress={() => { this.modifyCategory(this.state.selectedCategory, true); }}>
              <Text style={[globalScaledStyles.textMediumRegular, styles.categoryButtonText]}>
                { this.state.selectedCategory.category }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[scaledStyles.shippingFormContainer]}>
            <Text style={[globalScaledStyles.textLightRegular]}>
              SHIPPING TO
            </Text>
            <TouchableOpacity style={[globalStyles.defaultPicker, styles.shippingButton]} onPress={() => { this.setLocationModalVisible(true) }}>
              <Text style={[globalScaledStyles.textMediumRegular, styles.categoryButtonText]}>
                { this.state.selectedLocation.country }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[scaledStyles.currencyFormContainer]}>
            <Text style={[globalScaledStyles.textLightRegular]}>
              CURRENCY
            </Text>
            <TouchableOpacity style={[globalStyles.defaultPicker, styles.currencyButton]} onPress={() => { this.setCurrencyModalVisible(true) }}>
              <Text style={[globalScaledStyles.textMediumRegular, styles.categoryButtonText]}>
                { this.state.selectedCurrency.code }{ this.state.selectedCurrency.symbol }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.createBusinessContainer, scaledStyles.createBusinessContainer]}>
            <TouchableOpacity style={[globalStyles.defaultButton, styles.createBusinessTouch]} onPress={() => { this.createBusiness() }}>
              <Text style={[globalScaledStyles.textBoldRegular, styles.createBusinessButton]}>
                { this.state.user.is_business ? 'UPDATE BUSINESS' : 'CREATE BUSINESS' }
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(189, 189, 189, 0.15)'
  },
  formContainer: {
    flex: 1,
    marginLeft: 32,
    marginRight: 32,
    marginTop: 40
  },

  userFormContainer: {
    flex: 0.8,
  },
  userInput: {
    marginTop: 6
  },

  categoryFormContainer: {
    flex: 1,
    marginTop: 20,
  },
  categoryButton: {
    width: 140,
    marginTop: 15
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 17,
  },
  hintText: {
    color: 'rgba(115, 115, 115, 1)'
  },

  shippingFormContainer: {
    flex: 1,
    marginTop: 50,
  },
  shippingButton: {
    marginTop: 15
  },

  currencyFormContainer: {
    flex: 1,
    marginTop: 20,
  },
  currencyButton: {
    width: 140,
    marginTop: 15
  },

  createBusinessContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center'
  },
  createBusinessTouch: {
    justifyContent: 'center',
    height: 46
  },
  createBusinessButton: {
    color: 'white',
    fontSize: 17
  },

  categoryModal: {
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
  categoryTable: {
    flex: 1,
    flexDirection: 'row'
  },

});

const scaledStyles = ScaledSheet.create({
  formContainer: {
    flex: 1,
    marginLeft: '32@ms',
    marginRight: '32@ms',
    marginTop: '20@ms'
  },
  categoryFormContainer: {
    flex: 1,
    marginTop: '10@ms',
  },
  shippingFormContainer: {
    flex: 1,
    marginTop: '50@ms',
  },
  currencyFormContainer: {
    flex: 1,
    marginTop: '10@ms',
  },
  createBusinessContainer: {
    marginBottom: '50@vs'
  },
});

export default BusinessRegisterScreen;
