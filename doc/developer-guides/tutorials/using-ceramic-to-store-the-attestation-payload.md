---
description: >-
  This repository shows how Ceramic can be used together with Verax on-chain attestations as an efficient storage
  mechanism for off-chain metadata. This brief codebase is intended to be an extension to
---

# Using Ceramic to store the Attestation Payload

## But First - What's the Reasoning?

Ceramic is a decentralized data network that offers strong provenance and censorship-resistant qualities one would
expect from a blockchain, with the cost efficiency, scalability, and querying capabilities one would compare to a
traditional database. Users of applications built on Ceramic authenticate themselves using a familiar "Sign in With
Ethereum" flow, and data those users create are forever solely controlled by the user accounts that created them. As a
protocol, Ceramic can be characterized as a multi-directional replication layer that enables multi-master, eventually
consistent databases to be built on top (such as
[ComposeDB](https://developers.ceramic.network/docs/composedb/getting-started)).

### What the Relation to On-Chain Attestations?

In an on-chain attestation context, it may be the case that an individual or entity would want to attest to data that is
inherently dynamic and subject to change. For example, within the realm of identity, an individual is likely to take on
different roles, responsibilities, personas, and other self-defining characteristics over time. While that person could
attest to each change in their identity individually in the form of separate on-chain attestations, this would not only
incur cost inefficiencies from transaction fees over time, but would also make it incredibly difficult and inefficient
for data consumers (applications, for example) to query and leverage in a meaningful way.

### Why Would Ceramic Make Sense?

In Ceramic, data is organized into append-only event logs, with each new data event representing a change in that data
stream's state. When building with ComposeDB on Ceramic, developers can define schemas (usable by any participant node
in the network) that define the specific requirements of any stream's scalars that wish to implement that schema,
including restrictions on how many schema model instances a given user can have, what subfields must be included, and so
on. ComposeDB also uses GraphQL to offer developers a familiar, easy-to-use querying layer.

Finally, after the genesis commit (or initiating data event), a stream's ID will never change, no matter how many times
it's updated by the controlling account. This provides a suitable identifier for developers who wish to point on-chain
events to static off-chain identifiers.

For a more thorough dive on Ceramic's qualities, read
[Data Provenance in ComposeDB](https://blog.ceramic.network/data-provenance-composedb-as-an-authenticated-database/).

## Getting Started

This tutorial uses a simple example of a Developer Profile. Therefore, we will swap out several sections of
[this Verax tutorial](https://docs.ver.ax/verax-documentation/developer-guides/tutorials/from-a-schema-to-an-attestation)
to meet our custom use case.

This tutorial will also utilize an example demo application meant to run locally. We recommend cloning the repository to
your device and following along in your text editor of choice:

```bash
git clone https://github.com/ceramicstudio/verax-tutorial && cd verax-tutorial
```

Follow the instructions in the tutorial linked above (using Linea Testnet) until you reach the section labeled "3.
Create a Schema" (you can do so in a separate repository, or by creating a dummy file in this repository to follow the
steps).

The Verax schema we will be using for this tutorial will be intended to point to a Ceramic Stream ID. Therefore, to keep
things simple, we will define our Verax schema as follows:

```javascript
const SCHEMA = "(string ceramicProfileStream)";
```

Let's customize the metadata associated with our Verax schema as well:

```javascript
const txHash = await veraxSdk.schema.create(
  "Ceramic Tutorial Schema",
  "This Schema is used for the Ceramic tutorial and uses a ceramicProfileStream string to point to the Ceramic stream representing the users profile.",
  "Ceramic",
  SCHEMA,
);
```

_Note that there is also an existing_
[_**Offchain**_](https://explorer.ver.ax/linea/schemas/0xa288e257097a4bed4166c002cb6911713edacc88e30b6cb2b0104df9c365327d)
_schema that is used by other projects to create attestations where the payload is stored somewhere else._

You can continue following the instructions as the Verax tutorial entails until you reach "4. Create a Portal". We can
go ahead and customize this portion as well:

```javascript
const txHash = await veraxSdk.portal.deployDefaultPortal(
  [],
  "Ceramic Tutorial Portal",
  "This Portal is used for the Verax with Ceramic tutorial",
  true,
  "Verax with Ceramic Tutorial",
);
```

Navigate to line 156 of the
[profile](https://github.com/ceramicstudio/verax-tutorial/blob/main/src/components/profile.tsx) component and replace
the string you see with the transaction hash you obtained from creating your portal. This will ensure that your portal
ID is pulled each time you create an attestation.

You are finally ready to start creating attestations!

### Installing and Generating Ceramic Node Credentials

First, install your dependencies:

```
npm install
```

Once your dependencies are installed we will need to create a Ceramic node configuration, which will also require a node
admin DID. For this application, we're going to be running a local node configuration (for more on this, visit
[Running Locally](https://developers.ceramic.network/docs/composedb/guides/composedb-server/running-locally) in the
Ceramic docs).

While we won't go into detail around all the options available to you in this tutorial, the main takeaway is that our
server configuration dictates setting such as which SQL database our indexing protocol will use, whether we want our
IPFS service to run separately or bundled, and other details like that.

To keep things simple, we've created a script for you to use in order to create your configuration and admin DID. Simply
run the following in your terminal:

```
npm run generate
```

You should now see an admin seed and settings appear in both your
[admin_seed.txt](https://github.com/ceramicstudio/verax-tutorial/blob/main/admin_seed.txt) and
[composedb.config.json](https://github.com/ceramicstudio/verax-tutorial/blob/main/composedb.config.json) files.

Finally, let's make sure we're running the correct version of node:

```
nvm use 20
```

### Observe Our Data Models

As mentioned above, we will be using the paradigm of a developer profile for this tutorial. As such, we've defined a
very simple ComposeDB schema to meet this requirement. The following loosely based on the developer profile in the
attestations available from [Aspecta](https://aspecta.id/home):

```typescript
enum Proficiency {
  Beginner
  Intermediate
  Advanced
  Expert
}

type Language {
  JavaScript: Proficiency
  Python: Proficiency
  Rust: Proficiency
  Java: Proficiency
  Swift: Proficiency
  Go: Proficiency
  Cpp: Proficiency
  Scala: Proficiency
  WebAssembly: Proficiency
  Solidity: Proficiency
  Other: Proficiency
}

type DeveloperProfile
  @createModel(accountRelation: SINGLE, description: "A developer profile") {
  developer: DID! @documentAccount
  name: String! @string(maxLength: 100)
  languages: Language!
  description: String! @string(maxLength: 100000)
  projects: [String] @string(maxLength: 100) @list(maxLength: 10000)
}
```

Important things to note here:

- The `accountRelation: SINGLE` ensures that any given authenticated user can only ever create 1 instance of this data
  type (whereas `accountRelation: LIST` would allow users to create as many as they wanted)
- The `!` next to the scalar definition defines those fields as required. Therefore, a user could create a
  `DeveloperProfile` instance without any projects, if they wanted to

While this is not a particularly complex schema, we'll include several additional tutorials at the end of this document
you can explore that introduce additional complexity and cool features.

Finally, we've create a [script](https://github.com/ceramicstudio/verax-tutorial/blob/main/scripts/composites.mjs) for
you that deploys this definition onto your local node for you during the start-up sequence, and writes the composite
runtimes to our [**generated**](https://github.com/ceramicstudio/verax-tutorial/blob/main/src/__generated__) folder that
we'll use later to access our schema definitions. When running in production, your application would instead be using a
live node endpoint that has already endured this model deployment sequence, and therefore, the only artifact needed by
your production app would be the endpoint and the canonical .js composite runtime definition.

### Observe Our Authentication Methodology

Users write data to Ceramic in the form of
[user sessions](https://developers.ceramic.network/docs/composedb/guides/composedb-client/user-sessions) derived from a
"Sign in With Ethereum" flow. This action allows applications temporary access (default is a 24-hour period) to edit
Ceramic data on the authenticated user's behalf, and also defines limited scope solely for the models used for that
application. Our application will authenticate the user on our local node, and grant us access to create and edit the
`DeveloperProfile` data on the user's behalf.

If you look into the
[fragments index file](https://github.com/ceramicstudio/verax-tutorial/blob/main/src/fragments/index.tsx), you can see
this in action. More specifically, on line 47, you can see how we're creating a session with the limited scope over
`compose.resources` (taken from our imported runtime definition).

### Start Up Your Application

We're finally ready to start up the application! In your terminal (running node v20), run the following:

```
npm run dev
```

During the authentication sequence, you will see a special message that looks similar to this:

[![metamask sign in](https://github.com/ceramicstudio/verax-tutorial/raw/main/images/metamask.png)](https://github.com/ceramicstudio/verax-tutorial/blob/main/images/metamask.png)

After authenticating yourself (you will be prompted to move to Linea Testnet, by the way), you should see the following
in your browser:

[![verax profile card](https://github.com/ceramicstudio/verax-tutorial/raw/main/images/verax_home.png)](https://github.com/ceramicstudio/verax-tutorial/blob/main/images/verax_home.png)

Fill in some profile information including your name, programming languages + corresponding expertise, a description of
yourself, and a list of projects you're associated with.

Once ready, you can go ahead and submit your profile. You can also follow along in the
[profile](https://github.com/ceramicstudio/verax-tutorial/blob/main/src/components/profile.tsx) component, starting with
the invocation of `createCeramicDoc` on line 64. You'll notice that were using our newly defined state variables in our
ComposeDB mutation query. If our mutation is successful, we obtain the Ceramic Stream ID from the document we just
created/mutated, and move on to `createVeraxAttestation` on line 141.

Since you've already edited line 156 to align with your portal's creation hash, your `portalAddress` on line 161 will be
defined as your portal's unique contract address. More importantly, notice how we're using the `id` (Ceramic Stream ID)
when defining our `attestationData` on line 171, thus creating a link between our immutable on-chain attestation and our
static Ceramic stream identifier.

Back in your UI, you should now be able to access two new buttons - one will show you your stream's raw data read
directly from your local node endpoint, and the other will take you to Linea Testnet Scan where you can observe the
on-chain transaction result (this link may take a few moments to work).

## Next Steps

Now that you've learned how to create an on-chain attestation to data on Ceramic that you can continue to mutate without
needing to create a new attestation, try altering the code in the
[profile](https://github.com/ceramicstudio/verax-tutorial/blob/main/src/components/profile.tsx) component to remove the
call to create a new on-chain attestation (you can simply comment out lines 135-137). Now, when you make changes to your
profile, your data lineage will be preserved and accessible by the static stream ID you recorded when creating your
on-chain attestation.

## Learn More

To learn more about Ceramic please visit the following links

- [Ceramic Documentation](https://developers.ceramic.network/learn/welcome/) - Learn more about the Ceramic Ecosystem.
- [ComposeDB](https://developers.ceramic.network/docs/composedb/getting-started) - Details on how to use and develop
  with ComposeDB!
- [Off-Chain EAS Attestations](https://docs.attest.sh/docs/tutorials/ceramic-storage) - Create off-chain attestations
  with EAS while using ComposeDB for storage and querying
- [Data Control Patterns in Decentralized Storage](https://blog.ceramic.network/data-control-patterns-in-decentralized-storage/) -
  Learn how different teams are taking advantage of various data control patterns in the dStorage space
- [AI Chatbot on ComposeDB](https://learnweb3.io/lessons/build-an-ai-chatbot-on-compose-db-and-the-ceramic-network) -
  Build an AI-powered Chatbot and save message history to ComposeDB
- [ComposeDB API Sandbox](https://developers.ceramic.network/sandbox) - Test GraphQL queries against a live dataset
  directly from your browser
- [Ceramic Blog](https://blog.ceramic.network/) - Browse technical tutorials and more on our blog
- [Ceramic Discord](https://discord.com/invite/ceramic) - Join the Ceramic Discord
- [Follow Ceramic on Twitter](https://twitter.com/ceramicnetwork) - Follow us on Twitter for latest announcements!
