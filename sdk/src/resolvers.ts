import { Attestation, Module, Portal, Resolvers, Schema } from "../.graphclient";

export const resolvers: Resolvers = {
  Attestation: {
    chainName: (root, _args, context) => root.chainName || context.chainName || "verax-v2-linea", // The value we provide in the config
  },
  Portal: {
    chainName: (root, _args, context) => root.chainName || context.chainName || "verax-v2-linea", // The value we provide in the config
  },
  Schema: {
    chainName: (root, _args, context) => root.chainName || context.chainName || "verax-v2-linea", // The value we provide in the config
  },
  Module: {
    chainName: (root, _args, context) => root.chainName || context.chainName || "verax-v2-linea", // The value we provide in the config
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
          }).then((attestations: Attestation[]) =>
            attestations.map((attestation: Attestation) => ({
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
          }).then((portals: Portal[]) =>
            // We send chainName here so we can take it in the resolver above
            portals.map((portal: Portal) => ({
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
          }).then((schemas: Schema[]) =>
            // We send chainName here so we can take it in the resolver above
            schemas.map((schema: Schema) => ({
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
          }).then((modules: Module[]) =>
            // We send chainName here so we can take it in the resolver above
            modules.map((module: Module) => ({
              ...module,
              chainName,
            })),
          ),
        ),
      ).then((allModules) => allModules.flat()),
  },
};
