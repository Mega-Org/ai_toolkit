import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { OAuth2Client } from 'google-auth-library';
import admin from 'firebase-admin';

/** Public OAuth client used by Firebase CLI (firebase-tools/lib/api.js). */
const FIREBASE_CLI_CLIENT_ID =
  '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const FIREBASE_CLI_CLIENT_SECRET = 'j9iVZfS8kkCEFUPaAeJV0sAi';

function readFirebaseCliRefreshToken() {
  const configPath = join(homedir(), '.config/configstore/firebase-tools.json');
  if (!existsSync(configPath)) {
    return null;
  }
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    return config.tokens?.refresh_token ?? null;
  } catch {
    return null;
  }
}

function credentialFromFirebaseCli(refreshToken) {
  const oauth2Client = new OAuth2Client(
    FIREBASE_CLI_CLIENT_ID,
    FIREBASE_CLI_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return {
    getAccessToken: async () => {
      const response = await oauth2Client.getAccessToken();
      const accessToken = response.token;
      if (!accessToken) {
        throw new Error('Firebase CLI token refresh failed — run: firebase login');
      }
      return { access_token: accessToken, expires_in: 3600 };
    },
  };
}

/**
 * Resolve credentials: service account file (preferred) or Firebase CLI login.
 * @param {string | undefined} credentialsPath
 * @returns {{ credential: admin.credential.Credential, source: string }}
 */
export function resolveCredentials(credentialsPath) {
  if (credentialsPath) {
    const abs = resolve(credentialsPath);
    if (existsSync(abs)) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = abs;
      return {
        credential: admin.credential.applicationDefault(),
        source: `service account (${abs})`,
      };
    }
  }

  const refreshToken = readFirebaseCliRefreshToken();
  if (refreshToken) {
    return {
      credential: credentialFromFirebaseCli(refreshToken),
      source: 'Firebase CLI login (~/.config/configstore/firebase-tools.json)',
    };
  }

  throw new Error(
    'No credentials found. Either set GOOGLE_APPLICATION_CREDENTIALS in .env to a service account JSON file, or run: firebase login',
  );
}
