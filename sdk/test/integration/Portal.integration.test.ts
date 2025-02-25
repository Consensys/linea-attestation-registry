import { VeraxSdk } from "../../src/VeraxSdk";

describe("PortalDataMapper", () => {
  let veraxSdk: VeraxSdk;

  beforeAll(() => {
    veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_SEPOLIA);
  });

  describe("findOneById", () => {
    it("should return the expected portal", async () => {
      const portalId = "0x0cb56f201e7afe02e542e2d2d42c34d4ce7203f7";

      const result = await veraxSdk.portal.findOneById(portalId);

      expect(result).not.toBeUndefined();
      expect(result?.id).toEqual(portalId);
      expect(result?.ownerAddress).toEqual("0x6ecfd8252c19ac2bf4bd1cbdc026c001c93e179d");
      expect(result?.modules).toEqual([]);
      expect(result?.isRevocable).toBeTruthy();
      expect(result?.name).toEqual("eFrogs Portal");
      expect(result?.description).toEqual("eFrogs attestations");
      expect(result?.ownerName).toEqual("alainnicolas.eth");
      expect(result?.attestationCounter).toBeGreaterThanOrEqual(26);
    });
  });

  describe("findBy", () => {
    it("should get 2 portals", async () => {
      const result = await veraxSdk.portal.findBy(2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
    });

    it("should get 2 portals with a name containing 'eFrogs'", async () => {
      const partialName = "eFrogs";
      const result = await veraxSdk.portal.findBy(2, 0, { name_contains: partialName });

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
    });

    it("should get 3 portals with a name containing 'eFrogs' ordered by ascending ID", async () => {
      const partialName = "Integration Tests";
      const result = await veraxSdk.portal.findBy(3, 0, { name_contains: partialName });

      expect(result).not.toBeNull();
      expect(result.length).toBe(3);
      expect(result[0].name).toContain(partialName);
      expect(result[0].id).toEqual("0x3c3e9149c9c14054c79f83a1d4b7003c1491f5b4");
      expect(result[1].name).toContain(partialName);
      expect(result[1].id).toEqual("0x42ff66bf60066219a3659aa7a7e3e93860958fec");
      expect(result[2].name).toContain(partialName);
      expect(result[2].id).toEqual("0x63a7746518720b8d13cb4e626454f761fc8848e2");
    });
  });
});
