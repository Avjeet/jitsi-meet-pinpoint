# This is a modded version of jitsi-meet frontend
Mods
- Always hide toolbox (via `api.executeCommand('setToolboxBehavior', behavior)`;)
```
<button onclick="setToolboxBehavior('always-hide')">Toolbar Always Hide</button>
<button onclick="setToolboxBehavior('auto-hide')">Toolbar Auto Hide</button>
```
- Auto-allow remote control
This auto-allows remote control automatically in 5 seconds, without the user's input

- Remove jitsi logo watermarks on iframe

- Allow manually building Ubuntu .deb package

Follow https://community.jitsi.org/t/how-to-how-to-build-jitsi-meet-from-source-a-developers-guide/75422
and
https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-web-jitsi-meet
