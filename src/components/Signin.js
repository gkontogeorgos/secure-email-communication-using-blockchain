import React, { Component } from 'react';

class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="panel-landing" id="section-1">
        <h1 className="landing-heading">DPKS</h1>
        <h2 className="landing-heading-1">Decentralized database of pairs of pk/email for secure email communication</h2>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signin-button"
            onClick={handleSignIn.bind(this)}
          >
            Sign In with Blockstack
          </button>
        </p>
      </div>
    );
  }
}
export default Signin;