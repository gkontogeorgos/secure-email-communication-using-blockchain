import React, { Component } from "react";
import { Button, Col } from "react-bootstrap";
import Gun from "gun";
import _ from "lodash";
import { UserSession, AppConfig } from "blockstack";
import DPKPairForm from "./DPKPairForm";

const newPair = { id: "", email_address: "", public_key: "" };
const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig: appConfig });

// this class handles the pairs stored in the decentralized database DPK DB

class DPKPairStorage extends Component {
  constructor({ gun }) {
    super();
    this.gun = gun;
    this.pairsRef = gun.get("pairs");

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
      statusIndex: 0,
      isLoading: false,
      pairs: [],
      my_pairs: [],
      currentId: ""
    };
  }

  // gets the stored data in the decentralized database when the app launches
  componentDidMount() {
    return this.fetchData();
  }

  // gets and syncs the new pairs with the stored pairs using a reduce and merge functions
  componentWillMount() {
    let pairs = this.state.pairs;
    const self = this;

    this.gun.get("pairs").on(n => {
      var idList = _.reduce(
        n["_"][">"],
        function (result, value, key) {
          if (self.state.currentId === "") {
            self.setState({ currentId: key });
          }

          // gets the data and merges/syncs the pair by its index with the other pairs 
          // if there are already other pairs stored in the DPK DB
          let data = { id: key, date: value };
          self.gun.get(key).on((pair, key) => {
            const merged = _.merge(
              data,
              _.pick(pair, ["email_address", "public_key"])
            );
            // finds the index of the pair by its key
            const index = _.findIndex(pairs, o => {
              return o.id === key;
            });
            if (index >= 0) {
              pairs[index] = merged;
            } else {
              pairs.push(merged);
            }
            self.setState({ pairs });
          });
        },
        []
      );
    });
  }

  // handles the 'New Pair' button
  newPairBtnClick() {
    this.setState({ currentId: "" });
    this.cancel();
  }

  // handles the clicked item... when the user clicks on the pair, its current state's details are displayed
  itemClick(event) {
    document.getElementById("public_key").readOnly = true;
    document.getElementById("email_address").readOnly = true;
    document.getElementById("blockstack_id").readOnly = true;
    this.setState({ currentId: event.target.id });
  }

  // gets the current pair from the database and finds it by the index of the pair
  getCurrentPair() {
    const index = _.findIndex(this.state.pairs, o => {
      return o.id === this.state.currentId;
    });
    const pair = this.state.pairs[index] || newPair;
    return pair;
  }

  // validates all the input data from the user, and if the pair he wants to add to his list is not there,
  // it is successfully added to his list
  addToYourDB() {
    var email = document.getElementById("email_address").value;
    var pkey = document.getElementById("public_key").value;
    var cryptedMsg = document.getElementById("crypted").value;
    var decryptedMsg = document.getElementById("decrypted").value;
    const pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i;
    var result = pattern.test(email);
    var id = document
      .getElementById("blockstack_id")
      .value.replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var blockstack_user = document
      .getElementById("user")
      .innerHTML.replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var pkey_input = pkey
      .replace(/^\s+/, "")
      .replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var pair_list = document.getElementsByClassName("mypair");

    var pkey_stored_db = document.getElementsByClassName('status')
    var pkey_found;


    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };

    // checks if there are any duplicates in DPK DB... it prompts a message that lets the user know if the same pair is already stored in the database
    for (var i = 0; i < pkey_stored_db.length; i++) {
      var pkey_text = pkey_stored_db[i].textContent;
      var index = pkey_text.indexOf('-----BEGIN PUBLIC KEY-----')

      pkey_found = pkey_text.substr(index).replace(/\s+$/, "").replace(/\s+/g, "");

      if (pkey_input == pkey_found && document.getElementById("email_address").readOnly == false &&
        document.getElementById("public_key").readOnly == false) {
        $("#pkey-duplicate").html('This public key is already stored for another pair in the decentralized database! </br> Please, choose another one!');
        break;
      }
      else
        $("#pkey-duplicate").text('')
    }

    // checks if there are any duplicates in the user's personal list that is stored in gaia hub
    for (var i = 0; i < pair_list.length; i++) {
      var pair = pair_list[i].textContent;
      var index = pair.indexOf('-----BEGIN PUBLIC KEY-----')

      var pkey_found_list = pair.substr(index).replace(/\s+$/, "").replace(/\s+/g, "").replace('Remove', '');
      if (pkey_input == pkey_found_list) {
        $("#pkey-duplicate-list").html("This public key is already stored in your Blockstack list 'My Pairs'. Please, choose another one!");
        break;
      }
      else
        $("#pkey-duplicate-list").text('')
    }
    
    // tests all possible conditions for the input data
    if (
      pkey.trim() != "" &&
      email.trim() != "" &&
      (pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
        pkey.trim().endsWith("-----END PUBLIC KEY-----")) &&
      result == true &&
      document.getElementById("email_address").readOnly == true &&
      document.getElementById("public_key").readOnly == true &&
      cryptedMsg.trim() == "" &&
      decryptedMsg.trim() == "" &&
      document.getElementById("message").readOnly == false
    ) {
      alert("You have to add a new pair, first...");
    } else if (
      pkey.trim() == "" &&
      email.trim() == "" &&
      document.getElementById("email_address").readOnly == true &&
      document.getElementById("public_key").readOnly == true &&
      document.getElementById("decrypted").readOnly == true
    ) {
      alert("You have to add a new pair, first...");
    } else if (id.trim() == "") {
      alert("Please enter your blockstack ID...");
    } else if (!id.trim().endsWith("id.blockstack")) {
      alert("Invalid blockstack ID...");
    } else if (id.trim() != blockstack_user) {
      alert("This blockstack ID does not belong to this account.");
    } else if (email.trim() == "") {
      alert("You must enter your email address...");
    } else if (result == false) {
      alert("Invalid Email address!");
    } else if (pkey.trim() == "") {
      alert("You must enter your public key...");
    } else if (
      !(pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
      pkey.trim().endsWith("-----END PUBLIC KEY-----"))
    ) {
      alert("Invalid public key... Please enter a valid public key!");
    } else if (
      pkey.trim() != "" &&
      email.trim() != "" &&
      (pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
        pkey.trim().endsWith("-----END PUBLIC KEY-----")) &&
      result == true &&
      document.getElementById("email_address").readOnly == false &&
      document.getElementById("public_key").readOnly == false &&
      document.getElementById("pkey-duplicate").innerHTML == '' &&
      document.getElementById("pkey-duplicate-list").innerHTML == ''
    ) {
      console.log(
        "The following pair is sent to your Blocsktack gaia hub: {Email:",
        email,
        ", Public key: ",
        pkey,
        "}"
      );
      alert("Pair sent to your list. Refresh page to apply the new changes!");
      this.saveNewPair(
        document.getElementById("email_address").value,
        document.getElementById("public_key").value
      );
      this.setState({
        email: "",
        pubkeystored: ""
      });
      $("#pkey-message").text("");
      $("#email-message").text("");
      document.getElementById('blockstack_id').value = '';
    }


  }

  // saves the new pair of public key and email address to the Blockstack gaia hub as "my_pairs.json" file
  saveNewPair(emailText, public_keyText) {

    let my_pairs = this.state.my_pairs;
    /* let my_pairs = Array (this.state.my_pairs)*/

    let status = {
      id: this.state.statusIndex++,
      email_address: emailText.trim(),
      public_key: public_keyText.trim(),
      created_at: Date.now()
    };

    // LIFO.. puts the current public key and the email address to the beginning of the array of the file 
    my_pairs.unshift(status);
    const options = { encrypt: false };
    userSession
      .putFile("my_pairs.json", JSON.stringify(my_pairs), options)
      .then(() => {
        this.setState({
          my_pairs: my_pairs
        });
      });
  }

  // validates all the input data from the decentralized database and
  // saves the new pair of public key and email address to the database
  storeToDPKDB(data) {
    var id = document
      .getElementById("blockstack_id")
      .value.replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var blockstack_user = document
      .getElementById("user")
      .innerHTML.replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var cryptedMsg = document.getElementById("crypted").value;
    var decryptedMsg = document.getElementById("decrypted").value;
    var email = document.getElementById("email_address").value;
    var pkey = document.getElementById("public_key").value;
    var pkey_input = pkey
      .replace(/^\s+/, "")
      .replace(/\s+$/, "")
      .replace(/\s+/g, "");
    var pkey_stored_db = document.getElementsByClassName('status')
    var pkey_found;

    var email_db = email
      .replace(/^\s+/, "")
      .replace(/\s+$/, "")
      .replace(/\s+/g, "");

    // checks if there is already an email stored in the Blockstack user's list and displays a message in the console
    try {
      var email_pair = document
        .getElementById("email-peer")
        .innerHTML.replace(/\s+$/, "")
        .replace(/\s+/g, "");
    } catch (err) {
      console.log(
        "Your list is empty! You need to add an email address in your pair in the list 'My Pairs' first."
      );
    }

    // checks if there is already a public key stored in the Blockstack user's list and displays a message in the console
    try {
      var pkey_pair = document
        .getElementById("pkey-peer")
        .innerHTML.replace(/\s+$/, "")
        .replace(/\s+/g, "");
    } catch (err) {
      console.log(
        "Your list is empty! You need to add a new public key in your pair in the list 'My Pairs' first."
      );
    }

    // test pattern for all valid email addresses
    const pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i;
    var result = pattern.test(email);

    // regex functions to remove white spaces and other characters
    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };

    // checks if there are any duplicates in DPK DB... it prompts a message that lets the user know if the same pair is already stored in the database
    for (var i = 0; i < pkey_stored_db.length; i++) {
      var pkey_text = pkey_stored_db[i].textContent;
      var index = pkey_text.indexOf('-----BEGIN PUBLIC KEY-----')

      pkey_found = pkey_text.substr(index).replace(/\s+$/, "").replace(/\s+/g, "");

      if (pkey_input == pkey_found && document.getElementById("email_address").readOnly == false &&
        document.getElementById("public_key").readOnly == false) {
        $("#pkey-duplicate").html('This public key is already stored for another pair in the decentralized database! </br> Please, choose another one!');
        break;
      }
      else
        $("#pkey-duplicate").text('')
    }

    // tests all possible conditions for the input data
    if (
      pkey.trim() != "" &&
      email.trim() != "" &&
      (pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
        pkey.trim().endsWith("-----END PUBLIC KEY-----")) &&
      result == true &&
      document.getElementById("email_address").readOnly == true &&
      document.getElementById("public_key").readOnly == true &&
      cryptedMsg.trim() == "" &&
      decryptedMsg.trim() == "" &&
      document.getElementById("message").readOnly == false
    ) {
      alert("You have to add a new pair, first...");
    } else if (
      pkey.trim() == "" &&
      email.trim() == "" &&
      document.getElementById("email_address").readOnly == true &&
      document.getElementById("public_key").readOnly == true &&
      document.getElementById("decrypted").readOnly == true
    ) {
      alert("You have to add a new pair, first...");
    } else if (id.trim() == "") {
      alert("Please enter your blockstack ID...");
    } else if (!id.trim().endsWith("id.blockstack")) {
      alert("Invalid blockstack ID...");
    } else if (id.trim() != blockstack_user) {
      alert("This blockstack ID does not belong to this account.");
    } else if (email.trim() == "") {
      alert("You must enter your email address...");
      $("#confirmed").text(" Verified!");
      $("#msg").text("");
    } else if (result == false) {
      alert("Invalid Email address...");
    } else if (pkey.trim() == "") {
      alert("You must enter your public key...");
    } else if (!(pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
      pkey.trim().endsWith("-----END PUBLIC KEY-----"))){
      alert("Invalid public key... Please enter a valid public key!");
    } else if (
      !document.getElementById("pkey-peer") &&
      !document.getElementById("email-peer")
    ) {
      alert(
        "You need to add a new pair in your list before storing it in the database!"
      );
    } else if (email_pair == "" || pkey_pair == "") {
      alert(
        "Please make sure that you have a pair of email address and public key saved in your Blocstack list 'My Pairs'."
      );
    } else if (
      email_db != email_pair &&
      document.getElementById("pkey-peer") &&
      document.getElementById("email-peer")
    ) {
      alert(
        "Invalid email address. Please make sure, you have entered the same email address that you have saved in your Blocstack list 'My Pairs'."
      );
    } else if (
      pkey_input != pkey_pair &&
      document.getElementById("pkey-peer") &&
      document.getElementById("email-peer")
    ) {
      alert(
        "Invalid public key. Please make sure you have entered the same public key that you have saved in your Blockstack list 'My Pairs'."
      );
    } else if (
      pkey.trim() != "" &&
      email.trim() != "" &&
      (pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
        pkey.trim().endsWith("-----END PUBLIC KEY-----")) &&
      result == true &&
      document.getElementById("email_address").readOnly == false &&
      document.getElementById("public_key").readOnly == false &&
      document.getElementById("message").readOnly == false &&
      document.getElementById("pkey-peer") &&
      document.getElementById("email-peer") && 
      document.getElementById("pkey-duplicate").innerHTML == ''
    ) {
      var retVal = confirm(
        "The pair of public key/email needs to be validated. After you receive an encrypted email from another user, you can decrypt it for the validation process. Do you want to continue ?"
      );
      if (retVal == true) {
        $("#verification-message").text("Awaiting validation... Press 'Confirm' when you are ready...");
        $("#save").text("Confirm");
        $("#confirmed").text("");
        $("#pkey-duplicate").text("");
        $("#pkey-duplicate-list").text("");
        document.getElementById("recepient_email").readOnly = true;
        document.getElementById("topic").readOnly = true;
        document.getElementById("crypted").readOnly = false;
        document.getElementById("decrypted").readOnly = false;
        document.getElementById("blockstack_id").readOnly = true;
        document.getElementById("email_address").readOnly = true;
        document.getElementById("public_key").readOnly = true;
        document.getElementById("message").readOnly = true;
        document.getElementById("message").value = '';
        document.getElementById("crypted").value = '';
        document.getElementById("encryptxbox").checked = false;
        document.getElementById("encryptxbox").disabled = true;
        document.getElementById("decryptxbox").disabled = false;
        document.getElementById("send").disabled = true;
        document.getElementById("cancel").onclick = function () {
          this.cancel();
        };
      }
    } else if (
      pkey.trim() != "" &&
      email.trim() != "" &&
      (pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
        pkey.trim().endsWith("-----END PUBLIC KEY-----")) &&
      result == true &&
      document.getElementById("email_address").readOnly == true &&
      document.getElementById("public_key").readOnly == true &&
      cryptedMsg.trim() == "" &&
      decryptedMsg.trim() == "" &&
      document.getElementById("message").readOnly == true
    ) {
      alert(
        "You need to decrypt the encrypted message before storing the pair in the decentralized database."
      );
    }
    if (
      pkey.trim() != "" &&
      email.trim() != "" &&
      (pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
        pkey.trim().endsWith("-----END PUBLIC KEY-----")) &&
      result == true &&
      (cryptedMsg.trim() != "" && decryptedMsg.trim() != "")
    ) {
      document.getElementById("cancel").onclick = function () {
        this.cancel();
      };
      document.getElementById("save").disabled = true;
     
      // get the input from the user, and if there is already at least one pair stored in the database,
      // it gets the stored pair, and it puts the new pair in the end, else it just puts the new pair
      const pair = _.pick(data, ["email_address", "public_key"]);
      if (data.id !== "") {
        this.gun.get(data.id).put(pair);
      } else {
        this.pairsRef.set(this.gun.put(pair));
      }

      $("#email-message").text("");
      $("#pkey-message").text("");
      $("#verification-message").text("");
      $("#storeddb").text("Pair is added successfully to the database.");
      $("#save").text("Save");
      console.log(
        "The following pair is added successfully to the gun database: {Email:",
        email,
        ", Public key: ",
        pkey,
        "}"
      );
    }
  }

  // this is for the Cancel button that actually restarts the process from the beginning
  cancel(){
    $("#save").text("Save");
    $("#verification-message").text("");
    $("#confirmed").text("");
    $("#storeddb").text("");
    $("#pkey-duplicate").text("");
    $("#pkey-message").text("");
    $("#email-message").text("");
    $("#isvalid").text("");
    $("#isnotvalid").text("");
    document.getElementById("blockstack_id").readOnly = false;
    document.getElementById("blockstack_id").value = '';
    document.getElementById("crypted").value = '';
    document.getElementById("email_address").readOnly = false;
    document.getElementById("public_key").readOnly = false;
    document.getElementById("recepient_email").readOnly = false;
    document.getElementById("topic").readOnly = false;
    document.getElementById("crypted").readOnly = false;
    document.getElementById("decrypted").readOnly = true;
    document.getElementById("message").readOnly = false;
    document.getElementById("encryptxbox").checked = false;
    document.getElementById("encryptxbox").disabled = false;
    document.getElementById("send").disabled = false;
  }

  // fetches the list of pairs that's stored in the Blockstack user's list
  fetchData() {
    this.setState({ isLoading: true });
  
    const options = { decrypt: false };
    
    // if there is at least one pair stored in DPK DB, display the message that the user can check the info of each pair
    if (document.getElementsByClassName("status")){
      document.getElementById("checkpairs").style.display = "block";
    } else {
      document.getElementById("checkpairs").style.display = "none";
    }
    userSession
      .getFile("my_pairs.json", options)
      .then(file => {
        var my_pairs = JSON.parse(file || "[]");
        this.setState({
          statusIndex: my_pairs.length,
          my_pairs: my_pairs
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  render() {
    this.getCurrentPair = this.getCurrentPair.bind(this);
    const { person } = this.state;

    return !userSession.isSignInPending() && person ? (
      
      <div id="DPK DB" className="tabcontent">
        <h2 className="dec_db">Decentralized database of valid pairs</h2>
        <br />
        <label>Add a new pair:</label>
        <br />
        <Button
          bsStyle="primary"
          id="newpair"
          block
          onClick={this.newPairBtnClick.bind(this)}
        >
          New Pair
        </Button>
        <br />
        <small>
          You need to have at least one pair in your list at your Blockstack
          account before storing it in the database!
        </small>

        <br />
        <Col xs={8}>
          <DPKPairForm
            pair={this.getCurrentPair()}
            storeToDPKDB={this.storeToDPKDB.bind(this)}
          />
        </Col>
        <button
          className="btn btn-primary btn-lg"
          onClick={this.addToYourDB.bind(this)}
          id="send_to_your_list"
        >
          Add pair to your list (My Pairs)
        </button>
        <br /><br />
        <strong id="checkpairs">You can click on the stored pairs and check their details above:</strong>
        <br />
        <div className="content-pair">
          <div className="storedpairs">
            {Array.isArray(this.state.pairs) &&
              this.state.pairs.map(pair => (
                <li
                  key={pair.id}
                  id={pair.id}
                  onClick={this.itemClick.bind(this)}
                  className="status"
                >
                  <strong>email: </strong>
                  {pair.email_address} <br />
                  <strong>public key:</strong>
                  {pair.public_key}
                  <br />
                </li>
              ))}
            <br />
          </div>
        </div>
      </div>
    ) : null;
  }
}

export default DPKPairStorage;
