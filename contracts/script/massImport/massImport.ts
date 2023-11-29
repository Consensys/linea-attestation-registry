import fs from "fs";
import { config } from "dotenv";
import path from "path";
import { AbiCoder, isAddress, parseUnits } from "ethers";
import { ethers } from "hardhat";
import { AttestationRegistry } from "../../typechain-types";
import { HardhatEthersProvider } from "@nomicfoundation/hardhat-ethers/internal/hardhat-ethers-provider";

config();

const processedBatchIds: number[] = [];

// *********************************************************************************
// ********************************* CONFIGURATION *********************************
// *********************************************************************************

const DEFAULT_MAX_FEE_PER_GAS = parseUnits("100", "gwei").toString();
const DEFAULT_GAS_ESTIMATION_PERCENTILE = "10";
const DEFAULT_GAS_PRICE_CAP = parseUnits("5", "gwei").toString();

type Config = {
  inputFile: string;
  trackingFile: string;
  portalAddress: `0x${string}`;
  maxFeePerGas: number;
  gasEstimationPercentile: number;
  gasPriceCap: number;
  attestationRegistry: AttestationRegistry;
};

type AttestationPayload = {
  schemaId: string;
  expirationDate: number;
  subject: string;
  attestationData: string;
};

type Batch = {
  id: number;
  payloads: AttestationPayload[];
};

type BatchMonitor = {
  id: number;
  payloads: AttestationPayload[];
  transactionHash?: string;
};

enum BatchStatuses {
  Failed = "Failed",
  Success = "Success",
  Pending = "Pending",
}

type TrackingData = {
  payloads: AttestationPayload[];
  status: BatchStatuses;
  transactionHash?: string;
  error?: unknown;
};

type Fees = {
  maxFeePerGas: bigint;
  maxPriorityFeePerGas?: bigint;
};

type FeeHistory = {
  oldestBlock: number;
  reward: string[][];
  baseFeePerGas: string[];
  gasUsedRatio: number[];
};

function requireEnv(name: string): string {
  const envVariable = process.env[name];
  if (!envVariable) {
    throw new Error(`Missing ${name} environment variable.`);
  }
  return envVariable;
}

async function getConfig(): Promise<Config> {
  const inputFile = requireEnv("INPUT_FILE");
  const trackingFile = requireEnv("TRACKING_FILE");
  const portalAddress = requireEnv("PORTAL_ADDRESS");
  const attestationRegistryAddress = requireEnv("ATTESTATION_REGISTRY_ADDRESS");

  if (!isAddress(portalAddress)) {
    throw new Error(`Portal address is not a valid Ethereum address.`);
  }

  if (!isAddress(attestationRegistryAddress)) {
    throw new Error(`Attestation Registry address is not a valid Ethereum address.`);
  }

  if (path.extname(inputFile) !== ".json") {
    throw new Error(`File ${inputFile} is not a JSON file.`);
  }

  if (path.extname(trackingFile) !== ".json") {
    throw new Error(`File ${trackingFile} is not a JSON file.`);
  }

  if (!fs.existsSync(inputFile)) {
    throw new Error(`File ${inputFile} does not exist.`);
  }

  const attestationRegistry: AttestationRegistry = await ethers.getContractAt(
    "AttestationRegistry",
    attestationRegistryAddress,
  );

  return {
    inputFile,
    trackingFile,
    portalAddress: portalAddress as `0x${string}`,
    maxFeePerGas: parseInt(process.env.MAX_FEE_PER_GAS ?? DEFAULT_MAX_FEE_PER_GAS),
    gasEstimationPercentile: parseInt(process.env.GAS_ESTIMATION_PERCENTILE ?? DEFAULT_GAS_ESTIMATION_PERCENTILE),
    gasPriceCap: parseFloat(process.env.GAS_PRICE_CAP ?? DEFAULT_GAS_PRICE_CAP),
    attestationRegistry,
  };
}

// *********************************************************************************
// ********************************* UTILS FUNCTIONS *******************************
// *********************************************************************************

export const wait = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout));

