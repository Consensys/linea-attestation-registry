import { ethers, upgrades } from "hardhat";

const DEFAULT_RPC_RETRY_ATTEMPTS = 5;
const DEFAULT_RPC_RETRY_BASE_MS = 1500;

function resolveRpcRetryAttempts(): number {
  const raw = process.env.UPGRADEABILITY_RPC_RETRIES?.trim();
  if (raw === undefined || raw === "") return DEFAULT_RPC_RETRY_ATTEMPTS;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return DEFAULT_RPC_RETRY_ATTEMPTS;
  return Math.max(1, Math.floor(n));
}

function resolveRpcRetryBaseMs(): number {
  const raw = process.env.UPGRADEABILITY_RPC_RETRY_BASE_MS?.trim();
  if (raw === undefined || raw === "") return DEFAULT_RPC_RETRY_BASE_MS;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return DEFAULT_RPC_RETRY_BASE_MS;
  return n;
}

const RPC_RETRY_ATTEMPTS = resolveRpcRetryAttempts();
const RPC_RETRY_BASE_MS = resolveRpcRetryBaseMs();

function isTransientRpcError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  if (/internal error/i.test(msg)) return true;
  if (/ECONNRESET|ETIMEDOUT|ENETUNREACH|socket hang up|fetch failed/i.test(msg)) return true;
  return /429|502|503|504/.test(msg);
}

async function withTransientRpcRetry<T>(operation: string, fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; attempt <= RPC_RETRY_ATTEMPTS; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (!isTransientRpcError(error) || attempt === RPC_RETRY_ATTEMPTS) {
        throw error;
      }
      const delay = RPC_RETRY_BASE_MS * 2 ** (attempt - 1);
      console.warn(
        `${operation}: transient RPC error (attempt ${attempt}/${RPC_RETRY_ATTEMPTS}). Retrying in ${delay}ms…`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error(`${operation}: retry loop exited without invoking the operation; check UPGRADEABILITY_RPC_RETRIES`);
}

/*
 * This script aims to dynamically check if the contracts are upgradeable.
 * Validates a new implementation contract without deploying it and without actually upgrading to it.
 * OpenZeppelin doc: https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#validate-upgrade
 * Note: this does run the check against the already deployed version of the registries.
 */
async function main() {
  console.log("Checking contracts for upgradeability...");

  console.log("Checking Router...");
  const routerProxyAddress = process.env.ROUTER_ADDRESS ?? "";
  const Router = await ethers.getContractFactory("Router");

  await withTransientRpcRetry("Router", () =>
    upgrades.validateUpgrade(routerProxyAddress, Router, { kind: "transparent" }),
  );

  console.log("Checking AttestationRegistry...");
  const attestationRegistryProxyAddress = process.env.ATTESTATION_REGISTRY_ADDRESS ?? "";
  const AttestationRegistry = await ethers.getContractFactory("AttestationRegistry");

  await withTransientRpcRetry("AttestationRegistry", () =>
    upgrades.validateUpgrade(attestationRegistryProxyAddress, AttestationRegistry, { kind: "transparent" }),
  );

  console.log("Checking ModuleRegistry...");
  const moduleRegistryProxyAddress = process.env.MODULE_REGISTRY_ADDRESS ?? "";
  const ModuleRegistry = await ethers.getContractFactory("ModuleRegistry");

  await withTransientRpcRetry("ModuleRegistry", () =>
    upgrades.validateUpgrade(moduleRegistryProxyAddress, ModuleRegistry, { kind: "transparent" }),
  );

  console.log("Checking PortalRegistry...");
  const portalRegistryProxyAddress = process.env.PORTAL_REGISTRY_ADDRESS ?? "";
  const PortalRegistry = await ethers.getContractFactory("PortalRegistry");

  await withTransientRpcRetry("PortalRegistry", () =>
    upgrades.validateUpgrade(portalRegistryProxyAddress, PortalRegistry, {
      kind: "transparent",
    }),
  );

  console.log("Checking SchemaRegistry...");
  const schemaRegistryProxyAddress = process.env.SCHEMA_REGISTRY_ADDRESS ?? "";
  const SchemaRegistry = await ethers.getContractFactory("SchemaRegistry");

  await withTransientRpcRetry("SchemaRegistry", () =>
    upgrades.validateUpgrade(schemaRegistryProxyAddress, SchemaRegistry, { kind: "transparent" }),
  );

  const attestationReaderProxyAddress = process.env.ATTESTATION_READER_ADDRESS;

  if (attestationReaderProxyAddress) {
    console.log("Checking AttestationReader...");
    const AttestationReader = await ethers.getContractFactory("AttestationReader");

    await withTransientRpcRetry("AttestationReader", () =>
      upgrades.validateUpgrade(attestationReaderProxyAddress, AttestationReader, { kind: "transparent" }),
    );
  }

  console.log("All contracts are upgradeable!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
