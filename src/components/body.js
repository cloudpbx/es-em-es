const request = require("request");

const headers = {
  "X-Profile-Secret": "oJ1ux5eIH5BXEp8ubv2CVDKQ"
};

const payload = {
  from: "+17786542857",
  to: "+1604355169",
  body: "Hello, world!"
};

export function sendMessage() {
  request.post(
    {
      url: "https://sms.telnyx.com/messages",
      headers: headers,
      json: payload
    },
    function(err, resp, body) {
      console.log("error:", err);
      console.log("statusCode:", resp && resp.statusCode);
      console.log("body:", body);
    }
  );
}