function createTrackingFile(path: string): Map<number, TrackingData> {
  if (fs.existsSync(path)) {
    const mapAsArray = fs.readFileSync(path, "utf-8");
    return new Map(JSON.parse(mapAsArray));
  }

  fs.writeFileSync(path, JSON.stringify(Array.from(new Map<number, TrackingData>().entries())));
  return new Map<number, TrackingData>();
}

function updateTrackingFile(trackingData: Map<number, TrackingData>, path: string) {
  fs.writeFileSync(path, JSON.stringify(Array.from(trackingData.entries()), null, 2));
}

async function processPendingBatches(
  provider: HardhatEthersProvider,
  batches: Batch[],
  trackingData: Map<number, TrackingData>,
  trackingFile: string,
): Promise<(Batch & { transactionHash?: string })[]> {
  const pendingBatches = batches
    .filter((batch) => trackingData.get(batch.id)?.status === BatchStatuses.Pending)
    .map((batch) => ({
      ...batch,
      transactionHash: trackingData.get(batch.id)?.transactionHash,
    }));

  const remainingPendingBatches: BatchMonitor[] = [];

  for (const { transactionHash, id, payloads } of pendingBatches) {
    if (!transactionHash) {
      remainingPendingBatches.push({
        id,
        payloads,
        transactionHash: "",
      });
      continue;
    }

    const receipt = await provider.getTransactionReceipt(transactionHash);

    if (!receipt) {
      remainingPendingBatches.push({ id, payloads, transactionHash });
      continue;
    }

    if (receipt.status == 0) {
      // track failing batches
      trackingData.set(id, {
        payloads,
        transactionHash,
        status: BatchStatuses.Failed,
      });

      console.log(`Transaction reverted. Hash: ${transactionHash}, batchId: ${id}`);
      updateTrackingFile(trackingData, trackingFile);

      // continue the batch loop
      continue;
    }
    // track successful batches
    trackingData.set(id, {
      payloads,
      transactionHash,
      status: BatchStatuses.Success,
    });

    updateTrackingFile(trackingData, trackingFile);
    console.log(`Transaction successful. Hash: ${transactionHash}, batchId: ${id}`);
  }

  return remainingPendingBatches;
}

async function get1559Fees(
  provider: HardhatEthersProvider,
  maxFeePerGasFromConfig: bigint,
  percentile: number,
): Promise<Fees> {
  const { reward, baseFeePerGas }: FeeHistory = await provider.send("eth_feeHistory", ["0x4", "latest", [percentile]]);

  const maxPriorityFeePerGas =
    reward.reduce((acc: bigint, currentValue: string[]) => acc + BigInt(currentValue[0]), 0n) / BigInt(reward.length);

  if (maxPriorityFeePerGas && maxPriorityFeePerGas > maxFeePerGasFromConfig) {
    throw new Error(
      `Estimated miner tip of ${maxPriorityFeePerGas} exceeds configured max fee per gas of ${maxFeePerGasFromConfig}.`,
    );
  }

  const maxFeePerGas = BigInt(baseFeePerGas[baseFeePerGas.length - 1]) * 2n + maxPriorityFeePerGas;

  if (maxFeePerGas > 0n && maxPriorityFeePerGas > 0n) {
    return {
      maxPriorityFeePerGas,
      maxFeePerGas: maxFeePerGas > maxFeePerGasFromConfig ? maxFeePerGasFromConfig : maxFeePerGas,
    };
  }

  return {
    maxFeePerGas: maxFeePerGasFromConfig,
  };
}

// *********************************************************************************
// ********************************* MAIN FUNCTION *********************************
// *********************************************************************************

