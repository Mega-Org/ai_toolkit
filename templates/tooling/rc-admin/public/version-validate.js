/**
 * Browser copy — keep in sync with tool/firebase/rc-admin/version-validate.js
 */

const REVIEW_VERSION_RE = /^\d+\.\d+\.\d+$/;

/**
 * @param {unknown} version
 * @returns {{ valid: true, value: string } | { valid: false, error: string }}
 */
export function validateReviewVersion(version) {
  const trimmed = typeof version === 'string' ? version.trim() : '';

  if (!trimmed) {
    return { valid: false, error: 'Version is required (e.g. 1.0.0)' };
  }
  if (trimmed.includes('+')) {
    return {
      valid: false,
      error: 'Build number not allowed — use the version name only (1.0.0, not 1.0.0+42)',
    };
  }
  if (/^v/i.test(trimmed)) {
    return { valid: false, error: 'Do not prefix with "v" — use 1.0.0' };
  }
  if (!REVIEW_VERSION_RE.test(trimmed)) {
    return {
      valid: false,
      error: 'Must be major.minor.patch with numbers only (e.g. 1.0.0, 1.2.3)',
    };
  }

  return { valid: true, value: trimmed };
}
