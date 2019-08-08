import React, { Component } from 'react';
import Gun from 'gun';
import { Switch, Route } from 'react-router-dom'
import Signin from './Signin';
import MyPairsList from './MyPairsList';
import DPKPairsStorage from './DPKPairsStorage';
import SecureEmailForm from './SecureEmailForm';
import GenerateKeys from './GenerateKeys';
import {
  UserSession,
  AppConfig
} from 'blockstack';

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })

class App extends Component {
  constructor() {
    super();
    this.gun = Gun(location.origin + '/gun');
  }

  handleSignIn(e) {
    e.preventDefault();
    userSession.redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() {
    return (

      <div className="site-wrapper">
        <div className="site-wrapper-inner">

          {!userSession.isUserSignedIn() ?
            <Signin userSession={userSession} handleSignIn={this.handleSignIn} />
            :
            <Switch>
              <Route
                path='/:username?'
                render={
                  routeProps =>
                    <MyPairsList
                      userSession={userSession}
                      handleSignOut={this.handleSignOut}
                      {...routeProps}
                    />
                }

              />
            </Switch>
          }
          <GenerateKeys userSession={userSession} />
          <SecureEmailForm userSession={userSession} />
          <DPKPairsStorage gun={this.gun} />

        </div>
      </div>
    );
  }


  componentWillMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.location = window.location.origin;
      });
    }
  }
}
export default App;