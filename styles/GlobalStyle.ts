import {
  StyleSheet
} from 'react-native';
import { ScaledSheet } from 'react-native-size-matters';

export const globalStyles = StyleSheet.create({

  screenBordersMargin: {
    marginLeft: 10,
    marginRight: 10,
  },

  separator: {
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  textBoldRegular: {
    fontFamily: 'SukhumvitSet-Bold',
    fontSize: 20
  },
  textLightRegular: {
    fontFamily: 'SukhumvitSet-Light',
    fontSize: 17
  },
  textMediumRegular: {
    fontFamily: 'SukhumvitSet-Medium',
    fontSize: 15
  },
  textThinRegular: {
    fontFamily: 'SukhumvitSet-Thin',
    fontSize: 12
  },

  defaultInput: {
    backgroundColor: 'white',
    borderRadius: 4,
    color: 'rgba(0, 0, 0, 0.6 )',
    paddingLeft: 10
  },
  defaultButton: {
    borderRadius: 4,
    backgroundColor: 'rgba(69, 117, 211, 1)',
    padding: 5,
    textTransform: 'uppercase',
    paddingLeft: 20,
    paddingRight: 20
  },
  defaultPicker: {
    backgroundColor: 'rgba(250, 153, 23, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderRadius: 4,
    height: 26
  }
});

export const globalScaledStyles = ScaledSheet.create({
  textBoldRegular: {
    fontFamily: 'SukhumvitSet-Bold',
    fontSize: '20@ms'
  },
  textLightRegular: {
    fontFamily: 'SukhumvitSet-Light',
    fontSize: '17@ms'
  },
  textMediumRegular: {
    fontFamily: 'SukhumvitSet-Medium',
    fontSize: '15@ms'
  },
  textThinRegular: {
    fontFamily: 'SukhumvitSet-Thin',
    fontSize: '12@ms'
  },
});
