import fs from "fs";

const BATCH_LENGTH = 100;

type RawPayload = {
  subject: string;
  attestationData: string;
};

type Batch = {
  id: number;
  payloads: RawPayload[];
};

const convertScoreToAttestation = (score: string): string => {
  const scoreNumber = parseInt(score);
  let result = 5;

  if (scoreNumber > 2500 && scoreNumber < 2740) {
    result = 4;
  } else if (scoreNumber >= 2740 && scoreNumber < 3050) {
    result = 3;
  } else if (scoreNumber >= 3050 && scoreNumber < 3400) {
    result = 2;
  } else if (scoreNumber >= 3400) {
    result = 5;
  }

  return result.toString();
};

const csvToJSON = (csv: string) => {
  const lines = csv.split("\n");
  const result: RawPayload[] = [];

  // Ignore line 0 (headers)
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(",");
    const address = currentLine[0];
    const rawScore = currentLine[1];

    if (address !== "" && rawScore !== "") {
      const attestationData = convertScoreToAttestation(rawScore);
      result.push({ subject: currentLine[0], attestationData });
    }
  }

  return result;
};

const createBatches = (rawPayloads: RawPayload[]) => {
  return Array.from({ length: Math.ceil(rawPayloads.length / BATCH_LENGTH) }, (v, i) =>
    rawPayloads.slice(i * BATCH_LENGTH, i * BATCH_LENGTH + BATCH_LENGTH),
  ).reverse();
};

const generateBatchIds = (batches: RawPayload[][]): Batch[] => {
  return batches.map((batch, index) => {
    return { id: index, payloads: batch };
  });
};

const generateSourceFile = (batches: Batch[]) => {
  fs.writeFileSync("script/massImport/source.json", JSON.stringify(batches, null, 2));
};

async function main() {
  console.log("Source file generating...");
  const readFile = fs.readFileSync("script/massImport/rawData.csv", "utf-8");
  const parsedData: RawPayload[] = csvToJSON(readFile);

  console.log(`Raw input contains ${parsedData.length} lines`);

  const batches: RawPayload[][] = createBatches(parsedData);

  console.log(`We have ${batches.length} batches of ${BATCH_LENGTH} items`);

  const finalBatches = generateBatchIds(batches);

  generateSourceFile(finalBatches);

  console.log("Source file generated!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
