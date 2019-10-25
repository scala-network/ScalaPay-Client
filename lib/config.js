/**
 * Store user token
 * @param {object} credentials for scalapay api
 */
function ConnectionConfig(credentials) {
    this.key = credentials.key;
}

module.exports = ConnectionConfig;
