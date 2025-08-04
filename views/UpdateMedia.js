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
import { obtainInstagramToken } from '../services/AuthService';
import { CommonActions } from '@react-navigation/native';
import { Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { publishMediaToStore, updateMedia } from '../services/MediaService'
import { getCategories } from '../services/CategoryService'
import { reloadProfile } from '../services/ProfileMediaNavigationHack';
import { commonNavigationOptions } from './CommonScreen';
import { globalStyles } from '../styles/GlobalStyle';
import TableCell from '../components/TableCell';


class UpdateMediaScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'rgba(189, 37, 60, 0.90)'
      },
      headerTitle: (
        <Image
          resizeMode="contain"
          style={{width: 160,
            height: 60,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
          source={require('../assets/images/hashstore-name.png')}
        />
      ),
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('update')}>
          <Text style={[globalStyles.textLightRegular, styles.headerText]}> Update </Text>
        </TouchableOpacity>
      ),
    }
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const media = navigation.getParam('media', null);


    if (media === null) {
      this.resetStack();
      navigation.navigate('Profile');
    }

    this.state = {
      media: media,
      categoryModalVisible: false,
      conditionModalVisible: false,
      conditions: ["Used", "New"]
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

  componentDidMount() {
    this.props.navigation.setParams({ update: this.update });
    this.loadCategories();
  }

  resetStack = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Profile' }
        ],
      })
    )
  };

  updatePrice = (media, text) => {
    media.price = text;
    this.setState({ media: this.state.media });
  };

  updateQuantity = (media, text) => {
    media.quantity = text;
    this.setState({ media: this.state.media });
  };

  updateCategory = (media, value) => {
    media.categories.id = value;
    media.pickerTextOpacity = 1;
    media.pickerOpacity = 0;
    this.setState({ media: this.state.media });
  };

  updateTitle = (media, value) => {
    media.title = value;
    this.setState({ media: this.state.media });
  };

  updateDescription = (media, value) => {
    media.description = value;
    this.setState({ media: this.state.media });
  };

  updateCondition = (item, value) => {
    item.quality = value;
    this.setState({ selectedItems: this.state.selectedItems });
  };

  update = async () => {
    if (this.state.media.title === undefined || this.state.media.title === null || this.state.media.title.length < 4) {
      alert('Title field must have 4 characters or more.');
      return;
    }
    if (this.state.media.price === undefined || this.state.media.price  === null || this.state.media.price.length < 1) {
      alert('Price field must be filled.');
      return;
    }
    if (this.state.media.price < 0) {
      alert('Price must be a positve number.');
      return;
    }
    if ((this.state.media.quantity !== undefined && this.state.media.quantity !== null && this.state.media.quantity.length > 0) && this.state.media.quantity < 0) {
      alert('Quantity must be a positve number.');
      return;
    }
    updateMedia(this.state.media);
    this.props.navigation.navigate('Profile');
  };

  render() {
    console.disableYellowBox = true;

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

          <View style={[styles.itemContainer]}>
            <View style={[globalStyles.screenBordersMargin, styles.itemSection]}>
              <View style={[styles.itemTitleContainer]}>
                <TextInput
                    placeholder="Title"
                    maxLength={60}
                    value={`${this.state.media.title}`}
                    style={[globalStyles.defaultInput, globalStyles.textLightRegular, styles.itemTitleInput]}
                    onChangeText={(text) => this.updateTitle(this.state.media, text)}
                />
              </View>
              <View style={[styles.generalDetailContainer]}>
                <View style={[ styles.itemImageContainer ]}>
                  <Image style={[ styles.imageStyle ]} source={{ uri: this.state.media.thumbnail }}/>
                </View>
                <View style={[styles.itemDetailContainer]}>
                  <View style={[styles.itemCategoryContainer]}>
                    <TouchableOpacity style={[styles.categoryButton]} onPress={() => { this.modifyCategory(this.state.media, true); }}>
                      <Text style={[globalStyles.textMediumRegular, styles.categoryButtonText]}>
                        { this.state.media.categories.category }
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.itemPriceContainer]}>
                    <Text style={[globalStyles.textLightRegular, styles.itemPriceLabel]}>
                      { this.state.media.users.currency.code }{ this.state.media.users.currency.symbol }
                    </Text>
                    <TextInput
                        placeholder="Price"
                        keyboardType="numeric"
                        maxLength={10}
                        value={`${this.state.media.price}`}
                        style={[globalStyles.defaultInput, globalStyles.textLightRegular, styles.itemPriceInput]}
                        onChangeText={(text) => this.updatePrice(this.state.media, text)}
                    />
                  </View>
                  <View style={[styles.itemQuantityContainer]}>
                    <Text style={[globalStyles.textLightRegular, styles.itemQuantityLabel]}>
                      QUANTITY
                    </Text>
                    <TextInput
                        placeholder="Quantity"
                        keyboardType="number-pad"
                        maxLength={10}
                        value={`${this.state.media.quantity === null ? '' : this.state.media.quantity}`}
                        style={[globalStyles.defaultInput, globalStyles.textLightRegular, styles.itemQuantityInput]}
                        onChangeText={(text) => this.updateQuantity(this.state.media, text)}
                    />
                  </View>
                  <View style={[styles.itemConditionContainer]}>
                    <TouchableOpacity style={[styles.qualityButton]} onPress={() => { this.modifyCondition(this.state.media, true); }}>
                      <Text style={[globalStyles.textMediumRegular, styles.categoryButtonText]}>
                        { this.state.media.quality }
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
                    value={`${this.state.media.description}`}
                    style={[styles.itemCaptionInput, globalStyles.defaultInput, globalStyles.textLightRegular]}
                    onChangeText={(text) => this.updateDescription(this.state.media, text)}
                />
              </View>
            </View>
          </View>
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
  keyboardContainer: {
    flex: 1
  },
  //---- ITEMS ----
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.15)'
  },
  itemSection: {
    flex: 1,
    marginTop: 15,
    flexDirection: 'column'
  },

  //---- TITLE SECTION ----
  itemTitleContainer: {
    height: 40,
  },
  itemTitleInput: {
    height: 31,
    flex: 1
  },


  //---- DETAIL SECTION ----
  generalDetailContainer: {
    flex: 1/3,
    flexDirection: 'row',
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
    marginTop: 10
  },
  itemCategoryContainer: {
    flex: 1/2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: 10
  },
  categoryPicker: {
    backgroundColor: 'rgba(250, 153, 23, 0.8)',
    flex: 1 - 0.3,
    borderRadius: 4,
    height: 26,
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
  },
  qualityPicker: {
    backgroundColor: 'rgba(22, 89, 157, 1)',
    flex: 0.83,
    borderRadius: 4,
    height: 26,
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    marginLeft: 25
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
    //flex: 1,
    //flexDirection: 'row'
  },

  //---- CAPTION SECTION ----
  itemCaptionContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20
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
  headerText: {
    color: 'white',
    marginRight: 20,
    fontSize: 20
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

export default UpdateMediaScreen;
