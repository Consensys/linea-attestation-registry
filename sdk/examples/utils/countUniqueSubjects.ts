import fs from "fs";
import path from "path";
import { VeraxSdk } from "../../src/VeraxSdk";

const BATCH_SIZE = 100000;

const fetchSubjectsFromFile = async (fileSuffix: number): Promise<string[]> => {
  console.log(`Reading file #${fileSuffix}...`);
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, `../../allSubjects-${fileSuffix}.txt`), "utf8"));
};

async function main() {
  const veraxSdk = new VeraxSdk(VeraxSdk.DEFAULT_LINEA_MAINNET);
  const attestationsNumber = await veraxSdk.utils.getAttestationIdCounter();
  const filesNumber = Math.ceil(Number(attestationsNumber) / BATCH_SIZE);

  const allSubjects: string[][] = [];
  const uniqueSubjects: Set<string> = new Set<string>();

  for (let i = 0; i <= filesNumber; i++) {
    allSubjects.push(await fetchSubjectsFromFile(i));
  }

  console.log(`Total subjects = ${allSubjects.reduce((total, subjects) => total + subjects.length, 0)}`);

  for (const array of allSubjects) {
    for (const subject of array) {
      uniqueSubjects.add(subject);
    }
  }

  console.log(`Unique subjects = ${uniqueSubjects.size}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
