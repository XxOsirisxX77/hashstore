import React from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  View,
  StatusBar
} from 'react-native';
import { PropTypes } from 'prop-types';
import { globalStyles, globalScaledStyles } from '../styles/GlobalStyle';
import { ScaledSheet } from 'react-native-size-matters';


class NetworkIssue extends React.Component {

  static propTypes = {
    retryMethod: PropTypes.func.isRequired
  }

  render() {
    const { retryMethod } = this.props;

    return (
      <View style={[styles.mainContainer]}>
        <StatusBar barStyle="light-content" />
        <View style={[styles.networkIssueContainer]}>
          <Text style={[globalScaledStyles.textBoldRegular]}>
            UNABLE TO CONNECT
          </Text>
        </View>
        <View style={[scaledStyles.networkIssueIconContainer]}>
          <Image style={[scaledStyles.networkIssueImage]} source={ require('../assets/images/network-issues.png') }/>
        </View>
        <View style={[styles.reTryConnectContainer]}>
          <TouchableOpacity onPress={() => retryMethod()} style={[scaledStyles.reTryButtonTouch]}>
            <View style={[scaledStyles.reTryButton]}>
              <Text style={[globalStyles.textBoldRegular, scaledStyles.reTryButtonText]}>Try Again</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  networkIssueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  reTryConnectContainer: {
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

const scaledStyles = ScaledSheet.create({
  networkIssueIconContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: '25@ms',
    marginBottom: '25@ms',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  networkIssueImage: {
    height: '120@ms',
    resizeMode: 'contain',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  reTryButtonTouch: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: '58@ms',
    alignItems: 'center',
    justifyContent: 'center'
  },
  reTryButton: {
    flex: 1,
    flexDirection: 'row',
    width: '250@ms',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  reTryButtonText: {
    flex: 1,
    textTransform: 'uppercase',
    alignSelf: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
})

export default NetworkIssue;
