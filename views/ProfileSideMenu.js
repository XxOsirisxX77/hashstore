import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

class ProfileSideMenu extends React.Component {

render () {
    return (
      <View>
        <View>
          <Icon.Button name="cogs" color="black" backgroundColor="transparent" onPress={() => { alert("") } }>
            Settings
          </Icon.Button>
        </View>
      </View>
    );
  }
}

export default ProfileSideMenu;
