import { VeraxSdk } from "../../src/VeraxSdk";

describe("AttestationDataMapper", () => {
  let veraxSdk: VeraxSdk;

  beforeAll(() => {
    veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);
  });

  describe("findOneById", () => {
    it("should return the expected attestation", async () => {
      const attestationId = "0x00000000000000000000000000000000000000000000000000000000000007b5";

      const result = await veraxSdk.attestation.findOneById(attestationId);

      expect(result).not.toBeUndefined();
      expect(result?.id).toEqual(attestationId);
      expect(result?.schemaId).toEqual("0xd1664d97bd195df77e3d5fe78c1737ab3adaa38bbe52a680d1aa30fa51f186ba");
      expect(result?.replacedBy).toEqual("0x0000000000000000000000000000000000000000000000000000000000000000");
      expect(result?.attester).toEqual("0x809e815596abeb3764abf81be2dc39fbbacc9949");
      expect(result?.portal).toEqual("0xb3c0e57d560f36697f5d727c2c6db4e0c8f87bd8");
      expect(result?.attestedDate).toEqual(1695398083);
      expect(result?.expirationDate).toEqual(1793835110);
      expect(result?.revocationDate).toEqual(0);
      expect(result?.version).toEqual(8);
      expect(result?.revoked).toBeFalsy();
      expect(result?.subject).toEqual("0xcb859f99f84ab770a50380680be94ad9331bcec5");
      expect(result?.attestationData).toEqual("0x0000000000000000000000000000000000000000000000000000000000000004");
      expect(result?.schemaString).toEqual("uint8");
      expect(result?.decodedData).toEqual(["0x4"]);
      expect(result?.decodedPayload).toEqual([{ rating: 4 }]);
    });
  });

  describe("findBy", () => {
    it("should get 2 attestations", async () => {
      const result = await veraxSdk.attestation.findBy(2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
    });

    it("should get 2 attestations from a specific attester", async () => {
      const attesterAddress = "0x809e815596abeb3764abf81be2dc39fbbacc9949";
      const result = await veraxSdk.attestation.findBy(2, 0, { attester: attesterAddress });

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].attester).toBe(attesterAddress);
      expect(result[1].attester).toBe(attesterAddress);
    });

    it("should get 3 attestations from a specific attester ordered by descending attestation date", async () => {
      const attesterAddress = "0x809e815596abeb3764abf81be2dc39fbbacc9949";
      const result = await veraxSdk.attestation.findBy(3, 0, { attester: attesterAddress }, "attestedDate", "desc");

      expect(result).not.toBeNull();
      expect(result.length).toBe(3);
      expect(result[0].attester).toBe(attesterAddress);
      expect(result[1].attester).toBe(attesterAddress);
      expect(result[2].attester).toBe(attesterAddress);
      expect(result[0].id).toBe("0x000000000000000000000000000000000000000000000000000000000000109f");
      expect(result[1].id).toBe("0x000000000000000000000000000000000000000000000000000000000000109e");
      expect(result[2].id).toBe("0x000000000000000000000000000000000000000000000000000000000000109d");
    });
  });

  describe("getRelatedAttestations", () => {
    it("should return the attestations related to a given attestation", async () => {
      const attestationId = "0x0000000000000000000000000000000000000000000000000000000000000001";

      const result = await veraxSdk.attestation.getRelatedAttestations(attestationId);

      expect(result).not.toBeNull();
      expect(result.length).toBe(5);
    });
  });
});
