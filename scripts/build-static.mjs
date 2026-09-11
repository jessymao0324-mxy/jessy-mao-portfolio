import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of ["index.html", "styles.css", "experience-overrides.css", "script.js", "favicon.svg"]) {
  copyFileSync(join(root, file), join(dist, file));
}

for (const directory of ["assets", "data", "canva-assets"]) {
  const source = join(root, directory);
  if (existsSync(source)) {
    cpSync(source, join(dist, directory), {
      recursive: true,
      filter: (path) => !path.endsWith("reference-video.mp4")
    });
  }
}
