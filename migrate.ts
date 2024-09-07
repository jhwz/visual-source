import { migrate } from "svelte/compiler";
import fs from "fs";

// // iterate recursively over all the .svelte files in src
const walk = (dir: string, callback: (path: string) => void) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filename = path.join(dir, file);
    if (fs.statSync(filename).isDirectory()) {
      walk(filename, callback);
    } else if (file.endsWith(".svelte")) {
      callback(filename);
    }
  }
};

// walk("src", (path) => {
//   const source = fs.readFileSync(path, "utf-8");
//   const result = migrate(source);
//   fs.writeFileSync(path, result.code);
// });

const filename = "./src/lib/Button.svelte";
const source = fs.readFileSync(filename, "utf-8");
const result = migrate(source);
fs.writeFileSync(filename, result.code);
