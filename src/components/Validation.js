import React, { Component } from 'react';
import { Panel, Button, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import Gun from 'gun';
import _ from 'lodash';
import {
  Person,
  UserSession,
  AppConfig
} from 'blockstack';
import PairForm from './PairForm';

const newPair = { id: '', email_address: '', public_key: '' };
const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig: appConfig })

class Validation extends Component {

  constructor({ gun }) {
    super()
    this.gun = gun;
    this.pairsRef = gun.get('pairs');

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
      isLoading: false,
      pairs: [],
      currentId: ''
    };
  }

  componentWillMount() {

    let pairs = this.state.pairs;
    const self = this;
    this.gun.get('pairs').on((n) => {
      var idList = _.reduce(n['_']['>'], function (result, value, key) {
        if (self.state.currentId === '') {
          self.setState({ currentId: key });
        }

        let data = { id: key, date: value };
        self.gun.get(key).on((note, key) => {
          const merged = _.merge(data, _.pick(note, ['email_address', 'public_key']));
          const index = _.findIndex(pairs, (o) => { return o.id === key });
          if (index >= 0) {
            pairs[index] = merged;
          } else {
            pairs.push(merged);
          }
          self.setState({ pairs });
        })
      }, []);
    })
  }
  componentDidMount() {

    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn();
      return this.fetchData();
    }

    if (userSession.isUserSignedIn()) {
      return this.fetchData();
    }

  }
  newPairBtnClick() {
    this.setState({ currentId: '' });
    document.getElementById("public_key").disabled=false;
    document.getElementById("email_address").disabled=false;
  }

  itemClick(event) {
    document.getElementById("public_key").disabled=true;
    document.getElementById("email_address").disabled=true;
    this.setState({ currentId: event.target.id });
  }

  getCurrentPair() {
    const index = _.findIndex(this.state.pairs, (o) => { return o.id === this.state.currentId });
    const pair = this.state.pairs[index] || newPair;
    return pair;
  }

  deletePair(e, id) {

    var index = this.state.pairs.findIndex(e => e.id == id);
    let newPairs = []
    newPairs = this.state.pairs.slice()
    newPairs.splice(index, 1)

    this.setState({
      pairs: newPairs
    })


  }

  dbValidatedData(data) {

    var email = document.getElementById('email_address').value
    var pkey = document.getElementById('public_key').value
    var Msg = document.getElementById('message').value
    var decryptedMsg = document.getElementById('decrypted').value
    var email = document.getElementById("email_address").value
    const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    var result = pattern.test(email);
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    }
    if (email.trim() == '') {
      alert("You must enter your email address...");
    }
    if (pkey.trim() == '') {
      alert("You must enter your public key...");
    }
    if (!(pkey.startsWith("-----BEGIN PUBLIC KEY-----")) &&
      !(pkey.endsWith("-----END PUBLIC KEY-----")) ||
      ((pkey.endsWith(".asc")))) {

      alert("Invalid public key... Please enter a valid public key!")

    }

    if (result == false) {
      alert("Wrong email address...")
      this.setState({
        emailError: true
      })
    }


    if ((pkey.trim() != '') && (email.trim() != '') &&
      ((pkey.startsWith("-----BEGIN PUBLIC KEY-----")) &&
        (pkey.endsWith("-----END PUBLIC KEY-----"))) && (result == true) && (Msg == '')) {
          alert("The pair of public key/email needs to be validated. Please send an encrypted email to another user for the validation process. Do you want to continue ?");
          $('#verification-message').text("Awaiting validation... Press 'Confirm' when you are ready...");
          $('#save').text('Confirm')
          document.getElementById("email_address").disabled = true;
          document.getElementById("public_key").disabled = true;
          
        document.getElementById('cancel').onclick = function () {
          $('#save').text('Save')
          document.getElementById("email_address").disabled = true;
          document.getElementById("public_key").disabled = true;
          $('#verification-message').text("");
        }
        }
    else if ((pkey.trim() != '') && (email.trim() != '') &&
    ((pkey.startsWith("-----BEGIN PUBLIC KEY-----")) &&
      (pkey.endsWith("-----END PUBLIC KEY-----"))) && (result == true) && (decryptedMsg == Msg)){
        $('#isvalid').text('Pair is validated! ' + 'Email: ' + email + ' is valid and added successfully to the database.');
       
        document.getElementById('cancel').onclick = function () {
          $('#save').text('Save')
          document.getElementById("email_address").disabled = true;
          document.getElementById("public_key").disabled = true;
          $('#verification-message').text("");
        }
        

          const pair = _.pick(data, ['email_address', 'public_key']);
          if (data.id !== '') {
            this.gun.get(data.id).put(pair);
          } else {
            this.pairsRef.set(this.gun.put(pair))
          }
          

          $('#verification-message').text("");
          $('#save').text('Save')
      }
        else if (decryptedMsg != Msg) {
          $('#isnotvalid').text('Pair is not validated! ' + 'Email: ' + email + ' is not valid.');
        }
    
    
  }

  sendToYourDB() {

    var email = document.getElementById("email_address").value
    const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    var result = pattern.test(email);
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    }
    if (document.getElementById('email_address').value.trim() == '') {
      alert("You must enter your email address...");
    }
    if (document.getElementById('public_key').value.trim() == '') {
      alert("You must enter your public key...");
    }
    if (!(document.getElementById('public_key').value.startsWith("-----BEGIN PUBLIC KEY-----")) &&
      !(document.getElementById('public_key').value.endsWith("-----END PUBLIC KEY-----")) ||
      ((document.getElementById('public_key').value.endsWith(".asc")))) {

      alert("Invalid public key... Please enter a valid public key!")

    }

    if (result == false) {
      alert("Wrong email address...")
      this.setState({
        emailError: true
      })
    }


    if ((document.getElementById('public_key').value.trim() != '') && (document.getElementById('email_address').value.trim() != '') &&
      ((document.getElementById('public_key').value.startsWith("-----BEGIN PUBLIC KEY-----")) &&
        (document.getElementById('public_key').value.endsWith("-----END PUBLIC KEY-----"))) && (result == true)) {

      var retVal = confirm("The pair will be stored in YOUR temporary db. Are you OK with that?");
      if (retVal == true) {

        this.saveNewStatus(document.getElementById("email_address").value, document.getElementById("public_key").value);
        this.setState({
          emailError: false,
          email: "",
          pubkeystored: ""
        });
        alert("Refresh page and navigate to 'My pair' to see your new pair");



      }
    }
  }
  saveNewStatus(emailText, public_keyText) {

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

  fetchData() {

    this.setState({ isLoading: true })

    const options = { decrypt: false }
    userSession.getFile('statuses.json', options)
      .then((file) => {
        var statuses = JSON.parse(file || '[]')
        this.setState({

          statusIndex: statuses.length,
          statuses: statuses,
        })
      })
      .finally(() => {
        this.setState({ isLoading: false })
      })

  }

  render() {
    this.getCurrentPair = this.getCurrentPair.bind(this);
    const { person } = this.state;
    const { username } = this.state;

    return (
      !userSession.isSignInPending() && person ?
        <div id="DPK DB" className="tabcontent" >

          <Col xs={4} >
            <h2>DPK DB</h2>

            Click a pair to see or edit its details:
          {Array.isArray(this.state.pairs) && this.state.pairs.map(pair => (
              <li key={pair.id} id={pair.id} onClick={this.itemClick.bind(this)} className="status">
                [<strong>email: </strong>{pair.email_address}, <strong>public key:</strong> {pair.public_key}]
              <br></br><button className="btn-st" onClick={e => this.deletePair(e, pair.id)}>Remove
                       </button>
              </li>
            ))}

            <Button bsStyle="primary" block onClick={this.newPairBtnClick.bind(this)}>New Pair</Button>

          </Col>
          <Col xs={8}>
            <PairForm pair = {this.getCurrentPair()} dbValidatedData={this.dbValidatedData.bind(this)} />
          </Col>
          <button
            className="btn btn-primary btn-lg"
            onClick={e => this.sendToYourDB(e)}

          >Send pair to your temp db(My Pairs)
            </button>



        </div> : null
    );
  }
}

export default Validation;