import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Button,
  ImageBackground,
  StatusBar
} from 'react-native';
import { getStoreItemsFromInstagram } from '../services/MediaService';
import { commonNavigationOptions } from './CommonScreen';
import { globalStyles, globalScaledStyles } from '../styles/GlobalStyle';
import { moderateScale } from 'react-native-size-matters';

class ManageMediaScreen extends React.Component {
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
        <TouchableOpacity onPress={navigation.getParam('next')}>
          <Text style={[globalScaledStyles.textLightRegular, navigation.getParam('selectedItems') > 0 ? styles.headerText : styles.headerTextDisabled]}> Next </Text>
        </TouchableOpacity>
      ),
    }
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;

    this.state = {
      isLoadingItems: true,
      selectedItems: []
    };
  }

  loadScreen = () => {
    getStoreItemsFromInstagram().then((responseJson) => {
      responseJson.forEach(function(item) {
        item.isSelected = false;
      });
      this.setState({ isLoadingItems: false, instagramItems: responseJson });
    })
    .catch((error) => {
      this.setState({ isLoadingItems: false, isErrorItems: true });
      console.error(error);
      //Check if Token expired / revoked - Send back to Login Screen
    });

  };

  selectImage = (item) => {
    if (this.state.selectedItems.indexOf(item) < 0) {
      item.isSelected = true;
      this.state.selectedItems.push(item);
    } else {
      item.isSelected = false;
      this.state.selectedItems.splice(this.state.selectedItems.indexOf(item), 1);
    }
    this.props.navigation.setParams({ selectedItems: this.state.selectedItems.length});
    this.setState({selectedItems: this.state.selectedItems});
  };

  nextStep = () => {
    if (this.state.selectedItems.length < 1) {
      return;
    }
    this.props.navigation.navigate('ReviewMedia', {selectedItems: this.state.selectedItems });
  };

  componentWillMount() {
    this.props.navigation.setParams({ next: this.nextStep });
    this.props.navigation.setParams({ selectedItems: this.state.selectedItems.length || 0 });
  }

  componentDidMount() {

    this.loadScreen();
  }

  render() {

    if (this.state.isLoadingItems) {
      return null;
    }

    return (
      <View style={[styles.mainContainer]}>
        <StatusBar barStyle="light-content" />
        <FlatList
          data={ this.state.instagramItems }
          numColumns={3}
          extraData={ this.state }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>
            <TouchableOpacity style={[styles.itemContainer]} onPress={() => this.selectImage(item) }>
              <Image style={[ styles.item ]} source={{ uri: item.thumbnail }}/>
              <ImageBackground
                source={require('../assets/images/checked.png')}
                style={[item.isSelected ? styles.itemSelected : styles.itemNotSelected]}/>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  headerText: {
    fontSize: 32,
    textTransform: 'uppercase'
  },
  itemContainer: {
    flex: 1/3
  },
  item: {
    height: 135,
    margin: 1
  },
  itemSelected: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    opacity: 0.8,
    backgroundColor: '#000000',
  },
  itemNotSelected: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    opacity: 0,
  },
  headerText: {
    color: 'white',
    marginRight: 20,
    fontSize: 20
  },
  headerTextDisabled: {
    color: 'rgba(0, 0, 0, 0.6)',
    marginRight: 20,
    fontSize: 20
  }
});

export default ManageMediaScreen;
