# 🌐 Using the Subgraph

There is a public subgraph that is currently maintained by the Linea team, and it can be accessed from the following URL:

{% embed url="https://graph-query.linea.build/subgraphs/name/Consensys/linea-attestation-registry/graphql?query=query+MyQuery+%7B%0A++attestations+%7B%0A++++attestationData%0A++++decodedData%0A++++schemaString%0A++%7D%0A%7D" %}
Public subgraph on Linea mainnet
{% endembed %}

If you want to access the public subgraph on the Linea testnet, you can access it here:

{% embed url="https://graph-query.goerli.linea.build/subgraphs/name/Consensys/linea-attestation-registry/graphql?query=query+MyQuery+%7B%0A++attestations+%7B%0A++++attestationData%0A++++id%0A++++expirationDate%0A++++portal%0A++++replacedBy%0A++++revocationDate%0A++%7D%0A%7D" %}
Public subgraph on Linea testnet
{% endembed %}

You can use this default web interface to write queries in GraphQL in order to serarch through the attestation registry.  Alternatively you can use a tool such as Postman, or use the subgraph's API to query the regsitry directly from your own dapp.

Examples of queries that you can make using the subgraph:

1. Get all attestations, along the respective schema string and the decoded attestation data:

```graphql
query MyQuery {
  attestations {
    attestationData
    decodedData
    schemaString
  }
}
```

2. Give me all attestations related issued to a specific address:

```graphql
query MyQuery {
  attestations(where: {subject: "0xd14BF29e486DFC3836757b9B8CCFc95a5160A56D"}) {
    attestationData
    decodedData
    schemaString
  }
}
```

3. Give me all attestations issued to a specific address, related to a specific schema id, that have not been revoked.

```graphql
query MyQuery {
  attestations(
    where: {
      subject: "0xd14BF29e486DFC3836757b9B8CCFc95a5160A56D",
      schemaId: "0x7b2d17830782df831c39edcbd728a47f0a470d57fdf452b5f4226f467f48295e",
      revoked: false
    }
  ) {
    attestationData
    decodedData
    schemaString
  }
}
```

As well as querying the attestation registry, you can query the schema registry, module registry and portal registry. For example, if you want to browse the library of existing schemas:

```graphql
query SchemaQuery {
  schemas {
    name
    description
    id
    context
  }
}
```

***

To get more information on using the subgraph, please refer to [The Graph's documentation](https://thegraph.com/docs/en/).

The source code for our subgraph is available in our monorepo, where you find info on deploying your own subgraph if you want to.

{% embed url="https://github.com/Consensys/linea-attestation-registry/tree/dev/subgraph" %}
