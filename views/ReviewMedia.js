import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { getProfileFromDatabaseAsync } from '../services/UserService';
import { publishMediaToStore } from '../services/MediaService'
import { getCategories } from '../services/CategoryService'
import { reloadProfile } from '../services/ProfileMediaNavigationHack';
import { commonNavigationOptions } from './CommonScreen';
import { globalStyles, globalScaledStyles } from '../styles/GlobalStyle';
import TableCell from '../components/TableCell';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';


class ReviewMediaScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
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
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('publish')}>
          <Text style={[globalScaledStyles.textLightRegular, scaledStyles.headerText]}> Publish </Text>
        </TouchableOpacity>
      ),
    }
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const selectedItems = navigation.getParam('selectedItems', []);


    if (selectedItems === undefined || selectedItems.length < 1) {
      this.resetStack();
      navigation.navigate('Profile');
    }

    this.state = {
      selectedItems: selectedItems,
      categoryModalVisible: false,
      conditionModalVisible: false,
      conditions: ["Used", "New"],
      loadingUser: true
    };
  }

  loadCategories = async () => {
    await getCategories().then((responseJson) => {
      this.setState({ isLoading: false, categories: responseJson });
    })
    .catch((error) => {
      //
    });
  };

  selectCategory = (category) => {
    this.state.selectedCategory.categories = category;
    this.setState({ selectedCategory: null, categoryModalVisible: false, selectedItems: this.state.selectedItems });
  };

  selectCondition = (condition) => {
    this.state.selectedCondition.quality = condition;
    this.setState({ selectedCondition: null, conditionModalVisible: false, selectedItems: this.state.selectedItems });
  };

  setCategoryModalVisible(visible) {
    this.setState({categoryModalVisible: visible});
  }

  setConditionModalVisible(visible) {
    this.setState({conditionModalVisible: visible});
  }

  modifyCategory(item, visible) {
    this.setState({categoryModalVisible: visible, selectedCategory: item});
  }

  modifyCondition(item, visible) {
    this.setState({conditionModalVisible: visible, selectedCondition: item});
  }

  loadProfile = async () => {
    await getProfileFromDatabaseAsync().then((responseJson) => {
      this.state.selectedItems.forEach(function(item) {
        item.categories = responseJson.category;
        item.quality = "New";
        if (item.description === null) {
          item.description = '';
        }
        item.extraOptions = [];
      });
      this.setState({ user: responseJson, selectedItems: this.state.selectedItems, loadingUser: false });
    })
    .catch((error) => {
      this.setState({ isError: true });
      this.props.navigation.navigate('Login');
    });
  }

  async componentWillMount() {
    await this.loadProfile();
  }

  async componentDidMount() {
    this.props.navigation.setParams({ publish: this.publish });
    this.loadCategories();
  }

  resetStack = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'ManageMedia' }
        ],
      })
    );
  };

  updatePrice = (item, text) => {
    item.price = text;
    this.setState({ selectedItems: this.state.selectedItems });
  };

  updateDescription = (item, text) => {
    item.description = text;
    this.setState({ selectedItems: this.state.selectedItems });
  };

  updateCategory = (item, value) => {
    item.categories.id = value;
    this.setState({ selectedItems: this.state.selectedItems });
  };

  updateTitle = (item, value) => {
    item.title = value;
    this.setState({ selectedItems: this.state.selectedItems });
  };

  updateQuantity = (item, value) => {
    item.quantity = value;
    this.setState({ selectedItems: this.state.selectedItems });
  };

  updateCondition = (item, value) => {
    item.quality = value;
    this.setState({ selectedItems: this.state.selectedItems });
  };

  publish = () => {
    let canPublish = false;
    this.state.selectedItems.every((item) => {
      if (item.title === undefined || item.title === null || item.title.length < 4) {
        alert('Title field must have 4 characters or more.');
        return;
      }
      if (item.price === undefined || item.price === null || item.price.length < 1) {
        alert('Price field must be filled.');
        return;
      }
      if (item.price < 0) {
        alert('Price must be a positve number.');
        return;
      }
      if ((item.quantity !== undefined && item.quantity !== null && item.quantity.length > 0) && item.quantity < 0) {
        alert('Quantity must be a positve number.');
        return;
      }
      canPublish = true;
    });
    if (canPublish) {
      publishMediaToStore(this.state.selectedItems).then((responseJson) => {
        reloadProfile(true);
        this.props.navigation.navigate('Profile', { hasChanged: true });
      })
      .catch((error) => {
        //Toasts
        this.props.navigation.navigate('Profile');
      });
      this.resetStack();
    }
  };

  render() {

    const keyboardSize = this.state.selectedItems.length > 2 ? 84 : 180;

    if (this.state.loadingUser) {
      return <View></View>
    }

    return (
      <View style={[styles.mainContainer]}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={ keyboardSize } >

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
                        <TableCell onPress={() => { this.selectCategory(item) }} text={ item.category } style={[ styles.categoryTable ]} icon="check" isSelected={this.state.selectedCategory.categories.id === item.id}/>
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
                    data={ this.state.conditions }
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ flexGrow: 1 }}
                    renderItem={({item}) =>
                        <TableCell onPress={() => { this.selectCondition(item) }} text={ item } style={[ styles.categoryTable ]} icon="check" isSelected={this.state.selectedCondition.quality === item}/>
                    }
                  />
                </View>
              </View>
            </View>
          </Modal>

          <FlatList
            data={ this.state.selectedItems }
            numColumns={1}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({item}) =>
              <View style={[styles.itemContainer]}>
                <View style={[globalStyles.screenBordersMargin, styles.itemSection]}>
                  <View style={[styles.itemTitleContainer]}>
                    <TextInput
                        placeholder="Title"
                        maxLength={60}
                        style={[globalStyles.defaultInput, globalStyles.textLightRegular, styles.itemTitleInput]}
                        onChangeText={(text) => this.updateTitle(item, text)}
                    />
                  </View>
                  <View style={[styles.generalDetailContainer]}>
                    <View style={[ styles.itemImageContainer ]}>
                      <Image style={[ styles.imageStyle ]} source={{ uri: item.image }}/>
                    </View>
                    <View style={[styles.itemDetailContainer]}>
                      <View style={[styles.itemCategoryContainer]}>
                        <TouchableOpacity style={[styles.categoryButton]} onPress={() => { this.modifyCategory(item, true); }}>
                          <Text style={[globalStyles.textMediumRegular, styles.categoryButtonText]}>
                            { item.categories.category }
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.itemPriceContainer]}>
                        <Text style={[globalScaledStyles.textLightRegular, styles.itemPriceLabel]}>
                          { this.state.user.currency.code }{ this.state.user.currency.symbol }
                        </Text>
                        <TextInput
                            placeholder="Price"
                            keyboardType="numeric"
                            maxLength={10}
                            style={[globalScaledStyles.textLightRegular, globalStyles.defaultInput, styles.itemPriceInput]}
                            onChangeText={(text) => this.updatePrice(item, text)}
                        />
                      </View>
                      <View style={[styles.itemQuantityContainer]}>
                        <Text style={[globalScaledStyles.textLightRegular, scaledStyles.itemQuantityLabel]}>
                          QUANTITY
                        </Text>
                        <TextInput
                            placeholder="Quantity"
                            keyboardType="number-pad"
                            maxLength={10}
                            style={[globalStyles.defaultInput, globalScaledStyles.textLightRegular, styles.itemQuantityInput]}
                            onChangeText={(text) => this.updateQuantity(item, text)}
                        />
                      </View>
                      <View style={[styles.itemConditionContainer]}>
                        <TouchableOpacity style={[styles.qualityButton]} onPress={() => { this.modifyCondition(item, true); }}>
                          <Text style={[globalScaledStyles.textMediumRegular, styles.categoryButtonText]}>
                            { item.quality }
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={[styles.itemExtraContainer]}>
                  </View>
                  <View style={[styles.itemCaptionContainer]}>
                    <TextInput
                        placeholder="Description"
                        multiline={true}
                        value={`${item.description}`}
                        style={[globalStyles.defaultInput, globalStyles.textLightRegular, styles.itemCaptionInput]}
                        onChangeText={(text) => this.updateDescription(item, text)}
                    />
                  </View>
                </View>
              </View>
            }
          />
          </KeyboardAvoidingView>
        </View>
    );
  }

}

