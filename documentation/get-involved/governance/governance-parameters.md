# Governance Parameters

1. **Multi-sigs**\
   \
   Instances of the attestation registry on each network will be governed by a multi-sig.  Signers of the multi-sig will be members of the core council.\
   \
   Thresholds will be 2 of 5 for deployments.\

2. **Core Council**\
   \
   Core contributors initially, i.e.:\
   \
   &#x20; \-  Clique\
   &#x20; \-  Consensys\
   &#x20; \-  Pado Labs\
   &#x20; \-  Hapi\
   &#x20; \-  Aspecta\

3. **Voting Weights**\
   \
   &#x20; \-  All votes (i.e. both stakeholder and core council) will be weighted equally.\

4. A**daptive Quorum**\
   \
   &#x20; \-  Issuers onboarding (Allowlist gating access) C = 0  (routine)\
   &#x20; \-  Minting voting NFTs to new members\
   &#x20; \-  Improvement proposals C = 0  (routine)\
   &#x20; \-  Code instances C = 1  (critical)\
   &#x20; \-  Cross-chain deployment C = 1  (critical)\
   &#x20; \-  Large operational changes C = 1  (critical)\
   &#x20; \-  Initial grant distribution C = 0  (routine)\

5. **Time decay on NFTs**\
   \
   If an NFT has not been used to vote on anything in three months, it will become inactive and can not be used for voting.  This is to encourage participation in the voting process. \

6. **Cadence of meeting for core council**\
   \
   Meetings of the core council will be held bi-weekly initially, subject to review to adjust cadence.  Meeting notes will be published to the community forum.\

7. **Contributor Responsibilities**\
   \
   &#x20; \-  Reviewing, discussing and voting on improvement proposals\
   &#x20; \-  Managing deployments via multi-sigs\
   &#x20; \-  Maintenance of tooling (explorer, discourse, discord, socials)\
   &#x20; \-  Answer inbound questions about Verax - helping to onboard new integrations\
   &#x20; \-  Voting on new issuer applications\

8. **Proposal Lifecycle**\
   \
   New proposals will adhere to a prescribe lifecycle, that is laid out as follows:

* **Discussion period once the proposal has been published: 2 weeks minimum.**\
  \
  This will be the initial discussion period during which an improvement proposal should not be voted on or implemented.  This is to ensure that all stakeholders have sufficient time to see the proposal and formulate a response, should they wish to.  This should allow enough time to give confidence that the proposal has had adequate amount of discussion within the community.\

* **Voting period - 1 week**\
  \
  This is to ensure that all stakeholders have had a chance to vote on the proposal once the discussion period has passed.  This is to allow for teams that might be traveling, or busy, or have public holidays etc.\

* **Implementation gap - 1 week minimum**\
  \
  This is the amount of time between proposals being passed and being implemented.  This gap is to give stakeholders enough time to prepare in the case that the passed proposal affects them in some way, and to give the core council adequate time to respond to critical issues around governance that may need to be addressed.

### Issuer Onboarding Lifecycle

Applications onboard as issuers have a compressed lifecycle in order to avoid there being a month’s delay in integrating with the protocol.  For that reason, onboarding new issuers follows the following lifecycle:

* Discussion period once the proposal has been published - 2 days
* Voting Period - 2 days (minimum)
* Implementation gap: 2 days

## Proposal process

Submitting an improvement proposal involves publishing a post on the community forum under the “Improvement Proposals” section.  Improvement proposals can cover a range of areas, including, but limited to:

* New features or functionality, either in smart contracts, subgraphs, explorer, SDK etc.
* Changes to existing data structures, user workflows, or architecture
* Changes to governance, including lifecycles, voting mechanisms etc.
* Changes to peripheral infrastructure, including operation of public forums.
* Deployment to new networks

Improvement proposals must be composed using the standard improvement proposal template, or may be rejected.  Once submitted, the OP is expected to answer any questions and to participate in the forum discussion.

## Issuer Onboarding

Becoming an issuer of attestations requires that you submit an application to governance.  This should be done by the public forum and will be voted on by existing contributors and members.  The application should be submitted in the “Issuer Onboarding” section of the forum, and should be based on the standard template.\
\
The details required are the URL of the project website, and documentation, and a description of the attestations you plan on issuing, and the proposed data structure of the attestations.\
\
Please feel free to reach out to any of the core contributors directly if you'd like to discuss onboarding in more detail beforehand or if you have any questions. Onboarding is usually simple and frictionless.\
\
