import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View
} from 'react-native';
import { PropTypes } from 'prop-types';
import { globalStyles, globalScaledStyles } from '../styles/GlobalStyle';
import Icon from 'react-native-vector-icons/FontAwesome';


class TableCell extends React.Component {

  static propTypes = {
    cellStyle: PropTypes.style,
    onPress: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    value: PropTypes.string,
    isNavigation: PropTypes.bool,
    icon: PropTypes.string,
    isSelected: PropTypes.bool
  }

  render() {
    const { onPress, text, isNavigation, cellStyle, value, icon, isSelected } = this.props;

    return (
      <View style={[cellStyle]}>
        <TouchableOpacity style={[styles.cellTouch]} onPress={onPress}>
          <Text style={[globalScaledStyles.textLightRegular, styles.cellText, (isSelected ? styles.cellSelected : '')]}>{ text }</Text>
          { isNavigation &&
            <View style={[styles.cellArrowContainer]}>
              <Image style={[styles.cellArrow]} source={require('../assets/images/right-arrow.png')}/>
            </View>
          }
          { value !== null && value !== undefined &&
            <Text style={[globalScaledStyles.textLightRegular, styles.cellValueText]}>{ value }</Text>
          }
          { icon !== null && icon !== undefined && isSelected &&
            <View style={[styles.cellArrowContainer]}>
              <Icon name={ icon } style={[ styles.cellIcon, (isSelected ? styles.cellSelected : '')]} />
            </View>
          }
        </TouchableOpacity>
      </View>
    );
  }

}

const styles = StyleSheet.create(
  {
    cellTouch: {
      height: 57,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: 'rgba(128, 128, 128, 0.2)',
      backgroundColor: 'white',
      alignItems: 'flex-end',
    },
    cellText: {
      flex: 0.8,
      justifyContent: 'center',
      alignSelf: 'center',
      marginLeft: 20
    },
    cellValueText: {
      flex: 0.5,
      textAlign: 'right',
      alignSelf: 'center',
      opacity: 0.6,
      marginRight: 20
    },
    cellArrowContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignSelf: 'center',
      marginRight: 20
    },
    cellArrow: {
      height: 15,
      width: 15,
      resizeMode: 'contain',
    },
    cellIcon: {
      height: 15,
      width: 15,
      resizeMode: 'contain',
    },
    cellSelected: {
      color: 'rgba(0, 122, 255, 1)'
    }
  }
);

export default TableCell;
