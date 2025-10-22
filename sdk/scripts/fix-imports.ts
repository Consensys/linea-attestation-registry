import * as fs from "fs";

const fixImports = (): void => {
  try {
    const filePath = "lib/src/VeraxSdk.js";
    const content = fs.readFileSync(filePath, "utf8");

    // Replace the dynamic import syntax
    const updatedContent = content.replace(
      /var asyncImport = \(moduleName\) => import\(`\${moduleName}`\);/g,
      "var asyncImport = function(moduleName) { return import(/* @vite-ignore */ moduleName); };",
    );

    fs.writeFileSync(filePath, updatedContent);
    console.log("Successfully fixed dynamic imports in VeraxSdk.js");
  } catch (error) {
    console.error("Error fixing imports:", error);
    process.exit(1);
  }
};

fixImports();
