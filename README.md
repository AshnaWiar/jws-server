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

[![Build](https://github.com/AshnaWiar/jws-server/actions/workflows/build.yml/badge.svg)](https://github.com/AshnaWiar/jws-server/actions/workflows/build.yml)
![badge-npm]
![badge-node]
![badge-license]

jws-server, short for **JSON WebSocket server** This project is a lightweight Node.js CLI tool for mocking WebSocket
server using a simple JSON configuration file. Inspired by [json-server], it allows developers to simulate
real-time WebSocket interactions without needing to run a full backend server <br>

<!-- TOC -->
  * [Installation](#installation)
  * [Getting started](#getting-started)
    * [Configuration options](#configuration-options)
  * [Versioning & Release policy](#versioning--release-policy)
    * [Node.js LTS alignment](#nodejs-lts-alignment)
<!-- TOC -->

## Installation

```bash
npm install -g jws-server
```

## Getting started

Create a `jws-spec.json` file to define your WebSocket message spec:

```json
{
  "messages": [
    {
      "content": {
        "payload": "ping",
        "encoding": "utf8",
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
jws-server -p 3000 jws-spec.json
```

Your WebSocket client can now connect to `ws://localhost:3000` and interact with the mock server

### Configuration options

| Option          | Description               | Default     |
|-----------------|:--------------------------|:------------|
| `-h  --help`    | Print usage               | -           |
| `-V, --version` | Print version             | -           |
| `-V, --verbose` | Print verbose logging     | -           |
| `--no-color`    | Print version information | -           |
| `-p, --port`    | WebSocket server port     | `3000`      |
| `-H, --host`    | WebSocket server hostname | `localhost` |

## Versioning & Release policy

Jws-server follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`) to indicate the level of changes
introduced by each release

The version number is incremented based on the level of change included in the release

| **Release type**  | **Description**                                                                                                                          |
|:------------------|:-----------------------------------------------------------------------------------------------------------------------------------------|
| **Major release** | Introduces breaking changes or updates to support a new Node.js LTS version when the current LTS reaches end-of-life                     |
| **Minor release** | Adds backwards‑compatible new features. Minor releases may also expand peer dependency support, but will not require dependency upgrades |
| **Patch release** | Low‑risk, bug‑fix releasesThese releases focus on resolving defects or making small, safe improvements without altering existing APIs    |

### Node.js LTS alignment

Jws-server supports all actively maintained LTS versions of Node.js
Once a version reaches End-of-Life (EOL), support will be dropped in the next major release

**Node.js compatibility matrix**

| Supported Node.js version | Version |
|---------------------------|---------|
| 22.x, 23.x, 24.x          | 1.x.x   |

---
May your builds be fast, your bugs be few, and your console always readable

[json-server]:      https://github.com/typicode/json-server

[badge-npm]:        https://img.shields.io/npm/v/jws-server?style=flat-square

[badge-node]:       https://img.shields.io/node/v/jws-server?style=flat-square

[badge-license]:    https://img.shields.io/badge/License-MIT-yellow.svg
