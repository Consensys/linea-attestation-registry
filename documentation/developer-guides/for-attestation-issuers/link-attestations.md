# Link Attestations

## Using the Relationship Schema

Linking two attestations together is relatively straightforward.  It involves creating another attestation based on a specific schema called the  `Relationship` schema.

The `Relationship` schema looks like the following:

`bytes subject, string predicate, bytes32 object`

The schema id for the relationship schema is:

`0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0`

This `Relationship` schema exists as a first class citizen of the registry, and attestations that are based on this schema are used for linking other attestations together.  The `subject` field is the attestation that is being linked to another attestation, the `predicate` field is a name that describes the _type_ of relationship, and the `subject` is the attestation being linked to.

Examples of relationship attestations are:

* `0x46582...` "isFollowerOf" `0x10345...`
* `0x31235...` "hasVotedFor" `0x52991...`
* `0x74851...` "isAlumniOf" `0x31122...`

Anyone can create any type of relationship between any attestation and any number of other attestations, allowing for the emergence of an organic [folksonomy](https://en.wikipedia.org/wiki/Folksonomy).  However, it also makes canonical relationships important to define in the schema, as otherwise there will be ambiguity between which relationship attestations were intended by the attestation issuer, and which were relationship attestations that were arbitrarily added later by third parties.

{% hint style="info" %}
The schema id for the relationship schema is:

`0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0`
{% endhint %}

## One-to-One, One-to-Many, Many-to-Many

You can create as many `Relationship` attestations as you want, so that one attestation can be related to many other attestations, and vice-versa.

***

## Triples, Quads and Named Graphs

Many readers will have recognised that the Relationship schema is actually just an [RDF triple](https://en.wikipedia.org/wiki/Semantic\_triple).  The fact that RDF triples are used to link attestations to each other means that the on-chain attestation data can easily be indexed into a graph DB and can be serialized using RDFS, OWL, Turtle etc.

Certain use cases may require that relationships to be grouped together into a "named graph".  This allows for ring-fencing a certain group of links, in order to single them out, or label / identify them among the many other relationships that may exist between two or more attestations.  In this case there is a special `namedGraphRelationship` schema that can be utilized, which looks like:

`string namedGraph, bytes32 subject, string predicate, bytes32 object`

{% hint style="info" %}
The schema id for the named graph relationship schema is:

`0x5003a7832fa2734780a5bf6a1f3940b84c0c66a398e62dd4e7f183fdbc7da6ee`
{% endhint %}

