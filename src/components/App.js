import React, { Component } from 'react';
import Gun from 'gun';
import Validation from './Validation';
import { Col } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom'
import Signin from './Signin';
import Generate from './Generate';
import EmailForm from './EmailForm';
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
                    <Generate
                      userSession={userSession}
                      handleSignOut={this.handleSignOut}
                      {...routeProps}
                    />
                }

              />
            </Switch>
          }
          <EmailForm
            userSession={userSession}
            handleSignOut={this.handleSignOut}

          />
          <Validation gun={this.gun} />

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