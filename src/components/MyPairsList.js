import React, { Component } from "react";

import { Person, lookupProfile } from "blockstack";

const avatarFallbackImage =
  "https://s3.amazonaws.com/onename/avatar-placeholder.png";
let crypt = null;
let privateKey = null;
let publickey = null;

class MyPairsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        name() {
          return "Anonymous";
        },
        avatarUrl() {
          return avatarFallbackImage;
        }
      },
      username: "",
      email: "",
      pubkeystored: "",
      my_pairs: [],
      statusIndex: 0,
      isLoading: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
      username: userSession.loadUserData().username
    });
  }


  chooseSecurityFeature(evt, securityFeature) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(securityFeature).style.display = "block";
    evt.currentTarget.className += " active";
  }

  deleteMyPair(e, id) {
    const { userSession } = this.props;
    var index = this.state.my_pairs.findIndex(e => e.id == id);
    const options = { encrypt: false };

    let newArray = [];
    newArray = this.state.my_pairs.slice();
    newArray.splice(index, 1);
    userSession
      .putFile("my_pairs.json", JSON.stringify(newArray), options)
      .then(() => {
        this.setState({
          my_pairs: newArray
        });
      });
  }

  deleteAll() {
    const { userSession } = this.props;
    const options = { encrypt: false };
    let my_pairs = [];
    my_pairs = this.state.my_pairs;
    if (
      document.getElementById("pkey-peer") &&
      document.getElementById("email-peer")
    ) {
      userSession
        .deleteFile("my_pairs.json", JSON.stringify(my_pairs), options)
        .then(() => {
          this.setState({
            my_pairs: my_pairs
          });
        });
      alert("All your pairs are removed from the list! Please, refresh the page to apply the new changes!");
    }
    else {
      alert("Error 404: File 'my_pairs' is empty! There are currently no pairs stored in your list! You need to add at least one pair!");
    }
  }

  fetchData() {
    const { userSession } = this.props;

    this.setState({ isLoading: true });

    if (this.isLocal()) {
      const options = { decrypt: false };

      userSession
        .getFile("my_pairs.json", options)
        .then(file => {
          var my_pairs = JSON.parse(file || "[]");
          this.setState({
            person: new Person(userSession.loadUserData().profile),
            username: userSession.loadUserData().username,
            statusIndex: my_pairs.length,
            my_pairs: my_pairs
          });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });

    } else {
      const username = this.props.match.params.username;

      lookupProfile(username)
        .then(profile => {
          this.setState({
            person: new Person(profile),
            username: username
          });
        })
        .catch(error => {
          console.log("Could not resolve Blockstack profile!");
        });
      const options = { username: username, decrypt: false };
      userSession
        .getFile("my_pairs.json", options)
        .then(file => {
          var my_pairs = JSON.parse(file || "[]");
          this.setState({
            statusIndex: my_pairs.length,
            my_pairs: my_pairs
          });
        })
        .catch(error => {
          console.log("Could not fetch the pairs!");
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  }


  isLocal() {
    return this.props.match.params.username ? false : true;
  }

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const { username } = this.state;

    return !userSession.isSignInPending() && person ? (
      <div className="container">
        <div id="topNav">
          <h1 className="landing-heading">DPKS</h1>
          <h2 className="landing-heading-1">Decentralized database of pairs of email/public key for secure email communication</h2>

          <div className="avatar-section">
            <img
              src={
                person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage
              }
              className="img-rounded avatar"
              id="avatar-image"
            />
          </div>
          <div className="username">
            <h1>
              <span id="heading-name" className="heading-name">
                {person.name() ? person.name() : "Nameless Person"}
              </span>
            </h1>
            <span id="user" className="user">
              {username}
            </span>
            {
              <span>
                &nbsp; | &nbsp;
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleSignOut.bind(this)}
                >
                  Logout
                </button>
              </span>
            }
          </div>

          <div className="tab">
            <button
              className="tablinks"
              onClick={e => this.chooseSecurityFeature(e, "Generate Keys")}
            >
              Generate Keys
            </button>
            <button
              className="tablinks"
              onClick={e => this.chooseSecurityFeature(e, "DPK DB")}
            >
              DPK DB
            </button>
            <button
              className="tablinks"
              onClick={e =>
                this.chooseSecurityFeature(
                  e,
                  "Send an email (Validation Process)"
                )
              }
            >
              Send an email (Validation Process)
            </button>
            <button
              className="tablinks"
              onClick={e => this.chooseSecurityFeature(e, "My pairs")}
            >
              My pairs
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-md-offset-3 col-md-6">
            <div className="col-md-12">
              <div id="My pairs" className="tabcontent">
                <div className="col-sm-2 mypairs">
                  <h3 className='validationTitle'>For Validation</h3>
                  <h4>
                    These pairs will be validated one by one, starting from the
                    last one inserted (First one in the list)
                  </h4>
                  <br></br>
                  <h4>
                    <strong className="remove-notice">
                      If for some reason one of your pairs is already stored in the DPK DB
                      and it's not automatically removed,<br /> please, remove it from your list!
                    </strong>
                  </h4>
                  {this.state.isLoading && <span>Loading...</span>}
                  <div id="pairs_blockstack">
                    {Array.isArray(this.state.my_pairs) &&
                      this.state.my_pairs.map((mypair, index) => (
                        <li key={index} id="my_personal_pair" className="mypair">
                          <p>
                            <strong>email: </strong>
                            <small id="email-peer" className="mypair_email" name="email-peer">
                              {mypair.email_address}
                            </small>
                            <br></br>
                            <strong>public_key: </strong>
                            <small id="pkey-peer" className="mypair_pkey" name="pkey-peer">
                              {mypair.public_key}</small>
                            <br></br>

                            <button
                              className="btn-st"
                              onClick={e => this.deleteMyPair(e, index)}
                            >Remove</button>
                          </p>

                        </li>
                      ))}
                    <br />
                    <button
                      className="btn-st"
                      id="deleteAllPairs"
                      onClick={e => this.deleteAll(e)}
                    >Delete All</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : null;
  }
}
export default MyPairsList;
