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
  ScrollView
} from 'react-native';
import { obtainInstagramToken } from '../services/AuthService';
import { CommonActions } from '@react-navigation/native';
import { Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Picker, Item } from 'native-base';
import { publishMediaToStore } from '../services/MediaService'
import { reloadProfile } from '../services/ProfileMediaNavigationHack';
import { commonNavigationOptions } from './CommonScreen';
import { globalStyles } from '../styles/GlobalStyle';


class ReviewMediaScreen extends React.Component {
  static navigationOptions = commonNavigationOptions;

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    const selectedItems = navigation.getParam('selectedItems', []);


    if (selectedItems === undefined || selectedItems.length < 1) {
      this.resetStack();
      navigation.navigate('Profile');
    }

    const categoryExtra = [
      'XXS',
      'XS',
      'S',
      'M',
      'L',
      'XL',
      'XXL',
      '3XL',
      '4XL',
      '5XL',
      '6XL'
    ];

    selectedItems.forEach(function(item) {
      item.category = "Others";
      if (item.description === null) {
        item.description = '';
      }
      item.extraOptions = categoryExtra;
    });


    this.state = {
      selectedItems: selectedItems,
      isClicked: false
    };
  }

  resetStack = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'ManageMedia' }
        ],
      })
    )
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
    item.category = value;
    item.pickerTextOpacity = 1;
    item.pickerOpacity = 0;
    this.setState({ selectedItems: this.state.selectedItems });
  };

  publish = () => {
    publishMediaToStore(this.state.selectedItems).then((responseJson) => {
      reloadProfile(true);
      this.props.navigation.navigate('Profile', { hasChanged: true });
    })
    .catch((error) => {
      //Toasts
      this.props.navigation.navigate('Profile');
      console.error(error);
    });
    this.resetStack();
  };

  showPicker = (item) => {
    item.pickerTextOpacity = 0;
    item.pickerOpacity = 1;
    this.setState({ selectedItems: this.state.selectedItems });
  };

  selectExtraOption = (extra) => {
    this.setState({ isClicked: !this.state.isClicked });
  };

  render() {

    const categoryList = [
      'Shoes',
      'Clothes',
      'Others',
      'Cancel'
    ];

    const keyboardSize = this.state.selectedItems.length > 2 ? 84 : 180;

    return (

      <View style={[styles.mainContainer]}>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={ keyboardSize } >
          <FlatList
            data={ this.state.selectedItems }
            numColumns={1}
            extraData={this.state}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({item}) =>
              <View style={[styles.itemContainer]}>
                <View style={[styles.itemSection, globalStyles.screenBordersMargin]}>
                  <View style={[styles.itemTitleContainer]}>
                    <TextInput
                        placeholder="Title"
                        keyboardType="numeric"
                        maxLength={10}
                        style={[styles.itemTitleInput, globalStyles.defaultInput, globalStyles.textLightRegular]}
                        onChangeText={(text) => this.updatePrice(item, text)}
                    />
                  </View>
                  <View style={[styles.generalDetailContainer]}>
                    <View style={[ styles.itemImageContainer ]}>
                      <Image style={[ styles.imageStyle ]} source={{ uri: item.image }}/>
                    </View>
                    <View style={[styles.itemDetailContainer]}>
                      <View style={[styles.itemCategoryContainer]}>
                        <Picker
                          iosHeader="Category"
                          mode="dropdown"
                          selectedValue={item.category}
                          itemTextStyle={[globalStyles.textLightRegular]}
                          textStyle={[styles.categoryPicker, globalStyles.textMediumRegular]}
                          onValueChange={(value) => this.updateCategory(item, value)}>
                            <Item label="Shoes" value="Shoes" />
                            <Item label="Clothes" value="Clothes" />
                            <Item label="Health" value="Health" />
                            <Item label="Others" value="Others" />
                        </Picker>
                      </View>
                      <View style={[styles.itemPriceContainer]}>
                        <Text style={[styles.itemPriceLabel, globalStyles.textLightRegular]}>
                          USD$
                        </Text>
                        <TextInput
                            placeholder="Price"
                            keyboardType="numeric"
                            maxLength={10}
                            style={[styles.itemPriceInput, globalStyles.defaultInput, globalStyles.textLightRegular]}
                            onChangeText={(text) => this.updatePrice(item, text)}
                        />
                      </View>

                    </View>
                  </View>
                  <View style={[styles.itemExtraContainer]}>
                    <FlatList
                      data={ item.extraOptions }
                      numColumns={7}
                      style={[styles.extraCategoryList]}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={{ flexGrow: 1 }}
                      renderItem={({item}) =>
                        <TouchableOpacity
                        style={[styles.extraButton, this.state.isClicked ? styles.extraButtonSelected : null]}
                        onPress={ () => this.selectExtraOption(item) }>
                          <Text style={[styles.extraText, globalStyles.textLightRegular]}>
                            { item }
                          </Text>
                        </TouchableOpacity>
                      }
                    />
                  </View>
                  <View style={[styles.itemCaptionContainer]}>
                    <TextInput
                        placeholder="Description"
                        multiline={true}
                        value={`${item.description}`}
                        style={[styles.itemCaptionInput, globalStyles.defaultInput, globalStyles.textLightRegular]}
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
  // <View style={[styles.itemQuantityContainer]}>
  //   <Text style={[styles.itemQuantityLabel, globalStyles.textLightRegular]}>
  //     QUANTITY
  //   </Text>
  //   <TextInput
  //       placeholder="Quantity"
  //       keyboardType="numeric"
  //       maxLength={10}
  //       style={[styles.itemQuantityInput, globalStyles.defaultInput, globalStyles.textLightRegular]}
  //       onChangeText={(text) => this.updatePrice(item, text)}
  //   />
  // </View>
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
    flex: 1/2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
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
    flexDirection: 'row',
    marginBottom: 10
  },
  extraButton: {
    flex: 1/7,
    maxWidth: 48,
    borderRadius: 4,
    height: 40,
    backgroundColor: 'rgba(174, 174, 174, 1)',
    marginBottom: 5,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraButtonSelected: {
    backgroundColor: 'rgba(151, 15, 2, 1)'
  },
  extraCategoryList: {
    flex: 1
  },
  extraText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
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


});

export default ReviewMediaScreen;
