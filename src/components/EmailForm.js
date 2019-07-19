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


export default class Manager extends Component {
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


    handleChangeEmail(e) {

        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

        if (this.state.email === false) {
            this.setState({
                isDisabled: false
            })
        }
    }

    sendMail() {
        var link =
            "mailto:" + escape(document.getElementById('recepient_email').value)
            + "?cc=" + escape(document.getElementById('owner_email').value)
            + "&subject=" + escape(document.getElementById('topic').value)
            + "&body=" + escape(document.getElementById('crypted').value)
        window.location.href = link;
    }

    encryptedMsg() {
        var crypt = new JSEncrypt();
        var Msg = document.getElementById('message').value
        var my_pkey = document.getElementById("pubkey").value
        crypt.setKey(my_pkey)
        document.getElementById("crypted").value = crypt.encrypt(Msg);

    }

    decryptedMsg() {
        var crypt = new JSEncrypt();
        var cryptedMsg = document.getElementById('crypted').value
        var my_prkey = document.getElementById('privkey').value
        crypt.setKey(my_prkey)
        document.getElementById("decrypted").value = crypt.decrypt(cryptedMsg);

    }

    clearContents() {
        document.getElementById("message").value = '';
        document.getElementById("message").value = '';
        document.getElementById("message").value = '';
        document.getElementById("message").value = '';
        document.getElementById("crypted").value = '';
        document.getElementById("decrypted").value = '';
        document.getElementById("encryptxbox").checked = false;
        document.getElementById("decryptxbox").checked = false;
        $('#isvalid').text('')
        $('#isnotvalid').text('')
    }

    render() {

        const { handleSignOut } = this.props;
        const { person } = this.state;
        const { username } = this.state;
        const { userSession } = this.props;

        return (


            !userSession.isSignInPending() && person ?
                <div id="Send an email (Validation Process)" className="tabcontent">




                    <br></br><label htmlFor="email">To:</label>
                    <input type="email" id="recepient_email" name="email" placeholder="Enter your email" onChange={(e) => { this.handleChangeEmail(e) }} />


                    <br></br><label htmlFor="email">CC:</label>
                    <input type="email" id="owner_email" name="email" placeholder="Enter your email" onChange={(e) => { this.handleChangeEmail(e) }} />


                    <br></br><label htmlFor="email">Topic:</label>
                    <textarea type="topic" id="topic" name="Topic" placeholder="Topic..."></textarea>

                    <br></br><label htmlFor="email">Message:</label><br></br>
                    <textarea id="message" name="Message" placeholder="Enter your message here..." rows="10" cols="69"></textarea>

                    <br></br><label htmlFor="encrypted">Encrypt</label>
                    <input type="checkbox" id="encryptxbox" className="my_input" onClick={e => this.encryptedMsg(e)}></input>
                    <br></br>
                    <br></br><label htmlFor="crypted">Encrypted Message:</label><br></br>
                    <textarea id="crypted" name="crypted" placeholder="Enter your message here..." rows="10" cols="69"></textarea>

                    <br></br><label htmlFor="decrypted">Decrypt</label><br></br>
                    <input type="checkbox" id="decryptxbox" className="my_input" onClick={e => this.decryptedMsg(e)}></input>

                    <br></br><label htmlFor="decrypted">Decrypted Message:</label><br></br>
                    <textarea id="decrypted" name="decrypted" placeholder="Enter your message here..." rows="10" cols="69"></textarea>
                    <p>
                        <button type="reset" className="btn-res" value="Reset" onClick={e => this.clearContents(e)}>RESET</button>
                    </p>
                    <strong id="isvalid" className="isvalid"></strong>
                    <strong id="isnotvalid" className="isnotvalid"></strong>
                    <p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={e => this.sendanMail(e)}
                        >Send
                        </button>
                    </p>
                </div> : null
        );

    }

}