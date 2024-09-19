import { Resolvers, MeshContext } from "../.graphclient";

export const resolvers: Resolvers = {
  Attestation: {
    chainName: (root, args, context, info) => root.chainName || context.chainName || "verax-v2-linea", // The value we provide in the config
  },
  Portal: {
    chainName: (root, args, context, info) => root.chainName || context.chainName || "verax-v2-linea", // The value we provide in the config
  },
  Schema: {
    chainName: (root, args, context, info) => root.chainName || context.chainName || "verax-v2-linea", // The value we provide in the config
  },
  Module: {
    chainName: (root, args, context, info) => root.chainName || context.chainName || "verax-v2-linea", // The value we provide in the config
  },
  Query: {
    multichainAttestations: async (root, args, context, info) =>
      Promise.all(
        args.chainNames.map((chainName) =>
          context["linea-attestation-registry"].Query.attestations({
            root,
            args,
            context: {
              ...context,
            },
            info,
          }).then((attestations: any[]) =>
            attestations.map((attestation) => ({
              ...attestation,
              chainName,
            })),
          ),
        ),
      ).then((allAttestations) => allAttestations.flat()),
    multichainPortals: async (root, args, context, info) =>
      Promise.all(
        args.chainNames.map((chainName) =>
          context["linea-attestation-registry"].Query.portals({
            root,
            args,
            context: {
              ...context,
            },
            info,
          }).then((portals: any[]) =>
            // We send chainName here so we can take it in the resolver above
            portals.map((portal) => ({
              ...portal,
              chainName,
            })),
          ),
        ),
      ).then((allPortals) => allPortals.flat()),
    multichainSchemas: async (root, args, context, info) =>
      Promise.all(
        args.chainNames.map((chainName) =>
          context["linea-attestation-registry"].Query.schemas({
            root,
            args,
            context: {
              ...context,
            },
            info,
          }).then((schemas: any[]) =>
            // We send chainName here so we can take it in the resolver above
            schemas.map((schema: any) => ({
              ...schema,
              chainName,
            })),
          ),
        ),
      ).then((allSchemas) => allSchemas.flat()),
    multichainModules: async (root, args, context, info) =>
      Promise.all(
        args.chainNames.map((chainName) =>
          context["linea-attestation-registry"].Query.modules({
            root,
            args,
            context: {
              ...context,
            },
            info,
          }).then((modules: any[]) =>
            // We send chainName here so we can take it in the resolver above
            modules.map((module: any) => ({
              ...module,
              chainName,
            })),
          ),
        ),
      ).then((allModules) => allModules.flat()),
  },
};
