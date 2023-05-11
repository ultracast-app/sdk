![UltraCaast](resources/logo_horizontal.png)
# Install

`yarn add ultracast-app/sdk`

# Request your credentials

To request your clientKey and secretKey credentials, please send an email to [ultracastapp@gmail.com](mailto:ultracastapp@gmail.com) specifying the URL and nature of your website.

Warning: illegal or pornographic sites are not allowed.

# Usage example

## SDK Javascript - client side only
```javascript
import UltraCast from 'ultracast-sdk'

const ultraCast = new UltraCast({
    clientKey: 'YOUR_CLIENT_KEY', //Required
    tvUUID: 'FINDED_TV_UUID', //Required
    fastForwardRewindTime: 10,

    onConnect: (ultraCast) => ultraCast.setPlayer({
        meta: {
            title: 'CONTENT TITLE',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis urna eleifend aliquam finibus. Sed vitae libero risus. Quisque vel ligula et arcu sodales dapibus eu at mi. Morbi venenatis lacinia tortor, id fringilla purus auctor at. Aliquam lacinia nunc magna. Pellentesque egestas dolor vitae ex tincidunt euismod. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nunc quis est tortor. Quisque tristique sapien non nibh blandit bibendum. Morbi quis tortor mollis libero sollicitudin luctus.',
            poster: 'https://www.fillmurray.com/200/300',
            backdrop: 'https://www.fillmurray.com/1920/1080',
            startTime: 0
        },
        source: {
            src: 'http://brenopolanski.github.io/html5-video-webvtt-example/MIB2.mp4', //required
            type: 'video/mp4' //required
        },
        track: [
            {
                src: 'http://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt',
                srclang: 'pt',
                label: 'pt',
                kind: 'subtitles',
                default: true
            }
        ]
    }),
    onPlay: () => console.log('Playing'),
    onPause: () => console.log('Paused'),
    onProgress: ( ultraCast, {time} ) => console.log('Progress', time),
    onSeek: ( ultraCast, {time} ) => console.log('Seek', time),
    onDuration: ( ultraCast, {duration} ) => console.log('Duration', duration),
    onPlayerVisibilityChanged: ( ultraCast, {visible} ) => console.log('Is player visible?', visible),
    onClientDisconnect: ( ultraCast, {uuid, reason} ) => console.log('Client (TV) Disconnected', {uuid, reason}),
    onLoadedData: ( ultraCast ) => {
        console.log('Data loaded');
        //ultraCast.seek(120);
    },
    onCanPlay: ( ultraCast ) => {
        console.log('Player can play');
        //ultraCast.seek(120);
    }
});

ultraCast.connect();

/*
 * ultraCast.isConnected (bool)
 * ultraCast.currentState (played|paused)
 * ultraCast.currentTime (float)
 * ultraCast.duration (float)
 */

document.getElementById('playButton').addEventListener('click', () => {
    ultraCast.play();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    ultraCast.pause();
});

document.getElementById('forwardButton').addEventListener('click', () => {
    ultraCast.forward();
});

document.getElementById('backwardButton').addEventListener('click', () => {
    ultraCast.backward();
});

document.getElementById('seekButton').addEventListener('click', () => {
    ultraCast.seek(10);
});

document.getElementById('disconnectButton').addEventListener('click', () => {
    ultraCast.disconnect();
});
```

## Search for connected clients (TVs) - Server Side Only

---

⚠️ **Please be advised: do not use these API calls directly on your client, you could expose your private key and be immediately banned from the service.**

---

ℹ️ **To request your API credentials please contact us at ultracastapp@gmail.com**

---

The search for any connected clients (TVs) is done through a REST endpoint.

Endpoint: https://rest.ultracast.app/api/getClients
Method: GET

| Parameter    | Required | Description                             |
|--------------|:--------:|-----------------------------------------|
| `clientKey`  |     ✅    | Provided in the UltraCast.app dashboard |
| `secretKey`  |     ✅    | Provided in the UltraCast.app dashboard |
| `ip_address` |     ✅    | IP address of the user                  |

Example of request with cURL:

```curl
curl 'https://rest.ultracast.app/api/getClients?clientKey=YOUR_CLIENT_KEY&secretKey=YOUR_SECRET_KEY&ip_address=IP_OF_THE_USER'
```

Example of the result of the request:

```json
{
   "error": false,
   "clients": [
      {
         "user_agent":"TV_USER_AGENT",
         "uuid":"TV_UUID",
         "device": {
           "manufacturer": "MANUFACTURER",
           "model": "MODEL",
           "platform": "PLATFORM",
           "version": "VERSION",
           "uuid": "UNIQUE IDENTIFIER"
         },
         "screenSize": { //Please use this to send videos in the correct format.
           "width": 1920,
           "height": 1080
         }
      }
   ]
}
```