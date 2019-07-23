import React, { Component } from "react";

const avatarFallbackImage =
    "https://s3.amazonaws.com/onename/avatar-placeholder.png";
let crypt = null
let privateKey = null
let publickey = null


class EmailForm extends Component {
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


    sendMail() {
        var rec_email = document.getElementById('recepient_email').value;
        var message = document.getElementById('message').value;
        var encrypted_message = document.getElementById('crypted').value;
        var email = rec_email.split(' ').join('')
        const pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))){2,6}$/i;
        var result = pattern.test(email);

        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "");
        }
        if (rec_email == '') {
            alert("You must enter your email address...");
        }
        else if (result == false) {
            alert("Wrong email address...")
            this.setState({
                emailError: true
            })
        }
        else if (message.trim() == '') {
            alert("Message must not be empty...");
        }
        else if (encrypted_message.trim() == '') {
            alert("Message must be encrypted with the other peer's public key, before it's sent to this peer...");
        }
        else {
            var link =
                "mailto:" + escape(document.getElementById('recepient_email').value)
                + "?cc=" + escape('')
                + "&subject=" + escape(document.getElementById('topic').value)
                + "&body=" + escape(document.getElementById('crypted').value)
            window.location.href = link;
        }
    }

    encryptedMsg() {
        var crypt = new JSEncrypt();
        document.getElementById("encryptxbox").disabled = true;
        var Msg = document.getElementById('message').value;
        var my_pkey = document.getElementById("pubkey").value
        crypt.setKey(my_pkey)
        document.getElementById("crypted").value = crypt.encrypt(Msg);
        if (crypt.encrypt(Msg) == false) {
            if (my_pkey == '') {
                alert("Encryption failed! Your public key is not defined.")
            }
            else if (!(my_pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
            !(my_pkey.trim().endsWith("-----END PUBLIC KEY-----")))  {
                alert("Encryption failed! Your public key is invalid.");
            }
            document.getElementById("crypted").value = '';
            document.getElementById("encryptxbox").disabled = false;
            document.getElementById("encryptxbox").checked = false;
        }else{
        document.getElementById("decryptxbox").disabled = true;
        document.getElementById("decryptxbox").checked = true;
        document.getElementById("decrypted").disabled = true;
        }
    }

    decryptedMsg() {
        var crypt = new JSEncrypt();
        document.getElementById("decryptxbox").disabled = true;
        var cryptedMsg = document.getElementById('crypted').value
        var my_prkey = document.getElementById('privkey').value
        crypt.setKey(my_prkey)
        document.getElementById("decrypted").value = crypt.decrypt(cryptedMsg);
        if (crypt.decrypt(cryptedMsg) == false) {
            alert("Failed to decrypt the message. You need the matched private key of your public key to decrypt it.")
            document.getElementById("decrypted").value = '';
            document.getElementById("decryptxbox").disabled = false;
            document.getElementById("decryptxbox").checked = false;
        }
    }

    clearAll() {
        document.getElementById("recepient_email").value = '';
        document.getElementById("topic").value = '';
        document.getElementById("message").value = '';
        document.getElementById("message").value = '';
        document.getElementById("message").value = '';
        document.getElementById("message").value = '';
        document.getElementById("crypted").value = '';
        document.getElementById("decrypted").value = '';
        document.getElementById("encryptxbox").checked = false;
        document.getElementById("decryptxbox").checked = false;
        document.getElementById("encryptxbox").disabled = false;
        document.getElementById("decryptxbox").disabled = false;
        $('#isvalid').text('')
        $('#isnotvalid').text('')
    }

    render() {

        const { person } = this.state;
        const { userSession } = this.props;

        return (


            !userSession.isSignInPending() && person ?
                <div id="Send an email (Validation Process)" className="tabcontent">

                    <br></br><label htmlFor="email">To:</label><br></br>
                    <input type="email" id="recepient_email" name="email" placeholder="Enter your email..." />

                    <br></br><label htmlFor="email">Topic:</label><br></br>
                    <textarea type="topic" id="topic" name="Topic" placeholder="Topic..."></textarea>

                    <br></br><label htmlFor="email">Message:</label><br></br>
                    <textarea id="message" name="Message" placeholder="Enter your message here..." rows="10" cols="69"></textarea>

                    <br></br><label htmlFor="encrypted">Encrypt</label>
                    <input type="checkbox" id="encryptxbox" className="my_input" onClick={e => this.encryptedMsg(e)}></input>
                    <br></br>
                    <br></br><label htmlFor="crypted">Encrypted Message:</label><br></br>
                    <textarea id="crypted" name="crypted" placeholder="Enter your message here..." rows="10" cols="69"></textarea>

                    <br></br><label htmlFor="decrypted">Decrypt</label><br></br>
                    <input type="checkbox" id="decryptxbox" className="my_input" onClick={e => this.decryptedMsg(e)} ></input>

                    <br></br><label htmlFor="decrypted">Decrypted Message:</label><br></br>
                    <textarea id="decrypted" name="decrypted" placeholder="Enter your message here..." rows="10" cols="69" ></textarea>
                    <p>
                        <button type="reset" className="btn-res" value="Reset" onClick={e => this.clearAll(e)}>RESET</button>
                    </p>
                    <strong id="isvalid" className="isvalid"></strong>
                    <strong id="isnotvalid" className="isnotvalid"></strong>
                    <p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={e => this.sendMail(e)}
                        >Send
                        </button>
                    </p>
                </div> : null
        );
    }
}
export default EmailForm;