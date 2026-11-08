// One entry for all generated art. Each script runs in its own process so its seeded jitter is reproducible.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
for (const f of ['sheet.mjs', 'home.mjs', 'about.mjs']) execFileSync(process.execPath, [path.join(here, f)], { stdio: 'inherit' });
