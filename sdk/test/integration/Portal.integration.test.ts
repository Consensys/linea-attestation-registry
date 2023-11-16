import VeraxSdk from "../../src/VeraxSdk";

describe("PortalDataMapper", () => {
  let veraxSdk: VeraxSdk;

  beforeAll(() => {
    veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_TESTNET);
  });

  describe("findOneById", () => {
    it("should return the expected portal", async () => {
      const portalId = "0x0b991e5f3773b6a0f6e3672549cbfbd1178fbe22";

      const result = await veraxSdk.portal.findOneById(portalId);

      expect(result).not.toBeUndefined();
      expect(result?.id).toEqual(portalId);
      expect(result?.ownerAddress).toEqual("0xe02bd7a6c8aa401189aebb5bad755c2610940a73");
      expect(result?.modules).toEqual([]);
      expect(result?.isRevocable).toBeTruthy();
      expect(result?.name).toEqual("PADO Portal");
      expect(result?.description).toEqual("Portal of PADO");
      expect(result?.ownerName).toEqual("PADO");
    });
  });

  describe("findBy", () => {
    it("should get 2 portals", async () => {
      const result = await veraxSdk.portal.findBy(2);

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
    });

    it("should get 2 portals with a name containing 'PADO'", async () => {
      const partialName = "PADO";
      const result = await veraxSdk.portal.findBy(2, 0, { name_contains: partialName });

      expect(result).not.toBeNull();
      expect(result.length).toBe(2);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
    });

    it("should get 3 portals with a name containing 'PADO' ordered by ascending ID", async () => {
      const partialName = "PADO";
      const result = await veraxSdk.portal.findBy(3, 0, { name_contains: partialName });

      expect(result).not.toBeNull();
      expect(result.length).toBe(3);
      expect(result[0].name).toContain(partialName);
      expect(result[1].name).toContain(partialName);
      expect(result[2].name).toContain(partialName);
    });
  });
});
