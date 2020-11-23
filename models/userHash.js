var crypto = require("crypto");

module.exports.hashPasswordToSHA256 = function(input) {
    let sha256 = crypto.createHash("sha256");
    sha256.update(input, "utf8");
    let result = sha256.digest("base64");
    return result;
}