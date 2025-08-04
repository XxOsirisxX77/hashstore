import React from 'react';
import { AppContainer } from './Navigation';
import { obtainInstagramToken } from './services/AuthService';
import { getProfileFromDatabaseAsync } from './services/UserService';

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false,
      isCheckedSignedIn: false,
    }
  }

  async componentDidMount() {
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
    
    return AppContainer(signedInType);
  }
}
