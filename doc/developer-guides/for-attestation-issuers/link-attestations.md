# Link Attestations

{% hint style="info" %} For now, linking Attestations must be done through a dedicated implementation to be created by
the developers. In the future, the Verax SDK will expose a dedicated method to do that more easily. {% endhint %}

## Using the Relationship Schema

Linking two Attestations together is relatively straightforward. It involves creating another Attestation based on a
specific Schema called the `Relationship` Schema.

The `Relationship` Schema looks like the following:

`(bytes subject, string predicate, bytes32 object)`

This `Relationship` Schema exists as a first-class citizen of the registry, and Attestations that are based on this
Schema are used for linking other Attestations together. The `subject` field is the Attestation that is being linked to
another Attestation, the `predicate` field is a name that describes the _type_ of relationship, and the `subject` is the
Attestation being linked to.

Examples of relationship Attestations are:

- `0x46582...` "isFollowerOf" `0x10345...`
- `0x31235...` "hasVotedFor" `0x52991...`
- `0x74851...` "isAlumniOf" `0x31122...`

Anyone can create any type of relationship between any Attestation and any other Attestations, allowing for the
emergence of an organic [folksonomy](https://en.wikipedia.org/wiki/Folksonomy). However, it also makes canonical
relationships important to define in the Schema. Otherwise, ambiguity may arise between the relationship Attestations
intended by the Attestation issuer, and those arbitrarily added later by third parties.

{% hint style="info" %} The schema ID for the relationship schema is:

`0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0`

It can be found on the
[Explorer](https://explorer.ver.ax/linea/schemas/0x89bd76e17fd84df8e1e448fa1b46dd8d97f7e8e806552b003f8386a5aebcb9f0).
{% endhint %}

## One-to-One, One-to-Many, Many-to-Many

You can create as many `Relationship` Attestations as you want, so that one Attestation can be related to many other
Attestations, and _vice versa_.

---

## Triples, Quads and Named Graphs

Many readers will have recognised that the Relationship Schema is actually just an
[RDF triple](https://en.wikipedia.org/wiki/Semantic_triple). RDF triples are used to link Attestations to each other,
which means that the on-chain Attestation data can easily be indexed into a graph DB and can be serialized using RDFS,
OWL, Turtle etc.

Certain use cases may require relationships to be grouped together into a "named graph". This allows for ring-fencing a
certain group of links, to single them out, or label / identify them among the many other relationships that may exist
between two or more Attestations. In this case, a special `namedGraphRelationship` Schema that can be utilized, which
looks like:

`(string namedGraph, bytes32 subject, string predicate, bytes32 object)`

{% hint style="info" %} The schema ID for the named graph relationship schema is:

`0x5003a7832fa2734780a5bf6a1f3940b84c0c66a398e62dd4e7f183fdbc7da6ee`

It can be found on the
[Explorer](https://explorer.ver.ax/linea/schemas/0x5003a7832fa2734780a5bf6a1f3940b84c0c66a398e62dd4e7f183fdbc7da6ee).
{% endhint %}
