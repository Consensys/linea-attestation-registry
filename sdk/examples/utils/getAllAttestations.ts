import { VeraxSdk } from "../../src/VeraxSdk";
import fs from "fs";
import path from "path";

const BATCH_SIZE = 100000;

const fetchAllAttestations = async (batchNumber: number, veraxSdk: VeraxSdk) => {
  let skip = 0;
  let hasMoreResults = true;
  const batch: string[] = [];

  while (hasMoreResults && batch.length < BATCH_SIZE) {
    console.log(`Query batch #${skip}`);
    const matchingAttestations = await veraxSdk.attestation.findBy(1000, skip * 1000 + batchNumber * BATCH_SIZE);

    if (matchingAttestations.length === 0) {
      hasMoreResults = false;
      continue;
    }

    const subjects = matchingAttestations.map((attestation) => attestation.subject);

    batch.push(...subjects);
    skip++;
  }

  return batch;
};

async function main() {
  const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_MAINNET);
  const attestationNumber = await veraxSdk.attestation.getAttestationIdCounter();
  const batchesNumber = Math.ceil(Number(attestationNumber) / BATCH_SIZE);

  console.log(`Creating ${batchesNumber} batches of ${BATCH_SIZE} items to get all ${attestationNumber} attestations.`);

  for (let i = 8; i < batchesNumber; i++) {
    console.log(`Attestation batch #${i}`);
    const subjectsBatch = await fetchAllAttestations(i, veraxSdk);

    fs.writeFile(path.resolve(__dirname, `../../allSubjects-${i}.txt`), JSON.stringify(subjectsBatch), function (err) {
      if (err) {
        return console.log(err);
      }

      console.log(`File #${i} was saved!`);
    });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
