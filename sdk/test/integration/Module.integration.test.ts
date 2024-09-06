import { VeraxSdk } from "../../src/VeraxSdk";

describe("ModuleDataMapper", () => {
  let veraxSdk: VeraxSdk;

  beforeAll(() => {
    veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA);
  });

  describe("findOneById", () => {
    it("should return the expected module", async () => {
      const moduleId = "0xefdec213b52ed164723dfd9723ac80f73d66fb80";

      const result = await veraxSdk.module.findOneById(moduleId);

      expect(result).not.toBeUndefined();
      expect(result?.id).toEqual(moduleId);
      expect(result?.moduleAddress).toEqual(moduleId);
      expect(result?.name).toEqual("TestArrModule");
      expect(result?.description).toEqual("This Module is used as an example of TestArrModule");
    });
  });

  describe("findBy", () => {
    it("should get 2 modules", async () => {
      const result = await veraxSdk.module.findBy(2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
    });

    it("should get 2 modules with a name containing 'ZKPVerifyModule'", async () => {
      const partialName = "ZKPVerifyModule";
      const result = await veraxSdk.module.findBy(2, 0, { name_contains: partialName });

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
    });

    it("should get 5 modules with a name containing 'ZKP' ordered by descending name", async () => {
      const partialName = "ZKP";
      const result = await veraxSdk.module.findBy(5, 0, { name_contains: partialName }, "name", "desc");

      expect(result).not.toBeNull();
      expect(result.length).toBe(5);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
      expect(result[2].name).toContain(partialName);
      expect(result[3].name).toContain(partialName);
      expect(result[4].name).toContain(partialName);
      expect(result[0].name).toEqual("ZKPVerifyModulePoU");
      expect(result[1].name).toEqual("ZKPVerifyModulePoU");
      expect(result[2].name).toEqual("ZKPVerifyModulePoU");
      expect(result[3].name).toEqual("ZKPVerifyModulePoU");
      expect(result[4].name).toEqual("ZKPVerifyModulePoL");
    });
  });
});
