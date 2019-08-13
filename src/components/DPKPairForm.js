import React, { Component } from "react";
import { Button, FormGroup, ControlLabel, FormControl } from "react-bootstrap";

// this class is responsible for the inputs of the decentralized database
class DPKPairForm extends Component {

  componentWillMount() {
    this.resetState = this.resetState.bind(this);
    this.resetState();
  }

  // updates the existing pairs with the new pairs
  componentWillReceiveProps(nextProps) {
    const { id, email_address, public_key } = nextProps.pair;
    this.setState({ id, email_address, public_key });
  }

  // resets the current email address and public key
  resetState() {
    const { id, email_address, public_key } = this.props.pair;
    $("#save").text("Save");
    $("#verification-message").text("");
    $("#confirmed").text("");
    $("#storeddb").text("");
    $("#pkey-duplicate").text("");
    $("#pkey-duplicate-list").text("");
    $("#pkey-message").text("");
    $("#email-message").text("");
    $("#isvalid").text("");
    $("#isnotvalid").text("");
    this.setState({ id, email_address, public_key });
    
  }

  // handles the field for the new email address
  handleNewEmailChange(event) {
    this.setState({
      email_address: event.target.value
    });
  }

  // handles the field for the new public key
  handleNewPKeyChange(event) {
    this.setState({
      public_key: event.target.value
    });
  }

  // this function is for the 'Save' button where it saves the pair in DPK DBB
  saveBtnClick() {
    this.props.storeToDPKDB(this.state);
  }

  // reads a file with the proper format (asc or txt) and writes it as a String
  readFile() {
    var input = document.getElementById("fileinput");
    input.addEventListener("change", loadFile, false);

    function loadFile() {
      var file, reader;

      if (typeof window.FileReader !== "function") {
        alert("The file API isn't supported on this browser yet.");
        return;
      }

      if (!input.files) {
        alert(
          "This browser doesn't seem to support the `files` property of file inputs."
        );
      } else if (!input.files[0]) {
        return;
      } else {
        // loads the file using the FileReader and reads it as a text
        file = input.files[0];
        reader = new FileReader();
        reader.onload = receivedText;
        reader.readAsText(file);
      }

      function receivedText() {
        if (
          !reader.result.startsWith("-----BEGIN PUBLIC KEY-----") &&
          !reader.result.endsWith("-----END PUBLIC KEY-----")
        ) {
          alert("Invalid public key... Please enter a valid public key!");
        } else {
          document.getElementById("pubgenkey").value = reader.result;
        }
      }
    }
  }

  // saves public key as an .asc file and lets the user download it
  savePubkeyAsFile(textToWrite, fileNameToSaveAs) {
    var textFileAsBlob = new Blob([textToWrite], { type: ".asc" });
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    if (document.getElementById("gen_pub_key").value == "") {
      alert("Public key can't be empty!");
    }
    else if (
      !document
        .getElementById("gen_pub_key")
        .value.startsWith("-----BEGIN PUBLIC KEY-----") &&
      !document
        .getElementById("gen_pub_key")
        .value.endsWith("-----END PUBLIC KEY-----")
    ) {
      alert("Invalid public key!");
    }
    else if (window.webkitURL != null) {
      // Required for the Chrome browser since it allows the link
      // to be clicked without adding it to the DOM
      downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else {
      // Required for the Firefox browser since it allows the link to be added to the DOM
      // before it can be clicked by the user
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.target = `_blank`;
      downloadLink.style.display = "none";
       // using downloadLink.download for Firefox
      document.body.appendChild(downloadLink.download);
    }
    downloadLink.click();
  }

  render() {
    return (
      <div className="content-pair">
        <br />
        <br />
        <FormGroup>
          <ControlLabel>Confirm your Blocskstack ID:</ControlLabel>
          <br />
          <input
            type="text"
            id="blockstack_id"
            className="blockstack_ID"
            placeholder="Enter your blockstack id..."
            readOnly
          />
          <strong id="confirmed" className="confirmed"></strong>
          <br />
        </FormGroup>
        <br />
        <FormGroup>
          <ControlLabel>Your Email address:</ControlLabel>
          <br />
          <input
            type="email"
            id="email_address"
            name="email"
            className="pubpairemail"
            rows="2"
            cols="5"
            placeholder="Enter your email address..."
            value={this.state.email_address}
            onChange={this.handleNewEmailChange.bind(this)}
            readOnly
          />
        </FormGroup>
        <br />
        <FormGroup>
          <ControlLabel>Your Public key:</ControlLabel>
          <br />
          <textarea
            id="public_key"
            className="pubpairkey"
            rows="6"
            cols="72"
            placeholder="Enter your public key..."
            value={this.state.public_key}
            onChange={this.handleNewPKeyChange.bind(this)}
            readOnly
          />
          <br />
          <strong id="pkey-duplicate-list" className="pkey-duplicate-list"></strong>
          <br />
          <strong id="pkey-duplicate" className="pkey-duplicate"></strong>
        </FormGroup>
        <br />
        <button
          type="save"
          className="btn-dl"
          onClick={e =>
            this.savePubkeyAsFile(public_key.value, "public_key.asc")
          }
        >
          Download Public Key
        </button>
        <br />
        <br />
        <FormGroup>
          <ControlLabel>
            Or upload your own public key in the database:
          </ControlLabel>{" "}
          <strong>(.txt or .asc)</strong> <br />
          <br />
          <FormControl
            type="file"
            id="fileinput"
            accept="text/plain,.asc"
            size="40"
            onClick={e => this.readFile(e)}
          ></FormControl>
        </FormGroup>
        <br />
        This your generated/uploaded public key (Copy and paste it above):
        <br />
        <textarea
          id="pubgenkey"
          className="pubgenkey"
          rows="6"
          cols="72"
          placeholder="This your generated/uploaded public key..."
          readOnly="readOnly"
        />
        <br />
        <br />
        <strong id="email-message" className="email-message"></strong>
        <br />
        <strong id="pkey-message" className="pkey-message"></strong>
        <br />
        <strong
          id="verification-message"
          className="verification-message"
        ></strong>
        <strong id="storeddb" className="storeddb"></strong>
        <br />
        <Button
          className="btn-store"
          id="save"
          onClick={this.saveBtnClick.bind(this)}
        >
          Save
        </Button>
        <Button id="cancel" onClick={this.resetState}>
          Cancel
        </Button>
      </div>
    );
  }
}

export default DPKPairForm;
