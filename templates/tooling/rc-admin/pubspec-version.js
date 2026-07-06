import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo-root pubspec.yaml (tool/firebase/rc-admin → ../../../). */
const PUBSPEC_PATH = path.resolve(__dirname, '../../../pubspec.yaml');

/**
 * Read the version **name** from pubspec.yaml (part before `+`).
 * @returns {string}
 */
export function readPubspecVersion() {
  const raw = fs.readFileSync(PUBSPEC_PATH, 'utf8');
  const match = raw.match(/^version:\s*([^\s+#]+)/m);
  if (!match) {
    throw new Error(`Could not parse version from ${PUBSPEC_PATH}`);
  }
  const full = match[1].trim();
  return full.split('+')[0];
}
