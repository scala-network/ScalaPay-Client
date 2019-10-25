const request = require("request");

module.exports = RequestHandler;

function RequestHandler(credential){
    this.key            = credential.key;
    this.url            = "https://api.scalapay.io";
    this.version        = "v1";

    /* Access Token */
    this.accessToken    = 0;
    this.keyExpire      = 0;
    this.keyCreated     = Math.floor(Date.now()/1000);

    /* Errors */
    this.error = [
        "Not logged in" //Not logged in
    ];
}

/**
 * Test if the user is logged in
 */
RequestHandler.prototype.isAuth = function isAuth() {
    if(this.accessToken == 0 || (this.keyCreated + this.keyExpire < Math.floor(Date.now()/1000))){
        return false;
    }
    return true;
}

/**
 * Test if the user is logged in
 */
RequestHandler.prototype.test = function test(callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
}

/**
 * Login User
 */
RequestHandler.prototype.login = function login(email, password, callback) {
    var options = {
        url: this.url + '/' + this.version + '/login',
        headers: {
            'Content-Type':'application/json'
        },
        method: 'POST',
        form: {
            email: email,
            password: password,
            key: this.key
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }
        body = JSON.parse(body);
        
        if(body.status == "success"){
            this.keyExpire = body.message.expires_in;
            this.keyCreated = Math.floor(Date.now()/1000);
            this.accessToken = body.message.access_token
        }

        return callback(null, body);
    });
};

/**
 * Login User with 2FA
 */
RequestHandler.prototype.login2FA = function login2FA(email, password, tfa, callback) {
    var options = {
        url: this.url + '/' + this.version + '/login',
        headers: {
            'Content-Type':'application/json'
        },
        method: 'POST',
        form: {
            email: email,
            password: password,
            key: this.key,
            '2fa': tfa
        }
    };

    request(options, (error, response, body) => {

        if(error){
            console.log("Error: " + error);
            return callback(error);
        }
        body = JSON.parse(body);

        if(body.status == "success"){
            this.keyExpire = body.message.expires_in;
            this.keyCreated = Math.floor(Date.now()/1000);
            this.accessToken = body.message.access_token
        }
        
        return callback(null, body);
    });
};

/**
 * Register new User
 */
RequestHandler.prototype.register = function register(name, email, password, callback) {
    var options = {
        url: this.url + '/' + this.version + '/register',
        headers: {
            'Content-Type':'application/json'
        },
        method: 'POST',
        form: {
            user : {
                name: name,
                email: email,
                password: password,
                key: this.key
            }
        }
    };

    request(options, (error, response, body) => {

        if(error){
            console.log("Error: " + error);
            return callback(error);
        }
        body = JSON.parse(body);

        if(body.status == "success"){
            this.keyExpire = body.message.expires_in;
            this.keyCreated = Math.floor(Date.now()/1000);
            this.accessToken = body.message.access_token
        }
        
        return callback(null, body);
    });
};

/**
 * Send reset-email
 */
RequestHandler.prototype.sendResetEmail = function sendResetEmail(email, callback) {
    var options = {
        url: this.url + '/' + this.version + '/sendresetemail',
        headers: {
            'Content-Type':'application/json'
        },
        method: 'POST',
        form: {
            email: email,
            key: this.key,
            ip: "none",
            http_request: "testing"
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Delete Account
 */
RequestHandler.prototype.deleteAccount = function deleteAccount(password, callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/delete_account',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'POST',
        form: {
            password: password
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Password Reset
 */
RequestHandler.prototype.passwordReset = function passwordReset(email, token, password, callback) {
    var options = {
        url: this.url + '/' + this.version + '/passwordreset',
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        form: {
            email: email,
            token: token,
            new_password: password,
            key: this.key
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Logout
 */
RequestHandler.prototype.logout = function logout(callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/logout',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'POST',
        form: {

        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Activate Account
 */
RequestHandler.prototype.activate = function activate(activate ,callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/activate',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'POST',
        form: {
            activate: activate
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};


/**
 * Get users balance
 */
RequestHandler.prototype.balance = function balance(callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/balance',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'GET'
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Get users account
 */
RequestHandler.prototype.user = function user(callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/user',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'GET'
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Query Transactions
 */
RequestHandler.prototype.transactions = function transactions(callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/transactions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'GET'
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Get users addressbook
 */
RequestHandler.prototype.getAddressbook = function getAddressbook(callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/addressbook',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'GET'
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Add a user to addressbook
 */
RequestHandler.prototype.addAddressbook = function addAddressbook(address, description, callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/addressbook',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'POST',
        form: {
            address: address,
            description: description
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Delete users addressbook entry
 */
RequestHandler.prototype.deleteAddressbook = function deleteAddressbook(address, callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/addressbook',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'DELETE',
        form: {
            address: address
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Search for users
 */
RequestHandler.prototype.search = function search(string, callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/addressbook',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'POST',
        form: {
           string: string
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Change ScalaPay Card
 */
RequestHandler.prototype.scalaPayCard = function scalaPayCard(activated, link, callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/fast_link',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'POST',
        form: {
            activated: activated,
            link: link
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Get all transactions
 */
RequestHandler.prototype.allTransactions = function allTransactions(callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/alltransactions',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'GET'
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Activate Google 2FA
 */
RequestHandler.prototype.activate2fa = function activate2fa(callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/activate2fa',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'GET'
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};

/**
 * Get all transactions
 */
RequestHandler.prototype.deactivate2fa = function deactivate2fa(code, callback) {
    if(!this.isAuth()){
        return callback(this.error[0]);
    }
    
    var options = {
        url: this.url + '/' + this.version + '/deactivate2fa',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.accessToken
        },
        method: 'POST',
        form: {
            g2fa: code
        }
    };

    request(options, (error, response, body) => {
        if(error){
            console.log("Error: " + error);
            return callback(error);
        }

        body = JSON.parse(body);
        
        return callback(null, body);
    });
};
