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


export default class Generate extends Component {
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



  key_size() {
    //Change the key size value for new keys
    $(".change-key-size").each(function (index, value) {
      var el = $(value);
      var keySize = el.attr('value');
      el.click(function (e) {
        var button = $('#key-size');
        button.attr('value', keySize);
        button.html(keySize + ' bit <span className="caret"></span>');
        e.preventDefault();
      });
    });
  }

  generateKeypair() {
    
      var sKeySize = $('#key-size').attr('data-value');
      var keySize = parseInt(sKeySize);
      var crypt = new JSEncrypt({default_key_size: keySize});
      var async = $('#async-ck').is(':checked');
      var dt = new Date();
      var time = -(dt.getTime());
      var pass = document.getElementById("passphrase").value;
      if (pass == "") {
        $('#five-words').text('Passphrase must not be empty!');
      }
      else if (!(pass.split(" ").length > 4)) {
        $('#five-words').text('Passphrase must have more than 4 words!');
      }
      else {
        $('#five-words').text('');
      if (async) {
        $('#time-report').text('.');
        var load = setInterval(function () {
          var text = $('#time-report').text();
          $('#time-report').text(text + '.');
        }, 500);
        crypt.getKey(function () {
          clearInterval(load);
          dt = new Date();
          time += (dt.getTime());
          $('#time-report').text('Generated in ' + time + ' ms');
          $('#privkey').val(crypt.getPrivateKey());
          $('#pubkey').val(crypt.getPublicKey());
        });
        return;
      }
      crypt.getKey();
      dt = new Date();
      time += (dt.getTime());
      $('#time-report').text('Generated in ' + time + ' ms');
      $('#privkey').val(crypt.getPrivateKey());
      $('#pubkey').val(crypt.getPublicKey());
      }
      document.getElementById("pubgenkey").value = document.getElementById("pubkey").value;
  }


  sendMail() {
    var link =
      "mailto:" + escape(document.getElementById('recepient_email').value)
      + "?cc=" + escape(document.getElementById('owner_email').value)
      + "&subject=" + escape(document.getElementById('topic').value)
      + "&body=" + escape(document.getElementById('crypted').value)
    window.location.href = link;
  }



  clearContents() {
    document.getElementById("message").value = '';
    document.getElementById("crypted").value = '';
    document.getElementById("decrypted").value = '';
    document.getElementById("encryptxbox").checked = false;
    document.getElementById("decryptxbox").checked = false;
    $('#isvalid').text('')
    $('#isnotvalid').text('')
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





                <div id="Generate Keys" className="tabcontent">

                <br /><br />
                    <div>
                    Choose a passphrase:
                    <input
                      type="pass"
                      name="passphrase"
                      id="passphrase"
                      autoComplete="on"
                    />
                    <br></br>
                    <small id="five-words" className="passlength"></small>
                    <div className="col-lg-2">
                    <br></br>Key Size:
                    <select
                    id="key-size" type="button" data-value="2048" >
                    <option className="change-key-size" data-value="512">512 bits </option>
                      <option className="change-key-size" data-value="1024">1024 bits </option>
                      <option className="change-key-size" data-value="2048">2048 bits (recommended)</option>
                      <option className="change-key-size" data-value="4096">4096 bits </option>
                    </select>
                    
                    <br></br>
                    <label htmlFor="async-ck">Async
                      <input id="async-ck" type="checkbox"></input> 
                    </label>
                    </div>

                    <br />
                    <br />
                    <button
                      className="btn btn-primary"
                      value="Generate PGP Keys"
                      id="generate"
                      onClick={e => this.generateKeypair(e)}
                    >
                    Generate PGP Keys
                    </button>
                    <br></br>
                    <span><i><small id="time-report"></small></i></span>

                    </div>

                    <br></br>
                    <div className="block">
                      <label htmlFor="pubkey">Public Key</label><br />
                      <textarea id="pubkey" rows="15" cols="69"></textarea><br />

                      <label htmlFor="privkey">Private Key</label><br />
                      <textarea id="privkey" readOnly="readOnly" rows="15" cols="69"></textarea><br />

                      <label htmlFor="pub-p-key">Other peer's public Key</label><br />
                      <textarea id="pub-p-key" rows="15" cols="69"></textarea><br />


                    </div>
           
                </div>



                <div id="My pairs" className="tabcontent">
                  <div className="col-sm-2 mypairs">

                    {this.state.isLoading && <span>Loading...</span>}
                    {Array.isArray(this.state.statuses) && this.state.statuses.map(status => (
                      <li key={status.id} className="mypair">
                        [<strong>email: </strong> {status.email_address}, <strong>public_key: </strong> {status.public_key}] <br>
                        </br><button className="btn-st" onClick={e => this.deleteMyPair(e, status.id)}>Remove
                       </button>
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
