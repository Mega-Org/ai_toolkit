import { readPubspecVersion } from './pubspec-version.js';
import { assertReviewVersion } from './version-validate.js';

/**
 * @typedef {{ is_enabled: boolean, review_version: string }} ReviewPayload
 * @typedef {{ is_enabled: boolean, min_version: string, force_update: boolean }} UpdatePayload
 */

/**
 * @param {unknown} payload
 * @returns {ReviewPayload}
 */
export function validateReviewPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Review payload must be an object');
  }
  const { is_enabled, review_version } = /** @type {Record<string, unknown>} */ (
    payload
  );
  if (typeof is_enabled !== 'boolean') {
    throw new Error('is_enabled must be a boolean');
  }
  if (typeof review_version !== 'string' || !review_version.trim()) {
    throw new Error('review_version must be a non-empty string');
  }
  const normalized = assertReviewVersion(review_version);
  return { is_enabled, review_version: normalized };
}

/**
 * @param {unknown} payload
 * @returns {UpdatePayload}
 */
export function validateUpdatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Update payload must be an object');
  }
  const { is_enabled, min_version, force_update } =
    /** @type {Record<string, unknown>} */ (payload);
  if (typeof is_enabled !== 'boolean') {
    throw new Error('is_enabled must be a boolean');
  }
  if (typeof min_version !== 'string' || !min_version.trim()) {
    throw new Error('min_version must be a non-empty string');
  }
  if (typeof force_update !== 'boolean') {
    throw new Error('force_update must be a boolean');
  }
  return {
    is_enabled,
    min_version: min_version.trim(),
    force_update,
  };
}

/**
 * @param {string} [version]
 * @returns {ReviewPayload}
 */
export function buildReviewOnPreset(version) {
  return {
    is_enabled: true,
    review_version: version ?? readPubspecVersion(),
  };
}

/** @returns {ReviewPayload} */
export function buildReviewOffPreset() {
  return {
    is_enabled: false,
    review_version: '0.0.0',
  };
}

/**
 * @param {string} [version]
 * @param {boolean} [forceUpdate]
 * @returns {UpdatePayload}
 */
export function buildUpdateOnPreset(version, forceUpdate = false) {
  return {
    is_enabled: true,
    min_version: version ?? readPubspecVersion(),
    force_update: forceUpdate ?? false,
  };
}

/** @returns {UpdatePayload} */
export function buildUpdateOffPreset() {
  return {
    is_enabled: false,
    min_version: '0.0.0',
    force_update: false,
  };
}
