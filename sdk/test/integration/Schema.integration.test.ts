import { VeraxSdk } from "../../src/VeraxSdk";

describe("SchemaDataMapper", () => {
  let veraxSdk: VeraxSdk;

  beforeAll(() => {
    veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);
  });

  describe("findOneById", () => {
    it("should return the expected schema", async () => {
      const schemaId = "0x69e4d197cd9cb19f5640f60caf7372ed3e3b0e4b0d78d1fcf0e8d83099360e6e";

      const result = await veraxSdk.schema.findOneById(schemaId);

      expect(result).not.toBeUndefined();
      expect(result?.id).toEqual(schemaId);
      expect(result?.name).toEqual("Is a Contributor");
      expect(result?.description).toEqual("Define the list of contributors");
      expect(result?.context).toEqual("Contributors to a project");
      expect(result?.schema).toEqual("(bool isAContributor)");
    });
  });

  describe("findBy", () => {
    it("should get 2 schemas", async () => {
      const result = await veraxSdk.schema.findBy(2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
    });

    it("should get 2 schemas with a name containing 'PADO'", async () => {
      const partialName = "PADO";
      const result = await veraxSdk.schema.findBy(2, 0, { name_contains: partialName });

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
    });

    it("should get 3 schemas with a name containing 'PADO' ordered by ascending schema string", async () => {
      const partialName = "PADO";
      const result = await veraxSdk.schema.findBy(3, 0, { name_contains: partialName }, "schema", "asc");

      expect(result).not.toBeNull();
      expect(result.length).toBe(3);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
      expect(result[2].name).toContain(partialName);
      expect(result[0].id).toEqual("0x84fdf5748d9af166503472ff5deb0cd5f61f006169424805fd5554356ac6df10");
      expect(result[1].id).toEqual("0x89c0a9424f9d62c6cde9feb83653033899fe5df952beab024e38a13c3aae3ee9");
      expect(result[2].id).toEqual("0xc9992483a7da0207213d34288b835094b48567290cecf044c48913d3f1472a3a");
    });
  });
});
