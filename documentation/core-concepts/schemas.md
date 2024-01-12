# Schemas

## Simple Schemas

A schema is a blueprint for an attestation.  It describes the various fields an attestation contains and what their data types are.  Anyone can create a schema in the registry, and once created, schemas can be re-used by anyone else.

Schemas are stored in the registry as a string value that describes the various fields.  For example, to create attestations that describe a person, we can create a schema as follows:\
\
`(string username, string teamname, uint16 points, bool active)`

This describes a schema with four fields.  Any attestation based on this schema can be decoded in Solidity as follows:

```solidity
(username, teamname, points, active) = abi.decode(
    attestationData,
    (string, string, uint16, bool)
);
```

As you can see from this example, a schema is more or less a comma-separated list of tuples of property name and datatype.

***

## Schemas with Nested Data

Many schemas will involve some sort of nested data.  In order to create a schema with nested data, place the nested data in round braces, followed by the property name, for example:

{% code overflow="wrap" %}
```
(string username, string teamname, uint16 points, bool active, ( string gametype, string gamemode )[] setup)
```
{% endcode %}

You can consider this type of schema as corresponding to the following Solidity structs:

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
    Preferences[] setup;
}
```

***

## Schema MetaData

As well as the schema string, schemas have some metadata that is stored with them:

<table><thead><tr><th width="162.33333333333331">Property</th><th width="113">Datatype</th><th>Description</th></tr></thead><tbody><tr><td>name</td><td>string</td><td>(r<em>equired)</em> The name of schema, stored on-chain</td></tr><tr><td>description</td><td>string</td><td>A link to off-chain description / documentation</td></tr><tr><td>context</td><td>string</td><td>A link to some shared vocabulary / ontology</td></tr><tr><td>schema</td><td>string</td><td><em>(required)</em> The raw schema string as described above</td></tr></tbody></table>

### Schema Contexts / Shared Vocabularies

Schemas have a field called "_context_" which is usually a link to some shared vocabulary.  This is an important field that gives semantic meaning to the schema, allowing consumers of the attestation to understand exactly what the fields in the schema represent.  This removes ambiguity and also allows reputation protocols to build powerful semantic graphs when indexing attestations.

For more information on this property and how important it is, see the [Linked Data](linked-data.md) page.

### Counterfactual Schemas

Schema ids are unique to the schema content, and are created from the keccak hash of the schema string.  This means that schemas can be created counterfactually, allowing for things like circular relationships between schemas.  It also means that two people can't create the exact same schema, which in turn, promotes reusability within the registry.

***

## Experimental Features for Advanced Schemas

These features are advanced and experimental schema features that allow you to create schemas with sophisticated properties. Feel free to get in contact if you have any questions.

{% hint style="warning" %}
**NOTE:** caution should be taken with these features as they are experimental and likely to change, and may not be supported by all indexers!
{% endhint %}

<details>

<summary>How to create related schemas</summary>

Sometimes you may wish the consumers of your attestation to know how the attestations relate to other attestations, to do this you create a relationship.  So for for example, to create an attestation of a "_player_" that is a member of a "_team_", one would first create a **Team** schema, and then you would create a **Player** schema with a _canonical relationship field_, denoted by curly braces:

`string pseudonym, string dateJoined, { isMemberOf Team 0xa1b2c3 }`&#x20;

... where `isMemberOf` is the relationship type, `Team` is the schema name, and `0xa1b2c3` is the schema id.  This indicates that any attestation based on the above schema is expected to be linked to some other **Team** attestation via a [relationship attestation](schemas.md#relationship-attestations) that links them together.

This approach reduces redundant attestations, and allows for more fine-grained and reusable schemas, contributing to a growing standard library of well known and widely used schemas.

Similarly, in order to create a one-to-many canonical relationship field, you would use the syntax:

`string firstName, string lastName, [{ isResidentAt Place 0xa1b2c3 }]`&#x20;

As anyone can create links between different attestations, so including a canonical relationship in your schema can help the consumers of your attestations understand which relationships you intended on being there, as opposed to relationships that may be created by third parties.

See the page on [Linking Attestations](../developer-guides/for-attestation-issuers/link-attestations.md) to understand how to link attestations after they are created.

</details>

<details>

<summary>A note on relationship attestations</summary>

The examples above use what is called a "_relationship attestation_", which is any attestation based on the special `Relationship` schema.  The relationship schema conforms to the following structure:

`bytes32 subject, string predicate, bytes32 object`

This `Relationship` schema exists as a first class citizen of the registry, and attestations that are based on this schema are used for linking other attestations together.  The `subject` field is the attestation that is being linked to another attestation, the `predicate` field is a name that describes the _type_ of relationship, and the `subject` is the attestation being linked to.

Examples of relationship attestations are:

* `0x46582...` "isFollowerOf" `0x10345...`
* `0x31235...` "hasVotedFor" `0x52991...`
* `0x74851...` "isAlumniOf" `0x31122...`

Anyone can create any type of relationship between any attestation and any number of other attestations, allowing for the emergence of an organic [folksonomy](https://en.wikipedia.org/wiki/Folksonomy).  However, it also makes canonical relationships important to define in the schema, as otherwise there will be ambiguity between which relationship attestations were intended by the attestation issuer, and which were relationship attestations that were arbitrarily added later by third parties.

See the page on [**linking attestations**](../developer-guides/for-attestation-issuers/link-attestations.md) for more details.

</details>

<details>

<summary>How to extend other schemas</summary>

Schemas can also inherit from other schemas, which is another way that Verax reduces redundant schema data and promotes reusability.  To inherit from another schema, simply add the parent schema id at the very start of the schema string preceded by the `@extends` keyword, e.g.:

`@extends 0xa1b2c3... string firstName, string lastName`

This will tell indexers to look up the schema referenced by the `extends` keyword, and concatenate it's schema string with the schema string in this schema.  Note that any conflicting field names will be overridden by the last previous definition, so for example, if a field name exist in a parent schema and a child schema, the field definition from the child schema will be used.  Also, schemas can only inherit from one parent at a time.

</details>

