const crypto = require("node:crypto");
//SECRET KEY FOR JSON WEB TOKEN
console.log(crypto.randomBytes(16).toString("hex"));
