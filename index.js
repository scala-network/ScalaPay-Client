exports.init = (key) => {
    var RequestHandler = require('./lib/requestHandler');
    var Config = require('./lib/config');

    return new RequestHandler(new Config(key));
}