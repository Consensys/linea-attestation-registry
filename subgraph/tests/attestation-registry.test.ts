import { afterEach, assert, beforeAll, clearStore, createMockedFunction, describe, test } from "matchstick-as";
import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import {
  AttestationRegistered as AttestationRegisteredEvent,
  AttestationRegistry,
  AttestationReplaced as AttestationReplacedEvent,
  AttestationRevoked as AttestationRevokedEvent,
  VersionUpdated as VersionUpdatedEvent,
} from "../generated/AttestationRegistry/AttestationRegistry";
import { newTypedMockEvent } from "matchstick-as/assembly/defaults";
import {
  handleAttestationRegistered,
  handleAttestationReplaced,
  handleAttestationRevoked,
  handleVersionUpdated,
} from "../src/attestation-registry";
import { Portal, Schema } from "../generated/schema";

const attestationRegistryAddress = Address.fromString("C765F28096F6121C2F2b82D35A4346280164428b");
const attestationId = Bytes.fromHexString("0x00000000000000000000000000000000000000000000000000000000000010f5");
const schemaId = Bytes.fromHexString("0x7930a5ebfabdd4ef76bbb8cdcbc2225b6256d9511d9cf5ff0d6514c1bdb4d7dc");
const replacedBy = Bytes.fromHexString("0x00000000000000000000000000000000000000000000000000000000000010f6");
const attester = Address.fromString("e02bd7a6c8aa401189aebb5bad755c2610940a73");
const portal = Address.fromString("f75be6f9418710fd516fa82afb3aad07e11a0f1b");
const attestedDate = BigInt.fromString("1234");
const expirationDate = BigInt.fromString("1234");
const revocationDate = BigInt.fromString("0");
const version = BigInt.fromString("4");
const revoked = false;
const subject = Bytes.fromHexString("0xC765F28096F6121C2F2b82D35A4346280164428b");
const attestationData = Bytes.fromHexString(
  "0x00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000006a00000000000000000000000000000000000000000000000000000000000000c600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000027a601f7ff8707fedc3000000000000000000000000000000000000000000000000000000000000002d46b6e50692c14c9a305313ac83125505d4cae04c2dcf8ab10ef00b30a11f0c1b1a14f7aa7123c06c78dc6597173034e426dcf29b83cd3463759ede03f77a0d627a55b7f2e6539347ed9a3b4e3b64a6fa189b1329d42b2f9b307de464c689b4350e42ff6e6ccd508026dcfe406954037d7218e77f71bc27801e942a0da075128958a53c348fb73da7b16582a7579c3fa2a19d77c39c7c2f11bbb7f45965d980b1d691679f15de942fa26f5e67c6e166448d6ea6a078e28275fc8ae72b565f4232efb9b8909e8b81cb6562781c2df17268b4885e59a56d76220afc9b0ea9e28acf936e467101fc63fbaf52f122d8c8d992d077f30092b17a574b052713c25da524b6894f6aec6e967fddc53781f52ebedcb87d239c0f2eacff08efc8d1fb2ace5e0dd47b5ec2dddd454f30dda953d8cb6a10c8fee9ee493c402ae1d5f7f221892894b6bb10b48099ec28443297e491de6aa8660680b8a8c2e3777b121c1c21c8c45f91e2e6db228d0a37207b1baa2f574eeff4c3c6cbe7d8c77c6ce4b7b29b15cc373748c21905af03cdd9715eafaaa1e3767698eb0a1e5c23c9b791c79063e9c67416442f83ff0b47ad707db1dfb3d26371d5f49adf968b4a1d75cc581a707719e5fcf0fc9cc87eda9817593d1c583aeeb0638d42ae2415351237761253deb36123201c20d07192e646f5db9ce7045f84a6c34ddadcbcc46d37358bbe5f410f05d6ca663e0908f04407f42f320419cf53c74509ad38eb4dbd33628041f9683ad5e9dde1acee073a6176fbb6b56bbecb9632f90d3668d8747b10d764e941e8eda760eb1630a7afb4a82b9776344110b1f142f80c821cb5bb0e50dc8d638f1897743a4881df7788a68245fe14f01bb5933f8159a2a334fcc993a795a6bcf5217da5718267ce9f14ff1408d81afde13229e4e4a49bc8d4cb078fba79ff836a05ad4303de81bff7414f0b3deb92c653ac91edf5c0e825999a353d0eeac8673a0ab4a0f5df7b578d482265b738efe9cb8f2e3f9049b704c6c1e4ea0e0a5981448d7f802c325a13b445bf98d683efd6685c9d089e8aed05c42a49ee0298889cd951692c2022cfd3474905c46283d5a26dcda01d2de1da42c260c26cc0597d76e668e9c3c3a8d570f9bd9f7ce721b61b7d748958be5f820e40aea187a710bb9c42f5d325a5374e6f317bcdb36fcc1eb04bad69f6c3e4580dfcc1a79165664c4615b375c3ef33cd746de7bf0701e5951876ce16bbe4517c4acd92082aeb6b7f0fdd2f54d9c007b57dbdec946a5c5400d10d73762dbcc585ea7fa590d13e6d1c9af671c6be01e54d28e2a6271fb7a21ad52ba102153ac160c9fb8b5a18ac8a4214c89c191c4100bccfa733ead9bafd6e69f524b7e14a8bb11c792d2a7d271f1c4d7538c1de5ebc62823bbe31d41949034a15dc248b3ff1677dcf348df038e894b8271a2091e4e662772b93f15191cc3ab9a02120bc3607e64e018a217688ffb2dc93f4809c5ee4d751f495526608e04b40fda9ce21eacf653f5646556b99a2dbbafaf9e62387d03749e45f957773fa3757b18b5b5934f55101d959698b337b5817724e4dccc29a1e36e6ece844db0bfb2d39e39a069db2102ea5597c077381fef74438912bfdfef378be7d616fadbce5ab610c5f75708c0ff811c8f34dc0914ce89e457092db44ba4e973200e1220fca13d56cc6d74afebcb0be7449d63fbdf8deb15d05809c84a3a039eb7474b526456e59b939d3efa3da35b31f32555713ecaedfb415e80a3a7e9a676a5bff84a713f3cdfdc673d5e895304593f2888fa211974bdeb5aebe303a8caf3a5af472d667e8ea6bc88cb4fa1f472b2834a1d78ed37c216b7ab18f7247705078b795eb728b664d57fb3f240f740bd60cac0b165b4fda8d4acca064c01fabb4299876aec45ebe4184abb05011a2a81fcb5dd3f176552fd7025bda296f6b5954065872557ad01e19ae26d3c03fbbe7525083c43db8322a688694ee7a11456841e4e19bf29bb5468146e4ce8e1cd526f5888343aeb3bd957baa6824000000000000000000000000000000000000000000000000000000000000002d0000000000000000000000000000000000000000000000000000000064c29f490000000000000000000000000000000000000000000000000000000064c29f490000000000000000000000000000000000000000000000000000000064c282b40000000000000000000000000000000000000000000000000000000064c282b40000000000000000000000000000000000000000000000000000000064c282b40000000000000000000000000000000000000000000000000000000064c282b40000000000000000000000000000000000000000000000000000000064c282b40000000000000000000000000000000000000000000000000000000064c282b40000000000000000000000000000000000000000000000000000000064c282b40000000000000000000000000000000000000000000000000000000064c2826d0000000000000000000000000000000000000000000000000000000064c2826d0000000000000000000000000000000000000000000000000000000064c2826d000000000000000000000000000000000000000000000000000000006501462b00000000000000000000000000000000000000000000000000000000652fad5f00000000000000000000000000000000000000000000000000000000652faf7a00000000000000000000000000000000000000000000000000000000652faf7a00000000000000000000000000000000000000000000000000000000652faf7a00000000000000000000000000000000000000000000000000000000652fad4900000000000000000000000000000000000000000000000000000000652fab64000000000000000000000000000000000000000000000000000000006501463e000000000000000000000000000000000000000000000000000000006501461100000000000000000000000000000000000000000000000000000000650146110000000000000000000000000000000000000000000000000000000064c8cdaf00000000000000000000000000000000000000000000000000000000652fab6400000000000000000000000000000000000000000000000000000000652fab6400000000000000000000000000000000000000000000000000000000652fab6400000000000000000000000000000000000000000000000000000000652fab64000000000000000000000000000000000000000000000000000000006501461100000000000000000000000000000000000000000000000000000000652fab6400000000000000000000000000000000000000000000000000000000652fab6400000000000000000000000000000000000000000000000000000000652faf330000000000000000000000000000000000000000000000000000000064ef79e00000000000000000000000000000000000000000000000000000000064ef79e000000000000000000000000000000000000000000000000000000000652fab640000000000000000000000000000000000000000000000000000000064dc98ac0000000000000000000000000000000000000000000000000000000064dc98ac00000000000000000000000000000000000000000000000000000000652facfa00000000000000000000000000000000000000000000000000000000651d4bc300000000000000000000000000000000000000000000000000000000651d4bc30000000000000000000000000000000000000000000000000000000064dc9549000000000000000000000000000000000000000000000000000000006501466c000000000000000000000000000000000000000000000000000000006501466c000000000000000000000000000000000000000000000000000000006501466c000000000000000000000000000000000000000000000000000000006501466c0000000000000000000000000000000000000000000000000000000064dc9549000000000000000000000000000000000000000000000000000000000000002d0000000000000000000000000000000000000000000000000000000065394649000000000000000000000000000000000000000000000000000000006539464900000000000000000000000000000000000000000000000000000000653929b400000000000000000000000000000000000000000000000000000000653929b400000000000000000000000000000000000000000000000000000000653929b400000000000000000000000000000000000000000000000000000000653929b400000000000000000000000000000000000000000000000000000000653929b400000000000000000000000000000000000000000000000000000000653929b400000000000000000000000000000000000000000000000000000000653929b4000000000000000000000000000000000000000000000000000000006539296d000000000000000000000000000000000000000000000000000000006539296d000000000000000000000000000000000000000000000000000000006539296d000000000000000000000000000000000000000000000000000000006577ed2b0000000000000000000000000000000000000000000000000000000065a6545f0000000000000000000000000000000000000000000000000000000065a6567a0000000000000000000000000000000000000000000000000000000065a6567a0000000000000000000000000000000000000000000000000000000065a6567a0000000000000000000000000000000000000000000000000000000065a654490000000000000000000000000000000000000000000000000000000065a65264000000000000000000000000000000000000000000000000000000006577ed3e000000000000000000000000000000000000000000000000000000006577ed11000000000000000000000000000000000000000000000000000000006577ed1100000000000000000000000000000000000000000000000000000000653f74af0000000000000000000000000000000000000000000000000000000065a652640000000000000000000000000000000000000000000000000000000065a652640000000000000000000000000000000000000000000000000000000065a652640000000000000000000000000000000000000000000000000000000065a65264000000000000000000000000000000000000000000000000000000006577ed110000000000000000000000000000000000000000000000000000000065a652640000000000000000000000000000000000000000000000000000000065a652640000000000000000000000000000000000000000000000000000000065a6563300000000000000000000000000000000000000000000000000000000656620e000000000000000000000000000000000000000000000000000000000656620e00000000000000000000000000000000000000000000000000000000065a652640000000000000000000000000000000000000000000000000000000065533fac0000000000000000000000000000000000000000000000000000000065533fac0000000000000000000000000000000000000000000000000000000065a653fa000000000000000000000000000000000000000000000000000000006544d89f00000000000000000000000000000000000000000000000000000000982f3c590000000000000000000000000000000000000000000000000000000065533c49000000000000000000000000000000000000000000000000000000006577ed6c000000000000000000000000000000000000000000000000000000006577ed6c000000000000000000000000000000000000000000000000000000006577ed6c000000000000000000000000000000000000000000000000000000006577ed6c0000000000000000000000000000000000000000000000000000000065533c49",
);

