const telnyx = require('telnyx')('KEY016EC7DF1D08F8D9FEC2FCE0263B0811_LpK2t8vlrGx2TypnqsfrZz');

export const sendMessage = (msg) => {
    return telnyx.messages.create({
        'from': '+17786542857', // Your Telnyx number
        'to': '+16043551695',
        'text': msg
    }).then(function(response){
      const message = response.data; // asynchronously handled
      console.log(message);
    });
}

