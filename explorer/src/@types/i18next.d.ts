import en from "@/assets/locales/en/en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "ns1";
    resources: {
      ns1: typeof en;
    };
  }
}
