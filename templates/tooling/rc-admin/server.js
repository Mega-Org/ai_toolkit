import 'dotenv/config';
import { exec } from 'child_process';
import express from 'express';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  buildReviewOffPreset,
  buildReviewOnPreset,
  buildUpdateOffPreset,
  buildUpdateOnPreset,
  validateReviewPayload,
  validateUpdatePayload,
} from './payloads.js';
import { readPubspecVersion } from './pubspec-version.js';
import { ALL_KEYS, FEATURES, FLAVORS, PLATFORMS, resolveKeys } from './rc-keys.js';
import {
  PARAMETER_GROUPS,
  findParameter,
  needsGroupMigration,
  setGroupedParameter,
  syncParameterGroups,
} from './rc-groups.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const projectId = process.env.FIREBASE_PROJECT_ID;
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const port = Number(process.env.PORT ?? 3847);
const adminToken = process.env.ADMIN_TOKEN;

if (!projectId) {
  console.error('FIREBASE_PROJECT_ID is required. Copy .env.example to .env');
  process.exit(1);
}

if (!credentialsPath) {
  console.error(
    'GOOGLE_APPLICATION_CREDENTIALS is required. Copy .env.example to .env',
  );
  process.exit(1);
}

if (!fs.existsSync(credentialsPath)) {
  console.error(`Service account file not found: ${credentialsPath}`);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(credentialsPath),
  projectId,
});

const app = express();
app.use(express.json());

function requireAdminToken(req, res, next) {
  if (adminToken && req.headers['x-admin-token'] !== adminToken) {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
    return;
  }
  next();
}

app.use('/api', requireAdminToken);

/**
 * @param {import('firebase-admin/remote-config').RemoteConfigTemplate} template
 * @param {string} key
 * @returns {unknown | null}
 */
function readParameterValue(template, key) {
  const param = findParameter(template, key);
  const raw = param?.defaultValue?.value;
  if (raw == null || raw === '') {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return { _raw: raw, _parseError: true };
  }
}

/**
 * @param {string[]} keys
 * @param {Record<string, unknown>} payload
 */
async function publishToKeys(keys, payload) {
  const template = await admin.remoteConfig().getTemplate();
  const value = JSON.stringify(payload);
  const definition = {
    defaultValue: { value },
    valueType: 'JSON',
  };

  for (const key of keys) {
    setGroupedParameter(template, key, definition);
  }

  syncParameterGroups(template);

  await admin.remoteConfig().validateTemplate(template);
  const etag = await admin.remoteConfig().publishTemplate(template);
  return etag;
}

app.get('/api/meta', (_req, res) => {
  res.json({
    projectId,
    appVersion: readPubspecVersion(),
    features: FEATURES,
    flavors: FLAVORS,
    platforms: PLATFORMS,
    keys: ALL_KEYS,
    parameterGroups: PARAMETER_GROUPS,
  });
});

app.get('/api/config', async (_req, res) => {
  try {
    const template = await admin.remoteConfig().getTemplate();
    /** @type {Record<string, unknown | null>} */
    const config = {};
    for (const key of ALL_KEYS) {
      config[key] = readParameterValue(template, key);
    }
    res.json({
      ok: true,
      config,
      needsGroupMigration: needsGroupMigration(template),
      parameterGroups: Object.keys(PARAMETER_GROUPS),
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: formatError(err) });
  }
});

app.post('/api/sync-groups', async (_req, res) => {
  try {
    const template = await admin.remoteConfig().getTemplate();
    const migrated = syncParameterGroups(template);
    await admin.remoteConfig().validateTemplate(template);
    const etag = await admin.remoteConfig().publishTemplate(template);
    res.json({
      ok: true,
      migrated,
      parameterGroups: PARAMETER_GROUPS,
      etag,
      message:
        migrated.length > 0
          ? `Moved ${migrated.length} key(s) into Console groups`
          : 'Console groups already up to date',
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: formatError(err) });
  }
});

app.post('/api/push', async (req, res) => {
  try {
    const { feature, flavor, platform, payload } = req.body ?? {};
    const keys = resolveKeys(feature, flavor, platform);

    const validated =
      feature === 'storeReview'
        ? validateReviewPayload(payload)
        : feature === 'storeUpdater'
          ? validateUpdatePayload(payload)
          : (() => {
              throw new Error(`Invalid feature: ${feature}`);
            })();

    const etag = await publishToKeys(keys, validated);
    res.json({
      ok: true,
      keys,
      payload: validated,
      etag,
      message: `Published ${keys.length} key(s)`,
    });
  } catch (err) {
    res.status(400).json({ ok: false, error: formatError(err) });
  }
});

app.post('/api/presets/review-on', async (req, res) => {
  try {
    const { flavor, platform, version } = req.body ?? {};
    const keys = resolveKeys('storeReview', flavor, platform);
    const payload = buildReviewOnPreset(version);
    const etag = await publishToKeys(keys, payload);
    res.json({ ok: true, keys, payload, etag, message: `Review ON — ${keys.length} key(s)` });
  } catch (err) {
    res.status(400).json({ ok: false, error: formatError(err) });
  }
});

app.post('/api/presets/review-off', async (req, res) => {
  try {
    const { flavor, platform } = req.body ?? {};
    const keys = resolveKeys('storeReview', flavor, platform);
    const payload = buildReviewOffPreset();
    const etag = await publishToKeys(keys, payload);
    res.json({ ok: true, keys, payload, etag, message: `Review OFF — ${keys.length} key(s)` });
  } catch (err) {
    res.status(400).json({ ok: false, error: formatError(err) });
  }
});

app.post('/api/presets/update-on', async (req, res) => {
  try {
    const { flavor, platform, version, forceUpdate } = req.body ?? {};
    const keys = resolveKeys('storeUpdater', flavor, platform);
    const payload = buildUpdateOnPreset(version, forceUpdate);
    const etag = await publishToKeys(keys, payload);
    res.json({ ok: true, keys, payload, etag, message: `Update ON — ${keys.length} key(s)` });
  } catch (err) {
    res.status(400).json({ ok: false, error: formatError(err) });
  }
});

app.post('/api/presets/update-off', async (req, res) => {
  try {
    const { flavor, platform } = req.body ?? {};
    const keys = resolveKeys('storeUpdater', flavor, platform);
    const payload = buildUpdateOffPreset();
    const etag = await publishToKeys(keys, payload);
    res.json({ ok: true, keys, payload, etag, message: `Update OFF — ${keys.length} key(s)` });
  } catch (err) {
    res.status(400).json({ ok: false, error: formatError(err) });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

const url = `http://127.0.0.1:${port}`;

const server = app.listen(port, '127.0.0.1', () => {
  console.log(`RC Admin — project: ${projectId}`);
  console.log(`Running at ${url}`);
  openBrowser(url);
});

server.on('error', (err) => {
  if (/** @type {NodeJS.ErrnoException} */ (err).code === 'EADDRINUSE') {
    console.log(`Port ${port} already in use — RC Admin is likely already running.`);
    console.log(`Opening ${url} …`);
    openBrowser(url);
    process.exit(0);
    return;
  }
  console.error(err);
  process.exit(1);
});

/**
 * @param {string} target
 */
function openBrowser(target) {
  const cmd =
    process.platform === 'darwin'
      ? `open "${target}"`
      : process.platform === 'win32'
        ? `start "" "${target}"`
        : `xdg-open "${target}"`;
  exec(cmd, (openErr) => {
    if (openErr) {
      console.log(`Could not open browser automatically — visit ${target}`);
    }
  });
}

/**
 * @param {unknown} err
 * @returns {string}
 */
function formatError(err) {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}
