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
            your_pairs: [],
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
            alert("Invalid email address...")
            this.setState({
                emailError: true
            })
        }
        else if (message.trim() == '') {
            alert("Please, enter a message!");
        }
        else if (encrypted_message.trim() == '') {
            alert("Message must be encrypted with the other peer's public key, before it's sent to this peer!");
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
        document.getElementById("encryptxbox").checked = false;
        var Msg = document.getElementById('message').value;
        var my_pkey = document.getElementById("pub_other_peer_pkey").value
        crypt.setKey(my_pkey)
        if (Msg != '') {
            document.getElementById("crypted").value = crypt.encrypt(Msg);
        } else if (Msg == '') {
            alert("Can't encrypt an empty message!")
        }
        if (Msg != '' && crypt.encrypt(Msg) == false) {
            if (my_pkey == '') {
                alert("Encryption failed! Other peer's public key is not defined.")
            }
            else if (!(my_pkey.trim().startsWith("-----BEGIN PUBLIC KEY-----")) &&
                !(my_pkey.trim().endsWith("-----END PUBLIC KEY-----"))) {
                alert("Encryption failed! Other peer's public key is invalid.");
            }
            document.getElementById("crypted").value = '';
        } else if (Msg != '' && crypt.encrypt(Msg) != false) {

            document.getElementById("encryptxbox").disabled = true;
            document.getElementById("encryptxbox").checked = true;
        }
    }

    decryptedMsg() {
        var crypt = new JSEncrypt();
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "");
        }
        var email = document.getElementById('email_address').value;
        var pkey = document.getElementById('public_key').value;
        var pass = document.getElementById('passphrase').value;
        var cryptedMsg = document.getElementById('crypted').value;
        var my_prkey = document.getElementById('privkey').value;
        $('#isnotvalid').text('');
        $('#isvalid').text('');
        crypt.setKey(my_prkey)
        if (cryptedMsg.trim() == '') {
            alert("Can't decrypt an empty encrypted message!");
            document.getElementById("decryptxbox").checked = false;
        }
        else if (cryptedMsg.trim() != '' && crypt.decrypt(cryptedMsg, pass) == false) {
            if (my_prkey.trim() == '') {
                alert("Decryption failed! Your private key is not defined.")
                document.getElementById("decryptxbox").checked = false;
            }
            else if (!(my_prkey.trim().startsWith("-----BEGIN RSA PRIVATE KEY-----")) &&
                !(my_prkey.trim().endsWith("-----END RSA PRIVATE KEY-----"))) {
                alert("Decryption failed! Your private key is invalid.");
                document.getElementById("decryptxbox").checked = false;
            }

        }
        else if (crypt.decrypt(cryptedMsg, pass) == null) {
            $('#isnotvalid').text('Pair could not be validated! Invalid encrypted message.');
            document.getElementById("decryptxbox").checked = false;
            console.log('The following pair could not be validated and can not be added in the database: {Email:', email, ', Public key: ', pkey, '}');
        }
        else if (crypt.decrypt(cryptedMsg, pass) != null) {
            document.getElementById("decrypted").value = crypt.decrypt(cryptedMsg, pass);
            document.getElementById("decryptxbox").disabled = true;
            document.getElementById("decryptxbox").checked = true;
            $('#isvalid').text('Pair is validated!');
            console.log('The following pair is validated and can be added to the decentralized database: {Email:', email, ', Public key: ', pkey, '}');
        }


    }

    clearAll() {
        document.getElementById("recepient_email").value = '';
        document.getElementById("topic").value = '';
        document.getElementById("message").value = '';
        document.getElementById("crypted").value = '';
        document.getElementById("decrypted").value = '';
        document.getElementById("encryptxbox").checked = false;
        document.getElementById("decryptxbox").checked = false;
        document.getElementById("encryptxbox").disabled = false;
        document.getElementById("decryptxbox").disabled = false;
        //document.getElementById("decryptxbox").disabled = false;
        $('#isvalid').text('')
        $('#isnotvalid').text('')
    }

    render() {

        const { person } = this.state;
        const { userSession } = this.props;

        return (


            !userSession.isSignInPending() && person ?
                <div id="Send an email (Validation Process)" className="tabcontent">

                    <br /><label htmlFor="email">To:</label><br />
                    <input type="email" id="recepient_email" className="recepient-email" name="email" placeholder="Enter your email..." />

                    <br /><label htmlFor="email">Topic:</label><br />
                    <textarea type="topic" id="topic" name="Topic" placeholder="Topic..." rows="3" cols="69"></textarea>

                    <br /><label htmlFor="email">Message:</label><br />
                    <textarea id="message" name="Message" placeholder="Enter your message here..." rows="10" cols="69"></textarea>

                    <br /><label htmlFor="encrypted">Encrypt</label>
                    <input type="checkbox" id="encryptxbox" className="my_input" onClick={e => this.encryptedMsg(e)}></input>

                    <br />
                    <br /><label htmlFor="cryptednsg">Encrypted Message:</label><br />
                    <textarea id="crypted" name="cryptedmsg" placeholder="Enter your message here..." rows="10" cols="69"></textarea>

                    <br /><label htmlFor="decrypted_">Decrypt</label>
                    <input type="checkbox" id="decryptxbox" className="my_input" onClick={e => this.decryptedMsg(e)} ></input>
                    <br />
                    <br /><label htmlFor="decrypted">Decrypted Message:</label><br />
                    <textarea id="decrypted" name="decrypted" placeholder="Enter your message here..." rows="10" cols="69" disabled></textarea>
                    <br /><strong id="isvalid" className="isvalid"></strong>
                    <strong id="isnotvalid" className="isnotvalid"></strong>

                    <br />
                    <button type="reset" id="reset" className="btn-res" value="Reset" onClick={e => this.clearAll(e)} >Reset</button>
                    <br />
                    <button className="btn btn-primary btn-lg" id="send" onClick={e => this.sendMail(e)} >Send</button>

                </div> : null
        );
    }
}
export default EmailForm;