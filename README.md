<h1 style="
  text-align: center;
  font-size: 3em;
  font-weight: bold;
  padding: 3rem;
  color: white;
  background: linear-gradient(45deg, #0052D4, #4364F7, #6FB1FC);
  font-family: 'Segoe UI', sans-serif;
">
  jws-server
</h1>

![npm version](https://img.shields.io/npm/v/YOUR_PACKAGE_NAME?style=flat-square)
![Node.js LTS](https://img.shields.io/node/v/YOUR_PACKAGE_NAME?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

jws-server, short for **JSON WebSocket server** This project is a lightweight Node.js CLI tool for mocking WebSocket backends using a
simple JSON configuration file. Inspired by [json-server][json-server], it allows developers to simulate
real-time WebSocket interactions without needing to run a full backend server <br>

<!-- TOC -->
  * [Installation](#installation)
  * [Getting Started](#getting-started)
    * [Configuration Options](#configuration-options)
  * [Versioning & Release Policy](#versioning--release-policy)
    * [Node.js LTS Alignment](#nodejs-lts-alignment)
<!-- TOC -->

## Installation

```bash
npm install -g jws-server
```

## Getting Started

Create a `jws-spec.json` file to define your WebSocket message spec:

```json
{
  "messages": [
    {
      "content": {
        "payload": "ping",
        "contentType": "text/plain"
      },
      "response": {
        "payload": "706f6e67",
        "encoding": "hex",
        "contentType": "application/octet-stream"
      }
    }
  ]
}
```

Then run the server:

```bash
jws-server -p 8080 jws-spec.json
```

Your WebSocket client can now connect to `ws://localhost:8080` and interact with the mock server

### Configuration Options

| Option          | Description                                         | Default     |
|-----------------|:----------------------------------------------------|:------------|
| `-h  --help`    | Print usage                                         | -           |
| `-V, --version` | Print version information                           | -           |
| `-p, --port`    | Port to run the WebSocket server on                 | `3000`      |
| `-H, --host`    | hostname or IP address to bind  WebSocket server to | `localhost` |


## Versioning & Release Policy

Jws-server uses [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`) to indicate the level of changes
introduced by each release

The version number is incremented based on the level of change included in the release

| **Release Type**  | **Description**                                                                                                                          |
|:------------------|:-----------------------------------------------------------------------------------------------------------------------------------------|
| **Major release** | Introduces breaking changes or updates to support a new Node.js LTS version when the current LTS reaches end-of-life                     |
| **Minor release** | Adds backwards‑compatible new features. Minor releases may also expand peer dependency support, but will not require dependency upgrades |
| **Patch release** | Low‑risk, bug‑fix releasesThese releases focus on resolving defects or making small, safe improvements without altering existing APIs    |

### Node.js LTS Alignment

Jws-server supports all actively maintained LTS versions of Node.js
Once a version reaches End-of-Life (EOL), support will be dropped in the next major release

**Node.js Compatibility Matrix**

| Version | Supported Node.js version | 
|---------|---------------------------|
| 1.x.x   | 22.x, 23.x, 24.x          |

---
Good luck, And may your coffee be strong and your stacktrace short

[json-server]: https://github.com/typicode/json-server