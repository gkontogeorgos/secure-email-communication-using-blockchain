import React, { Component } from "react";

import { Person, lookupProfile } from "blockstack";

const avatarFallbackImage =
  "https://s3.amazonaws.com/onename/avatar-placeholder.png";
let crypt = null;
let privateKey = null;
let publickey = null;

// displays the list of pairs stored in the Blockstack gaia hub

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

  // gets the stored data in the Blockstack user's list when the app launches
  componentDidMount() {
    this.fetchData();
  }

  // it will update the Blockstack userSession with the Blockstack user's data
  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
      username: userSession.loadUserData().username
    });
  }

  // functionality for each tab.. first it hides the tab's content, and when it clicks on it, it shows its content
  chooseSecurityFeature(event, securityFeature) {
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
    event.currentTarget.className += " active";
  }

  // function for the Delete Button: it deletes a pair from the personal list stored in Gaia Hub
  deleteMyPair(e, id) {
    const { userSession } = this.props;

    // get the id of each pair
    var index = this.state.my_pairs.findIndex(e => e.id == id);

    // sets encryption of the file to false
    const options = { encrypt: false };

    // initializes an empty array and use slice and splice function to split the array by its index...
    // then uses stringify function to read the newArray of pairs as a string and 
    // put it in the 'my_pairs.json' file of the Blockstack usersession in Gaia hub by using the putFile function
    let newArray = [];
    newArray = this.state.my_pairs.slice();
    newArray.splice(index, 1);
    userSession
      .putFile("my_pairs.json", JSON.stringify(newArray), options) // uses putFile to put the user's data to his userSession in gaia hub
      .then(() => {
        this.setState({
          my_pairs: newArray
        });
      });
  }

  // removes all pairs from the personal list stored in Gaia Hub
  deleteAll() {
    const { userSession } = this.props;
    const options = { encrypt: false };
    let my_pairs = [];
    my_pairs = this.state.my_pairs;
    
    // checks if there are already any pairs added in the user's list
    if (
      document.getElementById("pkey-peer") &&
      document.getElementById("email-peer")
    ) {
      userSession
        .deleteFile("my_pairs.json", JSON.stringify(my_pairs), options) // uses deleteFile to delete the user's data to his userSession in gaia hub
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

  // gets the user profile's data, and his list of pairs either it's local account or not
  fetchData() {
    const { userSession } = this.props;

    this.setState({ isLoading: true });

    // checks if this is the user's profile or another user's profile
    if (this.isLocal()) {

      // set decryption to false for the file
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

      // lookupProfile is required to go to other Blockstack profiles and fetch their data
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
        .getFile("my_pairs.json", options) // uses getFile to get and read the user's data from his userSession in gaia hub
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

  // checks if the peer's username is local or not; required for fetch the data from other users
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
                      If one of your pairs is already stored in the DPK DB, please, remove it from your list!
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
                              onClick={e => this.deleteMyPair(e, mypair.id)}
                            >Remove</button>
                          </p>

                        </li>
                      ))}
                    <br />
                    <button
                      className="btn-st"
                      id="deleteAllPairs"
                      onClick={e => this.deleteAll(e)}
                    >Delete All
                    </button>
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
