const request = require("request");

const headers = {
  "X-Profile-Secret": "oJ1ux5eIH5BXEp8ubv2CVDKQ"
};

export function sendMessage(receiver, message) {
  const payload = {
    from: "+17786542857",
    to: `+1${receiver}`,
    body: message,
    delivery_status_webhook_url:
      "http://167.71.120.177:8080/webhook/oV2KDfSKNQb1SRMGsRzJ"
  };
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
