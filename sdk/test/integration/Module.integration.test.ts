import VeraxSdk from "../../src/VeraxSdk";

describe("ModuleDataMapper", () => {
  let veraxSdk: VeraxSdk;

  beforeAll(() => {
    veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);
  });

  describe("findOneById", () => {
    it("should return the expected module", async () => {
      const moduleId = "0xf75be6f9418710fd516fa82afb3aad07e11a0f1b";

      const result = await veraxSdk.module.findOneById(moduleId);

      expect(result).not.toBeNull();
      expect(result.id).toEqual(moduleId);
      expect(result.moduleAddress).toEqual(moduleId);
      expect(result.name).toEqual("Msg Sender Module");
      expect(result.description).toEqual("Checks if attestation was sent from a specific address");
    });
  });

  describe("findBy", () => {
    it("should get 2 modules", async () => {
      const result = await veraxSdk.module.findBy(2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
    });

    it("should get 2 modules with a name containing 'CorrectModule'", async () => {
      const partialName = "CorrectModule";
      const result = await veraxSdk.module.findBy(2, 0, { name_contains: partialName });

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
    });

    it("should get 3 modules with a name containing 'CorrectModule' ordered by descending name", async () => {
      const partialName = "CorrectModule";
      const result = await veraxSdk.module.findBy(3, 0, { name_contains: partialName }, "name", "desc");

      expect(result).not.toBeNull();
      expect(result.length).toBe(3);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
      expect(result[2].name).toContain(partialName);
      expect(result[0].name).toEqual("ZZ - CorrectModule");
      expect(result[1].name).toEqual("CC - CorrectModule");
      expect(result[2].name).toEqual("AA - CorrectModule");
    });
  });
});
