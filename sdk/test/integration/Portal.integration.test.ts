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
      const partialName = "eFrogs";
      const result = await veraxSdk.portal.findBy(3, 0, { name_contains: partialName });

      expect(result).not.toBeNull();
      expect(result.length).toBe(3);
      expect(result[0].name).toContain(partialName);
      expect(result[0].id).toEqual("0x0cb56f201e7afe02e542e2d2d42c34d4ce7203f7");
      expect(result[1].name).toContain(partialName);
      expect(result[1].id).toEqual("0x2b4af326976c29adb9846209b5f0eab09e1facc2");
      expect(result[2].name).toContain(partialName);
      expect(result[2].id).toEqual("0x79c06b913c42fd960b6917798c39edff292835f1");
    });
  });
});