const styles = StyleSheet.create({
  //<-- <Button title='Publish' onPress={ this.publish }/> -->
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(189, 189, 189, 0.15)',
  },
  //---- ITEMS ----
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.15)'
  },
  itemSection: {
    marginTop: 15,
  },

  //---- TITLE SECTION ----
  itemTitleContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  itemTitleInput: {
    height: 31,
    flex: 1
  },


  //---- DETAIL SECTION ----
  generalDetailContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  itemImageContainer: {
    flex: 1/2,
    flexDirection: 'row',
  },
  imageStyle: {
    flex: 1 - 0.1,
    height: 161,
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10
  },
  itemDetailContainer: {
    flex: 1/2,
    flexDirection: 'column',
  },
  itemCategoryContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  itemPriceContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  itemPriceLabel: {
    flex: 1/2,
    textAlign: 'right',
    marginRight: 10
  },
  itemPriceInput: {
    flex: 1/2,
    height: 31,
  },
  itemQuantityContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  itemQuantityLabel: {
    flex: 1/2,
    textAlign: 'right',
    marginRight: 10
  },
  itemQuantityInput: {
    flex: 1/2,
    height: 31,
  },

  //---- EXTRA SECTION ----
  itemExtraContainer: {
    flex: 1,
    flexDirection: 'row'
  },

  //---- CAPTION SECTION ----
  itemCaptionContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  itemCaptionInput: {
    flex: 1,
    marginBottom: 10,
    height: 86
  },
  headerText: {
    color: 'white',
    marginRight: 20,
    fontSize: 20
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
  categoryButton: {
    backgroundColor: 'rgba(250, 153, 23, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderRadius: 4,
    height: 26
  },
  qualityButton: {
    backgroundColor: 'rgba(22, 89, 157, 1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    borderRadius: 4,
    height: 26
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 17,
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
  itemConditionContainer: {
    flex: 1
  }

});

const scaledStyles = ScaledSheet.create({
  headerText: {
    color: 'white',
    marginRight: '10@ms',
    fontSize: '20@ms'
  },
  itemQuantityLabel: {
    flex: 1/2,
    textAlign: 'right',
    marginRight: '10@ms',
    fontSize: '15@ms'
  }
});

export default ReviewMediaScreen;
