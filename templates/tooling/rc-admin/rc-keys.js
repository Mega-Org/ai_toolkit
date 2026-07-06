/**
 * Remote Config key resolver — keep in sync with:
 * - lib/src/_store_review/src/constants/constants.dart (or app path)
 * - lib/src/_store_updater/constants/constants.dart (or app path)
 *
 * Configure {{FLAVORS}} and {{RC_KEY_MAP}} after Phase 0 analysis.
 * See ai_docs/integrations/remote-config-store-ops.md
 */

export const FEATURES = ['storeReview', 'storeUpdater'];

/** single_app: ['app'] — multi_flavor: e.g. ['user', 'security'] */
export const FLAVORS = ['app'];

export const PLATFORMS = ['android', 'ios', 'both'];

/** @type {Record<string, Record<string, Record<string, string>>>} */
const KEY_MAP = {
  storeReview: {
    app: {
      android: 'store_review_config_android',
      ios: 'store_review_config_ios',
    },
  },
  storeUpdater: {
    app: {
      android: 'app_update_config_android',
      ios: 'app_update_config_ios',
    },
  },
};

/** All managed RC parameter names. */
export const ALL_KEYS = Object.values(KEY_MAP).flatMap((byFlavor) =>
  Object.values(byFlavor).flatMap((byPlatform) => Object.values(byPlatform)),
);

/**
 * @param {'storeReview' | 'storeUpdater'} feature
 * @param {string} flavor
 * @param {'android' | 'ios' | 'both'} platform
 * @returns {string[]}
 */
export function resolveKeys(feature, flavor, platform) {
  assertEnum(feature, FEATURES, 'feature');
  assertEnum(flavor, FLAVORS, 'flavor');
  assertEnum(platform, PLATFORMS, 'platform');

  const byFlavor = KEY_MAP[feature][flavor];
  if (!byFlavor) {
    throw new Error(`No KEY_MAP entry for feature=${feature} flavor=${flavor}`);
  }
  if (platform === 'both') {
    return [byFlavor.android, byFlavor.ios];
  }
  return [byFlavor[platform]];
}

/**
 * @param {string} value
 * @param {string[]} allowed
 * @param {string} label
 */
function assertEnum(value, allowed, label) {
  if (!allowed.includes(value)) {
    throw new Error(`Invalid ${label}: ${value}`);
  }
}