async function main() {
  const {
    inputFile,
    trackingFile,
    portalAddress,
    maxFeePerGas,
    gasEstimationPercentile,
    gasPriceCap,
    attestationRegistry,
  } = await getConfig();

  const provider = ethers.provider;
  const { chainId } = await provider.getNetwork();
  const eip1559GasProvider = async () => get1559Fees(provider, BigInt(maxFeePerGas), gasEstimationPercentile);

  const trackingData = createTrackingFile(trackingFile);

  const readFile = fs.readFileSync(inputFile, "utf-8");
  const batches: Batch[] = JSON.parse(readFile);

  const filteredBatches = batches.filter(
    (batch) => trackingData.get(batch.id)?.status === BatchStatuses.Failed || !trackingData.has(batch.id),
  );

  console.log("Processing pending batches...");
  const remainingPendingBatches = await processPendingBatches(provider, batches, trackingData, trackingFile);

  if (remainingPendingBatches.length !== 0) {
    console.warn(`The following batches are still pending: ${JSON.stringify(remainingPendingBatches, null, 2)}`);
    return;
  }

  const accounts = await ethers.getSigners();
  const signer = accounts[0];
  let nonce = await provider.getTransactionCount(signer.address);

  const pendingTransactions = [];

  console.log(`Total number of batches to process: ${filteredBatches.length}.`);

  for (const [index, batch] of filteredBatches.entries()) {
    try {
      let fees = await eip1559GasProvider();

      while (fees.maxFeePerGas > gasPriceCap) {
        console.warn(`Max fee per gas (${fees.maxFeePerGas.toString()}) exceeds gas price cap (${gasPriceCap})`);

        const currentBlockNumber = await provider.getBlockNumber();
        while ((await provider.getBlockNumber()) === currentBlockNumber) {
          console.warn(`Waiting for next block: ${currentBlockNumber}`);
          await wait(4_000);
        }

        fees = await eip1559GasProvider();
      }

      const abiCoder = new AbiCoder();
      batch.payloads.forEach((payload) => {
        payload.schemaId = "0xd1664d97bd195df77e3d5fe78c1737ab3adaa38bbe52a680d1aa30fa51f186ba";
        payload.subject = abiCoder.encode(["address"], [payload.subject]);
        payload.attestationData = abiCoder.encode(["uint8"], [payload.attestationData]);
        payload.expirationDate = 1793835110;
        // TODO: add an expirationDate?
      });

      const transactionGasLimit = await attestationRegistry.massImport.estimateGas(batch.payloads, portalAddress);

      const txResponse = await attestationRegistry.massImport(batch.payloads, portalAddress, {
        type: 2,
        gasLimit: transactionGasLimit,
        chainId,
        maxFeePerGas: fees.maxFeePerGas,
        maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
        nonce,
      });

      pendingTransactions.push({ txResponse, batch });

      trackingData.set(batch.id, {
        payloads: batch.payloads,
        status: BatchStatuses.Pending,
        transactionHash: txResponse.hash,
      });

      updateTrackingFile(trackingData, trackingFile);

      processedBatchIds.push(batch.id);

      console.log(`Batch with ID = ${batch.id} sent.`);
      nonce = nonce + 1;
    } catch (error) {
      trackingData.set(batch.id, {
        payloads: batch.payloads,
        status: BatchStatuses.Failed,
        error,
      });
      updateTrackingFile(trackingData, trackingFile);
      console.error(error);
      console.error(`Batch with ID=${batch.id} failed.\n Stopping script execution.`);
      return;
    }

    if (index + (1 % 15) === 0) {
      console.log(`Pause the execution for 60 seconds...`);
      await wait(60_000);
    }
  }

  if (pendingTransactions.length !== 0) {
    console.log(`Waiting for all receipts...`);
  }

  const transactionsInfos = await Promise.all(
    pendingTransactions.map(async ({ txResponse, batch }) => {
      return {
        transactionReceipt: await txResponse.wait(),
        batch,
      };
    }),
  );

  for (const { batch, transactionReceipt } of transactionsInfos) {
    if (transactionReceipt) {
      if (transactionReceipt.status == 0) {
        trackingData.set(batch.id, {
          payloads: batch.payloads,
          status: BatchStatuses.Failed,
          transactionHash: transactionReceipt.hash,
        });

        console.log(`Transaction reverted. Hash: ${transactionReceipt.hash}, batchId: ${batch.id}`);
        updateTrackingFile(trackingData, trackingFile);
        continue;
      }

      trackingData.set(batch.id, {
        payloads: batch.payloads,
        status: BatchStatuses.Success,
        transactionHash: transactionReceipt.hash,
      });

      updateTrackingFile(trackingData, trackingFile);
      console.log(`Transaction successful. Hash: ${transactionReceipt.hash}, batchId: ${batch.id}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

process.on("SIGINT", () => {
  console.log(`Processed batches: ${JSON.stringify(processedBatchIds, null, 2)}`);
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  process.exit(1);
});