describe("handleAttestationRegistered()", () => {
  beforeAll(() => {
    mockGetAttestation(revoked, revocationDate);
  });

  afterEach(() => {
    clearStore();
  });

  test("Should mock the call to the AttestationRegistry", () => {
    const contract = AttestationRegistry.bind(attestationRegistryAddress);
    const result = contract.getAttestation(attestationId);

    assert.bytesEquals(result.attestationId, attestationId);
    assert.bytesEquals(result.schemaId, schemaId);
    assert.bytesEquals(result.replacedBy, replacedBy);
    assert.addressEquals(result.attester, attester);
    assert.addressEquals(result.portal, portal);
    assert.bigIntEquals(result.attestedDate, attestedDate);
    assert.bigIntEquals(result.expirationDate, expirationDate);
    assert.bigIntEquals(result.revocationDate, revocationDate);
    assert.i32Equals(result.version, version.toI32());
    assert.booleanEquals(result.revoked, revoked);
    assert.bytesEquals(result.subject, subject);
    assert.bytesEquals(result.attestationData, attestationData);
  });

  test("Should create a new Attestation entity", () => {
    assert.entityCount("Attestation", 0);

    const attestationRegisteredEvent = createAttestationRegisteredEvent(attestationId);

    handleAttestationRegistered(attestationRegisteredEvent);

    assert.entityCount("Attestation", 1);

    assert.fieldEquals("Attestation", attestationId.toHexString(), "id", attestationId.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "schemaId", schemaId.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "replacedBy", replacedBy.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attester", attester.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "portal", portal.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attestedDate", attestedDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "expirationDate", expirationDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revocationDate", revocationDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "version", version.toI32().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revoked", revoked.toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "subject", subject.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attestationData", attestationData.toHexString());
  });

  test("Should increment the attestations Counter", () => {
    assert.entityCount("Attestation", 0);
    assert.entityCount("Counter", 0);

    const attestationRegisteredEvent = createAttestationRegisteredEvent(attestationId);

    handleAttestationRegistered(attestationRegisteredEvent);

    assert.entityCount("Attestation", 1);
    assert.fieldEquals("Counter", "counter", "attestations", "1");
  });

  test("Should increment the attestations counter in portal", () => {
    assert.entityCount("Attestation", 0);
    assert.entityCount("Portal", 0);

    const portalEntity = new Portal(portal.toHexString());
    portalEntity.name = "name";
    portalEntity.description = "description";
    portalEntity.isRevocable = true;
    portalEntity.modules = [];
    portalEntity.ownerName = "ownerName";
    portalEntity.ownerAddress = Address.fromString("e75be6f9418710fd516fa82afb3aad07e11a0f1b");
    portalEntity.attestationCounter = 0;
    portalEntity.save();

    assert.entityCount("Portal", 1);
    assert.fieldEquals("Portal", portal.toHexString(), "attestationCounter", "0");

    const attestationRegisteredEvent = createAttestationRegisteredEvent(attestationId);

    handleAttestationRegistered(attestationRegisteredEvent);

    assert.entityCount("Attestation", 1);
    assert.fieldEquals("Portal", portal.toHexString(), "attestationCounter", "1");
  });

  test("Should decode a basic attestation data", () => {
    const schema = new Schema(schemaId.toHexString());
    schema.name = "name";
    schema.description = "description";
    schema.context = "context";
    schema.schema =
      "uint256[] providers, bytes32[] hashes, uint64[] issuanceDates, uint64[] expirationDates, uint16 providerMapVersion";
    schema.save();

    const attestationRegisteredEvent = createAttestationRegisteredEvent(attestationId);

    handleAttestationRegistered(attestationRegisteredEvent);

    assert.entityCount("Attestation", 1);

    assert.fieldEquals("Attestation", attestationId.toHexString(), "id", attestationId.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "schemaId", schemaId.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "replacedBy", replacedBy.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attester", attester.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "portal", portal.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attestedDate", attestedDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "expirationDate", expirationDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revocationDate", revocationDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "version", version.toI32().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revoked", revoked.toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "subject", subject.toHexString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "attestationData", attestationData.toHexString());
    assert.fieldEquals(
      "Attestation",
      attestationId.toHexString(),
      "schemaString",
      "uint256[],bytes32[],uint64[],uint64[],uint16",
    );
    assert.fieldEquals(
      "Attestation",
      attestationId.toHexString(),
      "decodedData",
      "[0x27a601f7ff8707fedc3,0x46b6e50692c14c9a305313ac83125505d4cae04c2dcf8ab10ef00b30a11f0c1b,0x1a14f7aa7123c06c78dc6597173034e426dcf29b83cd3463759ede03f77a0d62,0x7a55b7f2e6539347ed9a3b4e3b64a6fa189b1329d42b2f9b307de464c689b435,0x0e42ff6e6ccd508026dcfe406954037d7218e77f71bc27801e942a0da0751289,0x58a53c348fb73da7b16582a7579c3fa2a19d77c39c7c2f11bbb7f45965d980b1,0xd691679f15de942fa26f5e67c6e166448d6ea6a078e28275fc8ae72b565f4232,0xefb9b8909e8b81cb6562781c2df17268b4885e59a56d76220afc9b0ea9e28acf,0x936e467101fc63fbaf52f122d8c8d992d077f30092b17a574b052713c25da524,0xb6894f6aec6e967fddc53781f52ebedcb87d239c0f2eacff08efc8d1fb2ace5e,0x0dd47b5ec2dddd454f30dda953d8cb6a10c8fee9ee493c402ae1d5f7f2218928,0x94b6bb10b48099ec28443297e491de6aa8660680b8a8c2e3777b121c1c21c8c4,0x5f91e2e6db228d0a37207b1baa2f574eeff4c3c6cbe7d8c77c6ce4b7b29b15cc,0x373748c21905af03cdd9715eafaaa1e3767698eb0a1e5c23c9b791c79063e9c6,0x7416442f83ff0b47ad707db1dfb3d26371d5f49adf968b4a1d75cc581a707719,0xe5fcf0fc9cc87eda9817593d1c583aeeb0638d42ae2415351237761253deb361,0x23201c20d07192e646f5db9ce7045f84a6c34ddadcbcc46d37358bbe5f410f05,0xd6ca663e0908f04407f42f320419cf53c74509ad38eb4dbd33628041f9683ad5,0xe9dde1acee073a6176fbb6b56bbecb9632f90d3668d8747b10d764e941e8eda7,0x60eb1630a7afb4a82b9776344110b1f142f80c821cb5bb0e50dc8d638f189774,0x3a4881df7788a68245fe14f01bb5933f8159a2a334fcc993a795a6bcf5217da5,0x718267ce9f14ff1408d81afde13229e4e4a49bc8d4cb078fba79ff836a05ad43,0x03de81bff7414f0b3deb92c653ac91edf5c0e825999a353d0eeac8673a0ab4a0,0xf5df7b578d482265b738efe9cb8f2e3f9049b704c6c1e4ea0e0a5981448d7f80,0x2c325a13b445bf98d683efd6685c9d089e8aed05c42a49ee0298889cd951692c,0x2022cfd3474905c46283d5a26dcda01d2de1da42c260c26cc0597d76e668e9c3,0xc3a8d570f9bd9f7ce721b61b7d748958be5f820e40aea187a710bb9c42f5d325,0xa5374e6f317bcdb36fcc1eb04bad69f6c3e4580dfcc1a79165664c4615b375c3,0xef33cd746de7bf0701e5951876ce16bbe4517c4acd92082aeb6b7f0fdd2f54d9,0xc007b57dbdec946a5c5400d10d73762dbcc585ea7fa590d13e6d1c9af671c6be,0x01e54d28e2a6271fb7a21ad52ba102153 ... TRUNCATED ...]",
    );
  });
});

describe("handleAttestationRevokedEvent()", () => {
  beforeAll(() => {
    mockGetAttestation(revoked, revocationDate);
  });

  afterEach(() => {
    clearStore();
  });

  test("Should update the Attestation entity with revocation flag and date", () => {
    // Create attestation to be revoked
    assert.entityCount("Attestation", 0);
    const attestationRegisteredEvent = createAttestationRegisteredEvent(attestationId);
    handleAttestationRegistered(attestationRegisteredEvent);
    assert.entityCount("Attestation", 1);
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revocationDate", revocationDate.toU64().toString());
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revoked", revoked.toString());

    // Revoke the attestation
    mockGetAttestation(true, BigInt.fromString("1234"));
    const attestationRevokedEvent = createAttestationRevokedEvent(attestationId);
    handleAttestationRevoked(attestationRevokedEvent);

    assert.fieldEquals(
      "Attestation",
      attestationId.toHexString(),
      "revocationDate",
      BigInt.fromString("1234").toU64().toString(),
    );
    assert.fieldEquals("Attestation", attestationId.toHexString(), "revoked", "true");
  });
});

describe("handleAttestationReplacedEvent()", () => {
  beforeAll(() => {
    mockGetAttestation(revoked, revocationDate);
  });

  afterEach(() => {
    clearStore();
  });

  test("Should update the Attestation entity's replacedBy", () => {
    // Create attestation to be replaced
    assert.entityCount("Attestation", 0);
    const attestationRegisteredEvent = createAttestationRegisteredEvent(attestationId);
    handleAttestationRegistered(attestationRegisteredEvent);
    assert.entityCount("Attestation", 1);
    assert.fieldEquals("Attestation", attestationId.toHexString(), "replacedBy", replacedBy.toHexString());

    // Replace the attestation
    const updatedReplacedBy = Bytes.fromHexString("0x0000000000000000000000000000000000000000000000000000000000000001");
    const attestationReplacedEvent = createAttestationReplacedEvent(attestationId, updatedReplacedBy);
    handleAttestationReplaced(attestationReplacedEvent);

    assert.fieldEquals("Attestation", attestationId.toHexString(), "replacedBy", updatedReplacedBy.toHexString());
  });
});

describe("handleVersionUpdatedEvent()", () => {
  afterEach(() => {
    clearStore();
  });

  test("Should update the version entity with current version", () => {
    // Handle version updated event with version 5
    assert.entityCount("Version", 0);
    assert.entityCount("Versions", 0);

    const versionUpdatedEvent = newTypedMockEvent<VersionUpdatedEvent>();
    versionUpdatedEvent.address = attestationRegistryAddress;
    versionUpdatedEvent.block.timestamp = BigInt.fromString("123456789");
    versionUpdatedEvent.parameters.push(
      new ethereum.EventParam("version", ethereum.Value.fromUnsignedBigInt(BigInt.fromString("5"))),
    );

    handleVersionUpdated(versionUpdatedEvent);

    assert.entityCount("Version", 1);
    assert.fieldEquals("Version", "5-123456789", "versionNumber", "5");
    assert.fieldEquals("Version", "5-123456789", "timestamp", "123456789");
    assert.entityCount("Versions", 1);
    assert.fieldEquals("Versions", "versions", "currentVersion", "5");
    assert.fieldEquals("Versions", "versions", "currentTimestamp", "123456789");
  });
});

// eslint-disable-next-line @typescript-eslint/ban-types
function mockGetAttestation(revoked: boolean, revocationDate: BigInt): void {
  const tupleArray: Array<ethereum.Value> = [
    ethereum.Value.fromFixedBytes(attestationId),
    ethereum.Value.fromFixedBytes(schemaId),
    ethereum.Value.fromFixedBytes(replacedBy),
    ethereum.Value.fromAddress(attester),
    ethereum.Value.fromAddress(portal),
    ethereum.Value.fromUnsignedBigInt(attestedDate),
    ethereum.Value.fromUnsignedBigInt(expirationDate),
    ethereum.Value.fromUnsignedBigInt(revocationDate),
    ethereum.Value.fromUnsignedBigInt(version),
    ethereum.Value.fromBoolean(revoked),
    ethereum.Value.fromBytes(subject),
    ethereum.Value.fromBytes(attestationData),
  ];

  // Convert it to the Tuple type
  const tuple = changetype<ethereum.Tuple>(tupleArray);

  // Create a tuple Value
  const tupleValue = ethereum.Value.fromTuple(tuple);

  createMockedFunction(
    attestationRegistryAddress,
    "getAttestation",
    "getAttestation(bytes32):((bytes32,bytes32,bytes32,address,address,uint64,uint64,uint64,uint16,bool,bytes,bytes))",
  )
    .withArgs([ethereum.Value.fromFixedBytes(attestationId)])
    .returns([tupleValue]);
}

function createAttestationRegisteredEvent(attestationId: Bytes): AttestationRegisteredEvent {
  const attestationRegisteredEvent = newTypedMockEvent<AttestationRegisteredEvent>();
  attestationRegisteredEvent.address = attestationRegistryAddress;

  attestationRegisteredEvent.parameters.push(
    new ethereum.EventParam("attestationId", ethereum.Value.fromBytes(attestationId)),
  );

  return attestationRegisteredEvent;
}

function createAttestationRevokedEvent(attestationId: Bytes): AttestationRevokedEvent {
  const attestationRevokedEvent = newTypedMockEvent<AttestationRevokedEvent>();
  attestationRevokedEvent.address = attestationRegistryAddress;

  attestationRevokedEvent.parameters.push(
    new ethereum.EventParam("attestationId", ethereum.Value.fromBytes(attestationId)),
  );

  return attestationRevokedEvent;
}

function createAttestationReplacedEvent(attestationId: Bytes, updatedReplacedBy: Bytes): AttestationReplacedEvent {
  const attestationReplacedEvent = newTypedMockEvent<AttestationReplacedEvent>();
  attestationReplacedEvent.address = attestationRegistryAddress;

  attestationReplacedEvent.parameters.push(
    new ethereum.EventParam("attestationId", ethereum.Value.fromBytes(attestationId)),
  );

  attestationReplacedEvent.parameters.push(
    new ethereum.EventParam("replacedBy", ethereum.Value.fromBytes(updatedReplacedBy)),
  );

  return attestationReplacedEvent;
}
