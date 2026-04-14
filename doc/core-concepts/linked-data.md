# Linked Data

One of the major benefits of using an attestation registry such as Verax for storing data, is that it consolidates
public data points from various dApps into a unified on-chain datastore. This reduces the proliferation of fragmented
data silos, with dApps using their own individual on-chain storage.

Using a consolidated data store makes it much easier to index the data and derive valuable insights. However, there
remains a challenge when we start composing attestations from multiple different sources that each have their own naming
conventions and semantic definitions for the attestation data.

To illustrate this with an example, consider an attestation for a person.

Attestation from Issuer A:

```
name: 沐宸
address: 0xa74b509f...
homepage: https://example.com/mypage
```

Attestation from Issuer B:

```
name: Alice
address: 0x174bb5ca2...
homepage: https://example.com/alicespage
```

We don't know if those attestations are using the property "name" in the same way, or "address" in the same way, etc.
This introduces ambiguity, which creates friction for the developer that is trying to consume and compose attestations
from different sources.

To make matters worse, attestation issuers may use different naming conventions when referring to the same thing.
Consider the two following examples:

Attestation from Issuer A:

```
first_name: 沐宸
last_name: 王
home_page: https://example.com/mypage
```

Attestation from Issuer B:

```
firstName: Alice
lastName: Cooper
homePage: https://example.com/alicespage
```

Even if both attestation issuers are using fields that have the same semantic meaning, one of them is using camelCase
while the other is using under_scores. This becomes a major headache for consumers of the attestations, as they have to
account for the naming conventions of different issuers.

### Contexts to the rescue

Verax borrows a concept from [JSON-LD](https://json-ld.org) called the "_context_". Every schema that is registered has
a field in its metadata called `context` which has a string value that is either a URL or an attestation ID. The
`context` field tells consumers how to interpret the fields in the schema / attestation, and they can point to
well-known shared vocabularies such as [schema.org](https://schema.org) so that consumers can easily understand the
attestations they're consuming.

Let's look at the example above, but this time both attestations are based on schemas that have the same context value:

```
context: https://schema.org/Person // ⬅︎ specified in schema's metadata
givenName: string
familyName: string
url: string
```

Attestation from Issuer A:

```
givenName: 沐宸
familyName: 王
url: https://example.com/mypage
```

Attestation from Issuer B:

```
givenName: Alice
familyName: Cooper
url: https://example.com/alicespage
```

Now both issuers are using the same naming convention, which makes it way easier to consume and compose the
attestations.

## Custom Naming Conventions

Of course, the example above does not always apply in practical situations. Often, an attestation issuer already has an
established naming convention, and it is not feasible for them to change this naming convention to align with other
shared vocabularies. That's OK, because we can use custom contexts!

Custom contexts are based on a custom schema that allows an issuer to create an attestation, which links their custom
fields to properties in a shared vocabulary. Let's take the example above, but this time the `context` property in the
schema metadata points to an attestation that looks like this:

```typescript
context: "https://schema.org/Person"; // ⬅︎ stored in the attestation's schema metadata
first_name: "@givenName";
last_name: "@familyName";
home_page: "@url";
address: "Ethereum mainnet address";
```

So now a consumer of any attestation that is based on a schema with the above context knows that the field `last_name`
actually refers to [https://schema.org/familyName](https://schema.org/familyName). Now developers can programmatically
detect when a schema's context points to a "_context attestation_", and can automatically map the issuer's idiomatic
naming convention back to that of a shared vocabulary, without needing to hardcode it (or even knowing anything about
it).

## Shared Vocabularies

We've borrowed the context property from the [JSON-LD specification](https://json-ld.org), but we haven't taken anything
else from that specification as we are trying to emphasize simplicity over complexity. The context property is powerful
enough to give rich semantic meaning to attestations.

For the same reason, we are encouraging using [schema.org](https://schema.org/) as a shared vocabulary (also commonly
called an _ontology_). However, many other vocabularies / ontologies may be better suited to other use cases, for
example:

- [SIOC](http://sioc-project.org) - The _Semantically Interlinked Online Communities_ ontology is an ontology of terms
  that can be used to describe online communities.
- [FIBO](https://edmconnect.edmcouncil.org/fibointerestgroup/fibo-products/fibo-viewer) - The _Financial Industry
  Business Ontology_ defines the sets of things that are of interest in financial applications, and the ways that those
  things can relate to one another.

Many other ontologies are available, and you can discover ones that may be better suited to your specific use case using
the following directories:

- [Linked Open Vocabularies](https://lov.linkeddata.es/dataset/lov/)
- [DBpedia Ontology Archive](https://archivo.dbpedia.org/list#list)

---

## Conclusion

Using shared vocabularies / ontologies is a powerful way for dApps to allow easy access to their data, making it much
more likely for other dApp developers to consume those attestations. Adopting shared ontologies will allow us to develop
semantically rich on-chain reputations and will allow for sophisticated permissionless discoverability of services and
dApps that drives real value to users.

Schemas and Linked Data are the foundational components of the attestation registry, but actually issuing attestations
based on these schemas involves two other simple concepts, [Portals](portals.md) and [Modules](modules.md).
