# 👋 Introduction

## Overview

Verax is a shared, public attestation registry that can deployed to EVM chains.  It can be used by dapps to store data that is of public interest, aka "attestations", that can be easily accessed and composed together by anyone that's interested. It is designed to be deployed as a single instance per network, so that all dapps on that network can issue their attestations to the same place, so that they can be easily discovered and consumed.

Attestations are usually statements made by an attestation issuer about something specific. They are also sometimes known as claims or credentials. Examples of attestations could include:

* Owner of address `0xbabe1999…` has completed a course on Solidity
* Contract at address `0x666bea5f…` is a malicious erc-20 token
* Owner of address `0xd00daa…` is a human being (i.e. not a bot)
* Owner of address `0xdeadbeef…` is a member of DimSumDAO
* Attestation `0xa2345` is a (in)valid attestation
* Attestation `0x98765` is a “like” for content stored at `0xa1b2c3d4…`

***

## How is Verax used?

**For issuers of attestations:**

If you are a dapp that offers credentials / attestations, you can choose to issue them to an existing Verax instance on a network.  Issuing to Verax gives access to your attestations to any dapp that reads from Verax.  Your attestation data becomes widely discoverable and easily consumed, as well as being easily composed with other attestations.  Your attestations can start receiving attestations themselves, allowing you to accrue reputation as a trusted datasource.

**For consumers of attestations:**

Your dapp can now compose attestations from multiple sources, meaning you now longer have to choose between issuer A or issuer B.  You can be sure that users of dapp can prove they are not a bot without being tied to a specific provider.  You can start to discover what type of users are interacting with your dapp, and start incentivizing them to onboard with your dapp through issuing attestations yourself!

**For reputation protocols:**

Start leveraging linked data and shared ontologies to easily create rich and powerful semantic graphs in order to provide your users with valuable insights and information.  Cut down hours of development of scraping data from disparate heterogenous sources and give your users fine-grained, nuanced and holistic reputation scores that have real meaning.

***

Dive in to the relevant section or go through the [High Level Overview](core-concepts/ecosystem.md) section to start learning more.

You can find out more information or contact any of the contributors on any of these channels:

* Discord: [https://discord.gg/Sq4EmYdBEk](https://discord.gg/Sq4EmYdBEk)
* Telegram: [https://t.me/+C94-EJOoVjVhM2U0](https://t.me/+C94-EJOoVjVhM2U0)
* GitHub: [https://github.com/Consensys/linea-attestation-registry](https://github.com/Consensys/linea-attestation-registry)

