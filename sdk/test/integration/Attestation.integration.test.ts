import { VeraxSdk } from "../../src/VeraxSdk";

describe("AttestationDataMapper", () => {
  let veraxSdk: VeraxSdk;

  beforeAll(() => {
    veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA);
  });

  describe("findOneById", () => {
    it("should return the expected attestation", async () => {
      const attestationId = "0x0000000000000000000000000000000000000000000000000000000000000129";

      const result = await veraxSdk.attestation.findOneById(attestationId);

      expect(result).not.toBeUndefined();
      expect(result?.id).toEqual(attestationId);
      expect(result?.schema.id).toEqual("0x5dc8bc9158dd69ee8a234bb8f9ab1f4f17bb52c84b6fd4720d58ec82bb43d2f5");
      expect(result?.schema.name).toEqual("Token Balance");
      expect(result?.schema.description).toEqual("Describes a balance owned on a contract");
      expect(result?.schema.context).toEqual(
        "Describes a token balance owned on a contract (ERC-20, ERC-721, ERC-1155, etc.)",
      );
      expect(result?.schema.schema).toEqual("(address contract, uint256 balance)");
      expect(result?.schema.attestationCounter).toBeGreaterThanOrEqual(26);
      expect(result?.replacedBy).toEqual("0x0000000000000000000000000000000000000000000000000000000000000000");
      expect(result?.attester).toEqual("0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d");
      expect(result?.portal.id).toEqual("0x0cb56f201e7afe02e542e2d2d42c34d4ce7203f7");
      expect(result?.portal.name).toEqual("eFrogs Portal");
      expect(result?.portal.description).toEqual("eFrogs attestations");
      expect(result?.portal.modules).toEqual([]);
      expect(result?.portal.isRevocable).toBeTruthy();
      expect(result?.portal.attestationCounter).toBeGreaterThanOrEqual(26);
      expect(result?.portal.ownerAddress).toEqual("0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d");
      expect(result?.portal.ownerName).toEqual("alainnicolas.eth");
      expect(result?.attestedDate).toEqual(1718025507);
      expect(result?.expirationDate).toEqual(1720617499);
      expect(result?.revocationDate).toEqual(0);
      expect(result?.version).toEqual(0);
      expect(result?.revoked).toBeFalsy();
      expect(result?.subject).toEqual("0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d");
      expect(result?.attestationData).toEqual(
        "0x00000000000000000000000035c134262605bc69b3383ea132a077d09d8df0610000000000000000000000000000000000000000000000000000000000000006",
      );
      expect(result?.decodedData).toEqual(["0x35c134262605bc69b3383ea132a077d09d8df061", "0x6"]);
      expect(result?.decodedPayload).toEqual([
        {
          contract: "0x35c134262605bc69B3383EA132A077d09d8df061",
          balance: 6n,
        },
      ]);
    });
  });

  describe("findBy", () => {
    it("should get 2 attestations", async () => {
      const result = await veraxSdk.attestation.findBy(2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
    });

    it("should get 2 attestations from a specific attester", async () => {
      const attesterAddress = "0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d";
      const result = await veraxSdk.attestation.findBy(2, 0, { attester: attesterAddress });

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].attester).toBe(attesterAddress);
      expect(result[1].attester).toBe(attesterAddress);
    });

    it("should get 3 attestations from a specific attester ordered by ascending attestation date", async () => {
      const attesterAddress = "0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d";
      const result = await veraxSdk.attestation.findBy(3, 0, { attester: attesterAddress }, "attestedDate", "asc");

      expect(result).not.toBeNull();
      expect(result.length).toBe(3);
      expect(result[0].attester).toBe(attesterAddress);
      expect(result[1].attester).toBe(attesterAddress);
      expect(result[2].attester).toBe(attesterAddress);
      expect(result[0].id).toBe("0x000000000000000000000000000000000000000000000000000000000000002e");
      expect(result[1].id).toBe("0x000000000000000000000000000000000000000000000000000000000000002f");
      expect(result[2].id).toBe("0x0000000000000000000000000000000000000000000000000000000000000030");
    });
  });

  describe("getRelatedAttestations", () => {
    it("should return the attestations related to a given attestation", async () => {
      const attestationId = "0x0000000000000000000000000000000000000000000000000000000000000129";

      const result = await veraxSdk.attestation.getRelatedAttestations(attestationId);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
    });
  });
});
