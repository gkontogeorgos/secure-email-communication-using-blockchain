import React, { Component } from "react";

let crypt = null
let privateKey = null
let publickey = null


class GenerateKeys extends Component  {

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
      var async = $('#async-gen').is(':checked');
      var dt = new Date();
      var time = -(dt.getTime());
      var pass = document.getElementById("passphrase").value;
      if (pass == "") {
        $('#five-words').text('Passphrase must not be empty!');
      }
      else if (!(pass.split(" ").length > 4)) {
        $('#five-words').text('Passphrase must have at least 5 words!');
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


  clearContents() {
    document.getElementById("message").value = '';
    document.getElementById("crypted").value = '';
    document.getElementById("decrypted").value = '';
    document.getElementById("encryptxbox").checked = false;
    document.getElementById("decryptxbox").checked = false;
    $('#isvalid').text('')
    $('#isnotvalid').text('')
  }



  render() {

    

    return (

        <div className="container">


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
                  
                    <br></br>Key Size:
                    <select
                    id="key-size" type="button" data-value="2048" >
                    <option className="change-key-size" data-value="512">512 bits </option>
                      <option className="change-key-size" data-value="1024">1024 bits </option>
                      <option className="change-key-size" data-value="2048">2048 bits (recommended)</option>
                      <option className="change-key-size" data-value="4096">4096 bits </option>
                    </select>
                    
                    <br></br>
                    <label htmlFor="async-gen">Async
                      <input id="async-gen" type="checkbox"></input> 
                    </label>
                    

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
                      <textarea id="privkey" rows="15" cols="69"></textarea><br />

                    </div>
           
                </div>

         
          
        </div> 
    );
  }
}
export default GenerateKeys;