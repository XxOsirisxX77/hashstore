import React from 'react';
import { AppContainer } from './Navigation';
import { obtainInstagramToken } from './services/AuthService';
import { getProfileFromDatabaseAsync } from './services/UserService';
import { Font } from 'expo';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false,
      isCheckedSignedIn: false,
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      'SukhumvitSet-Bold': require('./assets/fonts/sukhumvit/SukhumvitSet-Bold.ttf'),
      'SukhumvitSet-Light': require('./assets/fonts/sukhumvit/SukhumvitSet-Light.ttf'),
      'SukhumvitSet-Medium': require('./assets/fonts/sukhumvit/SukhumvitSet-Medium.ttf'),
      'SukhumvitSet-Thin': require('./assets/fonts/sukhumvit/SukhumvitSet-Thin.ttf'),
    });

    obtainInstagramToken()
      .then(async (result) => {
        let signedInType = result !== null ? 1 : 0;
        const isCheckedSignedIn = true;
        await getProfileFromDatabaseAsync().then((responseJson) => {
          const user = responseJson;
          if (user.is_business) {
            signedInType = 2;
          }
          this.setState({ signedInType: signedInType, isCheckedSignedIn: isCheckedSignedIn })
        })
        .catch((error) => {
          this.setState({ signedInType: 0, isCheckedSignedIn: isCheckedSignedIn })
        });
      })
      .catch(err => console.log(err));
  }

  async loadUser() {

  }

  render() {
    const { signedInType, isCheckedSignedIn } = this.state;

    if (!isCheckedSignedIn) {
      return null;
    }
    const Layout = AppContainer(signedInType);
    return (
        <Layout/>
    );
  }
}
