import React, { Component } from 'react';
import { Panel, ButtonToolbar, Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

class NoteForm extends Component {
  componentWillMount() {
    this.resetState = this.resetState.bind(this);
    this.resetState();
  }

  componentWillReceiveProps(nextProps) {
    const { id, email_address, public_key } = nextProps.pair;
    this.setState({ id, email_address, public_key });

  }

  resetState() {
    const { id, email_address, public_key } = this.props.pair;
    this.setState({ id, email_address, public_key });
  }

  onInputChange(event) {

    let obj = {};
    obj[event.target.id] = event.target.value;
    this.setState(obj);
  }

  handleNewEmailChange(event) {
    this.setState({
      email_address: event.target.value
    });
    
  }

  handleNewPKeyChange(event) {
    this.setState({
      public_key: event.target.value
    });

  }

  saveBtnClick() {
    this.props.dbValidatedData(this.state);
  }




  readFile() {
    var input = document.getElementById("fileinput");
    input.addEventListener("change", loadFile, false);

    function loadFile() {
      var file, reader;

      if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
      }

      if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
      } else if (!input.files[0]) {

      } else {
        file = input.files[0];
        reader = new FileReader();
        reader.onload = receivedText;
        reader.readAsText(file);
      }

      function receivedText() {
        document.getElementById("public_key").value = reader.result;
      }
    }

  }
  render() {

    return (

      <Panel bsStyle="primary">
        <form>
          <FormGroup>
            <ControlLabel>Email address:</ControlLabel>
            <br></br>
            <input
              type="email" id="email_address" name="email" className ="pubpairemail"
              rows="2" cols="5"
              type="public_key"
              placeholder="Enter your email_address..."
              value={this.state.email_address}
              onChange={this.handleNewEmailChange.bind(this)} disabled />
          </FormGroup>
          <br></br>
          <FormGroup>
            <ControlLabel>Public_key:</ControlLabel>
            <br></br>
            <textarea id="public_key" className ="pubpairkey"
              rows="6" cols="78"
              placeholder="Enter your public key..."
              value={this.state.public_key}
              onChange={this.handleNewPKeyChange.bind(this) } disabled/>
          </FormGroup>
          <br></br>
          <FormGroup>
            <ControlLabel>Or upload your own public key in the database:</ControlLabel> <strong>(.txt or .asc)</strong> <br />
            <br></br>
            <FormControl
              type="file" id="fileinput" accept="text/plain,.asc" size="40" onClick={e => this.readFile(e)} />
          </FormGroup>
       
          <br></br>
            <strong id="verification-message" className="verification-message"></strong>
          <ButtonToolbar>
            <Button bsStyle="primary" id= "save" onClick={this.saveBtnClick.bind(this)}>Save</Button>
            <Button id= "cancel" onClick={this.resetState}>Cancel</Button>
          </ButtonToolbar>
        </form>
      </Panel>
    );
  }
}

export default NoteForm;