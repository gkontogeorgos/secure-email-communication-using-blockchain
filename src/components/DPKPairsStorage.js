import React, { Component } from "react";
import { Button, Col } from "react-bootstrap";
import Gun from "gun";
import _ from "lodash";
import { UserSession, AppConfig } from "blockstack";
import DPKPairForm from "./DPKPairForm";

const newPair = { id: "", email_address: "", public_key: "" };
const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig: appConfig });

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

  componentDidMount() {
    return this.fetchData();
  }

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

          let data = { id: key, date: value };
          self.gun.get(key).on((pair, key) => {
            const merged = _.merge(
              data,
              _.pick(pair, ["email_address", "public_key"])
            );
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

  newPairBtnClick() {
    this.setState({ currentId: "" });
    document.getElementById("public_key").readOnly = false;
    document.getElementById("email_address").readOnly = false;
    document.getElementById("blockstack_id").value = "";
    document.getElementById("blockstack_id").readOnly = false;
    $("#isvalid").text('');
    $("#isnotvalid").text('');
    $("#pkey-duplicate").text('');
    $("#verification-message").text("");
    $("#email-message").text("");
    $("#pkey-message").text("");
    $("#storeddb").text("");
    $("#save").text("Save");
  }

  itemClick(event) {
    document.getElementById("public_key").readOnly = true;
    document.getElementById("email_address").readOnly = true;
    document.getElementById("blockstack_id").readOnly = true;
    this.setState({ currentId: event.target.id });
  }

  getCurrentPair() {
    const index = _.findIndex(this.state.pairs, o => {
      return o.id === this.state.currentId;
    });
    const pair = this.state.pairs[index] || newPair;
    return pair;
  }

  sendToYourDB() {
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
    try {
      var pkey_pair = document
        .getElementById("pkey-peer")
        .innerHTML.replace(/\s+$/, "")
        .replace(/\s+/g, "");
    } catch (err) {
      console.log(
        "You need to add a new public key in your pair in the list 'My Pairs' first."
      );
    }

    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };


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
      !pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
      !pkey.trim().endsWith("-----END PUBLIC KEY-----")
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

  saveNewPair(emailText, public_keyText) {

    let my_pairs = this.state.my_pairs;
    /* let my_pairs = Array (this.state.my_pairs)*/

    let status = {
      id: this.state.statusIndex++,
      email_address: emailText.trim(),
      public_key: public_keyText.trim(),
      created_at: Date.now()
    };

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

    const pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i;
    var result = pattern.test(email);

    String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    };


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
    } else if (
      !pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
      !pkey.trim().endsWith("-----END PUBLIC KEY-----")
    ) {
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
      document.getElementById("email-peer") && document.getElementById("pkey-duplicate").innerHTML == ''
    ) {
      var retVal = confirm(
        "The pair of public key/email needs to be validated. After you receive an encrypted email from another user, you can decrypt it for the validation process. Do you want to continue ?"
      );
      if (retVal == true) {
        $("#verification-message").text(
          "Awaiting validation... Press 'Confirm' when you are ready..."
        );
        $("#save").text("Confirm");
        $("#confirmed").text("");
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
          document.getElementById("email_address").readOnly = false;
          document.getElementById("public_key").readOnly = false;
          document.getElementById("message").readOnly = false;
          document.getElementById("encryptxbox").checked = false;
          document.getElementById("encryptxbox").disabled = false;
          document.getElementById("send").disabled = false;
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
        $("#save").text("Save");
        document.getElementById("email_address").readOnly = true;
        document.getElementById("public_key").readOnly = true;
        $("#verification-message").text("");
      };
      document.getElementById("save").disabled = true;

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

  fetchData() {
    this.setState({ isLoading: true });
    let my_pairs = [];
    const options = { decrypt: false };

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
          onClick={this.sendToYourDB.bind(this)}
          id="send_to_your_list"
        >
          Send pair to your list (My Pairs)
        </button>
        <br /><br />
        You can click on the stored pairs and check their details above:
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
