import React, { Component } from 'react';
import { Button, Col } from 'react-bootstrap';
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

class DPKPairs extends Component {

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
    document.getElementById("public_key").disabled = false;
    document.getElementById("email_address").disabled = false;
    $('#verification-message').text("");
    $('#save').text('Save');
  }

  itemClick(event) {
    document.getElementById("public_key").disabled = true;
    document.getElementById("email_address").disabled = true;
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

    var cryptedMsg = document.getElementById('crypted').value;
    var decryptedMsg = document.getElementById('decrypted').value;
    var email = document.getElementById('email_address').value
    var pkey = document.getElementById('public_key').value
    var pkey_db = pkey.replace(/^\s+/,"").replace(/\s+$/,"").replace(/\s+/g,"");
    var pkey_pair = document.getElementById('pkey-peer').innerHTML.replace(/\s+$/,"").replace(/\s+/g,"");

    var email_db = email.replace(/^\s+/,"").replace(/\s+$/,"").replace(/\s+/g,"");
    var email_pair = document.getElementById('email-peer').innerHTML.replace(/\s+$/,"").replace(/\s+/g,"");

    const pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i;
    var result = pattern.test(email);

    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    }

    if ((pkey.trim() != '') && (email.trim() != '') &&
    ((pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
      (pkey.trim().endsWith("-----END PUBLIC KEY-----"))) && (result == true) &&
    document.getElementById("email_address").disabled == true &&
    document.getElementById("public_key").disabled == true &&
    cryptedMsg.trim() == '' && decryptedMsg.trim() == '' &&
    document.getElementById("message").disabled == false) {
    alert("You have to add a new pair, first...")
    }
    else if (email.trim() == '') {
      alert("You must enter your email address...");
    }
    else if (result == false) {
      alert("Wrong email address...");
    }
    else if (pkey.trim() == '') {
      alert("You must enter your public key...");
    }
    else if (!(pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
      !(pkey.trim().endsWith("-----END PUBLIC KEY-----"))) {
      alert("Invalid public key... Please enter a valid public key!")
    }
    else if (email_pair =='' || pkey_pair == ''){
      alert ("Please make sure that you have a pair of email address and public key saved in your Blocstack list 'My Pairs'.");
    }
    else if ((email_db != email_pair)){
      alert ("Invalid email address. Please make sure, you have entered the same email address that you have saved in your Blocstack list 'My Pairs'.");
    }
    else if ((pkey_db != pkey_pair)){
      alert ("Invalid public key. Please make sure, you have entered the same public key that you have saved in your Blockstack list 'My Pairs'.");
    }
    else if ((pkey.trim() != '') && (email.trim() != '') &&
      ((pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
        (pkey.trim().endsWith("-----END PUBLIC KEY-----"))) && (result == true) &&
      document.getElementById("email_address").disabled == false &&
      document.getElementById("public_key").disabled == false &&
      document.getElementById("message").disabled == false) {
      var retVal = confirm("The pair of public key/email needs to be validated. After you receive an encrypted email from another user, you can decrypt it for the validation process. Do you want to continue ?");
      if (retVal == true) {
        $('#verification-message').text("Awaiting validation... Press 'Confirm' when you are ready...");
        $('#save').text('Confirm')
        document.getElementById("recepient_email").disabled = true;
        document.getElementById("topic").disabled = true;
        document.getElementById("decrypted").disabled = false;
        document.getElementById("email_address").disabled = true;
        document.getElementById("public_key").disabled = true;
        document.getElementById("message").disabled = true;
        document.getElementById("encryptxbox").disabled = true;
        document.getElementById("send").disabled = true;

        document.getElementById('cancel').onclick = function () {
          $('#save').text('Save');
          $('#verification-message').text("");
          document.getElementById("email_address").disabled = false;
          document.getElementById("public_key").disabled = false;
          document.getElementById("recepient_email").disabled = false;
          document.getElementById("topic").disabled = false;
          document.getElementById("decrypted").disabled = true;
          document.getElementById("email_address").disabled = false;
          document.getElementById("public_key").disabled = false;
          document.getElementById("message").disabled = false;
          document.getElementById("encryptxbox").disabled = false;
          document.getElementById("send").disabled = false;
        }
      }
    }
    else if ((pkey.trim() != '') && (email.trim() != '') &&
      ((pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
        (pkey.trim().endsWith("-----END PUBLIC KEY-----"))) && (result == true) &&
      document.getElementById("email_address").disabled == true &&
      document.getElementById("public_key").disabled == true &&
      cryptedMsg.trim() == '' && decryptedMsg.trim() == '' &&
      document.getElementById("message").disabled == true) {
      alert("You need to decrypt the encrypted message before storing the pair in the decentralized database.")
    }
    if ((pkey.trim() != '') && (email.trim() != '') &&
      ((pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
        (pkey.trim().endsWith("-----END PUBLIC KEY-----"))) && (result == true) && (cryptedMsg.trim() != '' && decryptedMsg.trim() != '')) {
      
      document.getElementById('cancel').onclick = function () {
        $('#save').text('Save')
        document.getElementById("email_address").disabled = true;
        document.getElementById("public_key").disabled = true;
        $('#verification-message').text("");
      }
      document.getElementById('save').disabled = true;

      const pair = _.pick(data, ['email_address', 'public_key']);
      if (data.id !== '') {
        this.gun.get(data.id).put(pair);
      } else {
        this.pairsRef.set(this.gun.put(pair))
      }
      $('#verification-message').text('')
      $('#storeddb').text('Pair is added successfully to the database.');
      console.log('The following pair is added to the gun database: {Email:', email, ', Public key: ', pkey, '}')
      $('#save').text('Save')
    }

  }

  sendToYourDB() {

    var email = document.getElementById('email_address').value
    var pkey = document.getElementById('public_key').value
    const pattern = /[a-zA-Z0-9]+[\.]?([a-zA-Z0-9]+)?[\@][a-z]{3,9}[\.][a-z]{2,5}/g;
    var result = pattern.test(email);
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    }
    if (email.trim() == '') {
      alert("You must enter your email address...");
    }
    else if (result == false) {
      alert("Wrong email address...");
    }
    else if (pkey.trim() == '') {
      alert("You must enter your public key...");
    }
    else if (!(pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
      !(pkey.trim().endsWith("-----END PUBLIC KEY-----"))) {

      alert("Invalid public key... Please enter a valid public key!")

    }
    if ((pkey.trim() != '') && (email.trim() != '') &&
      ((pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
        (pkey.trim().endsWith("-----END PUBLIC KEY-----"))) && (result == true) &&
      document.getElementById("email_address").disabled == true &&
      document.getElementById("public_key").disabled == true) {
      alert("You have to add a new pair, first...")
    }
    else if ((pkey.trim() != '') && (email.trim() != '') &&
      ((pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
        (pkey.trim().endsWith("-----END PUBLIC KEY-----"))) && (result == true) &&
      document.getElementById("email_address").disabled == false &&
      document.getElementById("public_key").disabled == false) {
      console.log('The following pair is sent to your Blocsktack gaia hub: {Email:', email, ', Public key: ', pkey, '}')
      alert("Pair sent to your list. Refresh page to apply the new changes!");
      this.saveNewStatus(document.getElementById("email_address").value, document.getElementById("public_key").value);
      this.setState({
        email: "",
        pubkeystored: ""
      });
      return false;
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

    return (
      !userSession.isSignInPending() && person ?
        <div id="DPK DB" className="tabcontent" >
          <div className="content-pair">
            <Col xs={4} >
              <h2>Decentralized database of valid pairs</h2>


              {Array.isArray(this.state.pairs) && this.state.pairs.map(pair => (
                <li key={pair.id} id={pair.id} onClick={this.itemClick.bind(this)} className="status">
                  <strong>email: </strong>{pair.email_address} <br></br> <strong>public key:</strong> {pair.public_key}
                  <br></br>
                </li>
              ))}
              <label>Add a new pair in the decentralized database</label>
              <br></br>
              <Button bsStyle="primary" id="newpair" block onClick={this.newPairBtnClick.bind(this)}>New Pair</Button>

            </Col>
            <Col xs={8}>
              <PairForm pair={this.getCurrentPair()} dbValidatedData={this.dbValidatedData.bind(this)} />
            </Col>
            <button
              className="btn btn-primary btn-lg"
              onClick={this.sendToYourDB.bind(this)}
              id="send_to_your_list"
            >Send pair to your list (My Pairs)
            </button>

          </div>

        </div> : null
    );
  }
}

export default DPKPairs;