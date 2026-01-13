import { Attestation, MeshContext, Module, Portal, Resolvers, Schema } from "../.graphclient";

// Extended context with chainName for multichain queries
type ExtendedMeshContext = MeshContext & { chainName?: string };

/**
 * Helper to extract successful results from Promise.allSettled.
 * Filters out rejected promises and returns only fulfilled values.
 */
function getSuccessfulResults<T>(results: PromiseSettledResult<T>[]): T[] {
  return results
    .filter((result): result is PromiseFulfilledResult<T> => result.status === "fulfilled")
    .map((result) => result.value);
}

export const resolvers: Resolvers = {
  Attestation: {
    chainName: (root, _args, context) =>
      root.chainName || (context as ExtendedMeshContext).chainName || "verax-v2-linea",
  },
  Portal: {
    chainName: (root, _args, context) =>
      root.chainName || (context as ExtendedMeshContext).chainName || "verax-v2-linea",
  },
  Schema: {
    chainName: (root, _args, context) =>
      root.chainName || (context as ExtendedMeshContext).chainName || "verax-v2-linea",
  },
  Module: {
    chainName: (root, _args, context) =>
      root.chainName || (context as ExtendedMeshContext).chainName || "verax-v2-linea",
  },
  Query: {
    multichainAttestations: async (root, args, context, info) => {
      const results = await Promise.allSettled(
        args.chainNames.map((chainName) =>
          context["linea-attestation-registry"].Query.attestations({
            root,
            args,
            context: {
              ...context,
              chainName,
            } as ExtendedMeshContext,
            info,
          }).then((attestations: Attestation[]) =>
            attestations.map((attestation: Attestation) => ({
              ...attestation,
              chainName,
            })),
          ),
        ),
      );
      return getSuccessfulResults(results).flat();
    },
    multichainPortals: async (root, args, context, info) => {
      const results = await Promise.allSettled(
        args.chainNames.map((chainName) =>
          context["linea-attestation-registry"].Query.portals({
            root,
            args,
            context: {
              ...context,
              chainName,
            } as ExtendedMeshContext,
            info,
          }).then((portals: Portal[]) =>
            portals.map((portal: Portal) => ({
              ...portal,
              chainName,
            })),
          ),
        ),
      );
      return getSuccessfulResults(results).flat();
    },
    multichainSchemas: async (root, args, context, info) => {
      const results = await Promise.allSettled(
        args.chainNames.map((chainName) =>
          context["linea-attestation-registry"].Query.schemas({
            root,
            args,
            context: {
              ...context,
              chainName,
            } as ExtendedMeshContext,
            info,
          }).then((schemas: Schema[]) =>
            schemas.map((schema: Schema) => ({
              ...schema,
              chainName,
            })),
          ),
        ),
      );
      return getSuccessfulResults(results).flat();
    },
    multichainModules: async (root, args, context, info) => {
      const results = await Promise.allSettled(
        args.chainNames.map((chainName) =>
          context["linea-attestation-registry"].Query.modules({
            root,
            args,
            context: {
              ...context,
              chainName,
            } as ExtendedMeshContext,
            info,
          }).then((modules: Module[]) =>
            modules.map((module: Module) => ({
              ...module,
              chainName,
            })),
          ),
        ),
      );
      return getSuccessfulResults(results).flat();
    },
  },
};
