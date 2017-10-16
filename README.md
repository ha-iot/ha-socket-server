<!-- The blank line below the opening "div" just makes it work -->
<div align="center">

# HAIoT - Socket Server

A server to help users handle its hardware handlers.

[![Build Status][travis_badge]][travis_link]
[![codecov][codecov_badge]][codecov_link]
![David DM][david_dependencies]
</div>

## HAIoT System

This is part of the **HAIoT System** for house automation.

- [Hardware Handler][hardware_handler_link]
- [Frontend App][frontend_app_link]

## Development

At the end of the next steps, a server will be up and running on your [local 3003 port](http://localhost:3003/)
(but you can change this [at environment level](.env.example)).

```bash
git clone https://github.com/ha-iot/ha-socket-server/
npm i
npm start
```

## Testing

```bash
npm test
```

[hardware_handler_link]: https://github.com/ha-iot/hardware-handler/
[frontend_app_link]: https://github.com/ha-iot/ha-frontend/
[travis_badge]: https://travis-ci.org/ha-iot/ha-socket-server.svg?branch=master
[travis_link]: https://travis-ci.org/ha-iot/ha-socket-server
[codecov_badge]: https://codecov.io/gh/ha-iot/ha-socket-server/branch/master/graph/badge.svg
[codecov_link]: https://codecov.io/gh/ha-iot/ha-socket-server
[david_dependencies]: https://david-dm.org/ha-iot/ha-socket-server.svg
