import { VeraxSdk } from "../../src/VeraxSdk";
import fs from "fs";
import path from "path";

const BATCH_SIZE = 100000;

const fetchSubjectsFromFile = async (fileSuffix: number): Promise<string[]> => {
  console.log(`Reading file #${fileSuffix}...`);
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../allSubjects-${fileSuffix}.txt`), "utf8"));
};

async function main() {
  const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_MAINNET);
  const attestationNumber = await veraxSdk.attestation.getAttestationIdCounter();
  const filesNumber = Math.ceil(Number(attestationNumber) / BATCH_SIZE);

  const allSubjects: string[][] = [];
  const uniqueSubjects: Set<string> = new Set<string>();

  for (let i = 0; i < filesNumber; i++) {
    allSubjects.push(await fetchSubjectsFromFile(i));
  }

  console.log(`Total subjects = ${allSubjects.reduce((total, subjects) => total + subjects.length, 0)}`);

  for (const array of allSubjects) {
    for (const subject of array) {
      uniqueSubjects.add(subject);
    }
  }

  console.log(`Unique subjects = ${uniqueSubjects.size}`);

  const uniqueSubjectsArray = Array.from(uniqueSubjects);
  const chunks = Math.ceil(uniqueSubjectsArray.length / BATCH_SIZE);

  for (let i = 0; i < chunks; i++) {
    const start = i * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const chunk = uniqueSubjectsArray.slice(start, end);

    fs.writeFile(path.resolve(__dirname, `../../uniqueSubjects-${i}.txt`), JSON.stringify(chunk), function (err) {
      if (err) {
        return console.log(err);
      }

      console.log(`File uniqueSubjects-${i}.txt was saved!`);
    });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
