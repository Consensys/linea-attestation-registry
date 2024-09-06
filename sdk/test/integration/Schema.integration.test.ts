import { VeraxSdk } from "../../src/VeraxSdk";

describe("SchemaDataMapper", () => {
  let veraxSdk: VeraxSdk;

  beforeAll(() => {
    veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA);
  });

  describe("findOneById", () => {
    it("should return the expected schema", async () => {
      const schemaId = "0x5dc8bc9158dd69ee8a234bb8f9ab1f4f17bb52c84b6fd4720d58ec82bb43d2f5";

      const result = await veraxSdk.schema.findOneById(schemaId);

      expect(result).not.toBeUndefined();
      expect(result?.id).toEqual(schemaId);
      expect(result?.name).toEqual("Token Balance");
      expect(result?.description).toEqual("Describes a balance owned on a contract");
      expect(result?.context).toEqual(
        "Describes a token balance owned on a contract (ERC-20, ERC-721, ERC-1155, etc.)",
      );
      expect(result?.schema).toEqual("(address contract, uint256 balance)");
      expect(result?.attestationCounter).toBeGreaterThanOrEqual(27);
    });
  });

  describe("findBy", () => {
    it("should get 2 schemas", async () => {
      const result = await veraxSdk.schema.findBy(2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
    });

    it("should get 2 schemas with a name containing 'Auditor'", async () => {
      const partialName = "Auditor";
      const result = await veraxSdk.schema.findBy(2, 0, { name_contains: partialName });

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
    });

    it("should get 3 schemas with a name containing 'Auditor' ordered by ascending schema string", async () => {
      const partialName = "Auditor";
      const result = await veraxSdk.schema.findBy(3, 0, { name_contains: partialName }, "schema", "asc");

      expect(result).not.toBeNull();
      expect(result.length).toBe(3);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
      expect(result[2].name).toContain(partialName);
      expect(result[0].id).toEqual("0x7371271637f5242e7a97c3bc0b55af411f613f14f857282ce70a3c908a5cac16");
      expect(result[1].id).toEqual("0xdd2988d5d77f170056379222139499418bc23f796b19c8340067370cdccf8ffd");
      expect(result[2].id).toEqual("0x38decc6b43074bf3b8a6d651f4a869e0895df1f05670bd55091e9dcf3f2d5bd6");
    });
  });
});
