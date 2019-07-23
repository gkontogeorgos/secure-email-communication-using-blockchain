import React, { Component } from "react";

import {
  Person,
  lookupProfile,
} from "blockstack";


const avatarFallbackImage =
  "https://s3.amazonaws.com/onename/avatar-placeholder.png";
let crypt = null
let privateKey = null
let publickey = null


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
      statuses: [],
      statusIndex: 0,
      isLoading: false
    };
  }


  componentDidMount() {
    this.fetchData()
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
      username: userSession.loadUserData().username
    });
  }


  saveNewStatus(emailText, public_keyText) {
    const { userSession } = this.props
    let statuses = []
    statuses = (this.state.statuses)
    /* let statuses = Array (this.state.statuses)*/

    let status = {
      id: this.state.statusIndex++,
      email_address: emailText.trim(),
      public_key: public_keyText.trim(),
      created_at: Date.now()
    }

    statuses.unshift(status)
    const options = { encrypt: false }
    userSession.putFile('statuses.json', JSON.stringify(statuses), options)
      .then(() => {
        this.setState({
          statuses: statuses
        })
      })

    //   var customersData = JSON.parse(customersDataString);
    //  console.log(customersData);
  }

  deleteMyPair(e, id) {

    const { userSession } = this.props
    var index = this.state.statuses.findIndex(e => e.id == id);
    const options = { encrypt: false }

    let newArray = []
    newArray = this.state.statuses.slice()
    newArray.splice(index, 1)
    userSession.putFile('statuses.json', JSON.stringify(newArray), options)
      .then(() => {
        this.setState({
          statuses: newArray
        })
      })
  }

  fetchData() {
    const { userSession } = this.props
    this.setState({ isLoading: true })
    if (this.isLocal()) {
      const options = { decrypt: false }
      userSession.getFile('statuses.json', options)
        .then((file) => {
          var statuses = JSON.parse(file || '[]')
          this.setState({
            person: new Person(userSession.loadUserData().profile),
            username: userSession.loadUserData().username,
            statusIndex: statuses.length,
            statuses: statuses,
          })
        })
        .finally(() => {
          this.setState({ isLoading: false })
        })
    } else {
      const username = this.props.match.params.username

      lookupProfile(username)
        .then((profile) => {
          this.setState({
            person: new Person(profile),
            username: username
          })
        })
        .catch((error) => {
          console.log('could not resolve profile')
        })
      const options = { username: username, decrypt: false }
      userSession.getFile('statuses.json', options)
        .then((file) => {
          var statuses = JSON.parse(file || '[]')
          this.setState({
            statusIndex: statuses.length,
            statuses: statuses
          })
        })
        .catch((error) => {
          console.log('could not fetch statuses')
        })
        .finally(() => {
          this.setState({ isLoading: false })
        })
    }
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

  isLocal() {
    return this.props.match.params.username ? false : true;
  }


  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    const { username } = this.state;
    

    return (
      !userSession.isSignInPending() && person ?
        <div className="container">

          <div id="topNav">
            <h2>DPKS</h2><h2>This is a decentralized shared database of public keys/emails</h2>



            <div className="avatar-section">
              <img
                src={
                  person.avatarUrl()
                    ? person.avatarUrl()
                    : avatarFallbackImage
                }
                className="img-rounded avatar"
                id="avatar-image"
              /></div>
            <div className="username">
              <h1>
                <span id="heading-name">
                  {person.name() ? person.name() : "Nameless Person"}
                </span>
              </h1>
              <span>{username}</span>
              {(
                <span>
                  &nbsp; | &nbsp;
                      <button
                    className="btn btn-primary btn-lg"
                    onClick={handleSignOut.bind(this)}
                  >
                    Logout
                      </button>
                </span>
              )}
            </div>

            <div className="tab">
              <button
                className="tablinks"
                onClick={e =>
                  this.chooseSecurityFeature(e, "Generate Keys")
                }
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
                onClick={e => this.chooseSecurityFeature(e, "Send an email (Validation Process)")}
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
                    <h1>For Validation</h1>
                    These pairs will be validated one by one, starting from the first one...
                    {this.state.isLoading && <span>Loading...</span>}
                    {Array.isArray(this.state.statuses) && this.state.statuses.map(status => (
                      <li key={status.id} className="mypair">
                        <p>
                        <strong>email: </strong> <small id="email-peer">{status.email_address}</small>, <br></br>
                        <strong>public_key: </strong> <small id="pkey-peer">{status.public_key}</small> <br>
                        </br><button className="btn-st" onClick={e => this.deleteMyPair(e, status.id)}>Remove
                       </button>
                       </p>
                      </li>
                    ))}
                  </div>
                  </div>


                  
              </div>
            </div>
          </div>
          
        </div> : null
    );
  }
}
export default MyPairsList;