# Encoding Attestation Data

Attestation data is encoded according to the Schema the Attestation is associated with. The Schema is parsed by the
client reading the Attestation, in a way that results in a series of data types that can be used to `abi.decode` the
attestation data. In order for this to happen, the Attestation data must first be encoded using `abi.encode`.

{% hint style="warning" %} The SDK offers a much easier to encode a JSON object into attestation data. However, this
information outlines the low-level steps required to encode attestation data. {% endhint %}

## Modelling a Schema as a Solidity Struct

The easiest way to think of a Schema is like a Solidity struct. Let's consider a simple Schema:

`(string username, string teamname, uint16 points, bool active)`

This can be thought of as a struct:

```solidity
struct Profile {
  string username;
  string teamname;
  uint16 points;
  bool active;
}
```

If we were to encode an attestation that references this schema, we could do it client side using the **ethers** library
(or equivalent):

```javascript
const encodedStruct = ethers.utils.defaultAbiCoder.encode(
  ["string", "string", "uint16", "bool"],
  ["bojo", "torries", 3, false],
);
```

This can later be decoded by some off-chain client, with the subgraph, or by another on-chain contract using Solidity:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StructDecodingExample {
  struct Profile {
    string username;
    string teamname;
    uint16 points;
    bool active;
  }

  function receiveEncodedStruct(bytes memory encodedStruct) public pure returns (gamer memory) {
    Profile memory gamer;

    // Decode the struct using abi.decode
    (gamer.username, gamer.teamname, gamer.points, gamer.active) = abi.decode(
      encodedStruct,
      (string, string, uint16, bool)
    );

    return gamer;
  }
}
```

## Encoding Nested Data

Sometimes a schema is a bit more complicated, in that it contains more than just a flat data structure, and may contain
nested data structure like so:

{% code overflow="wrap" %}

```
(string username, string teamname, uint16 points, bool active, ( string gametype, string gamemode ) preferences)
```

{% endcode %}

Which can be thought of as this nested struct:

```solidity
struct Preferences {
  string gametype;
  string gamemode;
}

struct Profile {
  string username;
  string teamname;
  uint16 points;
  bool active;
  Preferences setup;
}
```

Again, encoding the attestation for this schema using a client side library such as ethers would look like this:

```javascript
const encodedStruct = ethers.utils.defaultAbiCoder.encode(
  ["string", "string", "uint16", "bool", "tuple(string gametype, string gamemode)"],
  ["bojo", "torries", 3, false, { gametype: "RPG", gamemode: "multiplayer" }],
);
```

## Encoding Arrays

Encoding arrays within attestation data is also straightforward, let's use the example before, but with arrays:

<pre data-overflow="wrap"><code><strong>(string username, string teamname, uint16 points, bool active, ( string[] gametype, string[] gamemode ) preferences)
</strong></code></pre>

Which can be thought of as this nested struct:

```solidity
struct Preferences {
  string[] gametype;
  string[] gamemode;
}

struct Profile {
  string username;
  string teamname;
  uint16 points;
  bool active;
  Preferences setup;
}
```

Again, encoding the attestation for this schema using a client side library such as ethers would look like this:

```typescript
const encodedStruct = ethers.utils.defaultAbiCoder.encode(
  ["string", "string", "uint16", "bool", "tuple(string[] gametype, string[] gamemode)"],
  [
    "bojo",
    "torries",
    3,
    false,
    { gametype: ["RPG", "first-person-shooter", "racing"], gamemode: ["multiplayer", "singleplayer"] },
  ],
);
```
