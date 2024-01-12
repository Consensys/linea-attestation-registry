# Create a Schema

Before you can issue attestations into the registry, you will need a schema upon which to base those attestations.  To create a schema, you must call the `createSchema` function on the `SchemaRegistry` contract.  The function takes the following four parameters:

```solidity
function createSchema(
    string memory name,
    string memory description,
    string memory context,
    string memory schemaString
)
```

The four parameters are defined as follows:

<table><thead><tr><th width="158">Parameter</th><th>Description</th></tr></thead><tbody><tr><td>name</td><td>A on-chain descriptive name for the schema.</td></tr><tr><td>description</td><td>The location of documentation for the schema (URL, IPFS hash etc.), which describes it's intended use and any relationships.</td></tr><tr><td>context</td><td>A link to a description of the fields of the schema. This can be a URL that links to some shared ontology or the attestation id of a custom context.</td></tr><tr><td>schemaString</td><td>The actual shema string that describes the data structure of the attestations.</td></tr></tbody></table>

## The Schema String Syntax

A schema string is a comma separated list of data type / field name tuples, for example:

`(string firstName, string lastName)`

**Note:**  the schema _should be_ wrapped in outter round brackets.  This is essential but it is best practice as it will make it easier for different clients to parse the schema.

The data types can be any valid solidity datatype:

1. **Boolean**: Identified by the `bool` keyword. Represents a boolean value: `true` or `false`.
2. **Integer**: Represents signed integers of various sizes. Examples include `int8`, `int16`, `int256`, etc.
3. **Unsigned Integer**: Represents unsigned integers of various sizes. Examples include `uint8`, `uint16`, `uint256`, etc.
4. **Address**: Represents a 20-byte Ethereum address. It is used to store addresses of EOAs and smart contracts. Identified by the keyword `address`.
5. **Bytes**: Represents a fixed-size array of bytes. For example, `bytes32` represents a 32-byte array, and `bytes` represents a dynamic-sized byte array.
6. **String**: Represents a sequence of characters, similar to strings in other programming languages. Identified by the keyword `string`.
7. **Array**: Represents a fixed-size or dynamic-size array of elements of the same type, e.g. `string[]`.
8. **Struct**: Represents a user-defined data structure that can hold multiple variables of different types. To define a struct, simply incude the field name, following by the struct definition in curly braces, see below for an example.

The only Solidity data types that aren't supported are `mapping` and `enum`.  If you want to store a mapping, you can instead choose to store an array of keay <> value pairs, e.g. `mapping(address => uint32) points` becomes `` (address user, uint32 score)[] points` ``

Defining a **struct** in a schema string is done using round braces.  For example, defining a struct that contains `Street` and `City` properties can be done like so:

`string firstName, string lastName, (string Street, string City) isResidentAt`

Note that the name of the field in the attestation is `isResidentAt` but the name of the actual struct isn't defined in the schema string.

Arrays of structs can be defined using square brackets, e.g.:

`string firstName, string lastName, (string Street, string City)[] homeAddress`

## Getting a schema id from a schema string

Schema ids can be created counterfactually from schema strings, as ids are simply the keccak hash of the schema string.  In order to deterministically calculate what the schema id is, you can call the function `getIdFromSchemaString` function on the `SchemaRegistry` smart contract. &#x20;

This function is defined as:

```solidity
function getIdFromSchemaString(string memory schema) public pure returns (bytes32) {
    return keccak256(abi.encodePacked(schema));
}
```

***

To understand more about the schema creation process, you can view the `SchemaRegistry` smart contract [source code](https://github.com/Consensys/linea-attestation-registry/blob/dev/contracts/src/SchemaRegistry.sol).

Once you've created one or more schemas, you can optionally create a [module](create-a-module.md) to enforce any constraints or business logic that are associated with those schemas.
