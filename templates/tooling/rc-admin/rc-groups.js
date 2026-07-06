/**
 * Firebase Remote Config parameter groups (Console organization only).
 * Keys still resolve by flat name in Dart — groups do not affect runtime.
 *
 * Update key lists when {{RC_KEY_MAP}} changes — see rc-keys.js
 */

import { ALL_KEYS } from './rc-keys.js';

/** @type {Record<string, { description: string, keys: string[] }>} */
export const PARAMETER_GROUPS = {
  'Store Review': {
    description:
      'Hide or replace sensitive UI while a specific app version is under App Store / Play Store review.',
    keys: [
      'store_review_config_android',
      'store_review_config_ios',
    ],
  },
  'Store Updater': {
    description: 'Min-version and force-update config per platform (and flavor when multi_flavor).',
    keys: [
      'app_update_config_android',
      'app_update_config_ios',
    ],
  },
};

const MANAGED_KEYS = new Set(ALL_KEYS);

/** @type {Map<string, string>} */
const KEY_TO_GROUP = new Map();
for (const [groupName, { keys }] of Object.entries(PARAMETER_GROUPS)) {
  for (const key of keys) {
    KEY_TO_GROUP.set(key, groupName);
  }
}

/**
 * @param {string} key
 * @returns {string | undefined}
 */
export function getGroupForKey(key) {
  return KEY_TO_GROUP.get(key);
}

/**
 * @param {import('firebase-admin/remote-config').RemoteConfigTemplate} template
 * @param {string} key
 * @returns {import('firebase-admin/remote-config').RemoteConfigParameter | undefined}
 */
export function findParameter(template, key) {
  const top = template.parameters?.[key];
  if (top) return top;

  for (const group of Object.values(template.parameterGroups ?? {})) {
    const inGroup = group?.parameters?.[key];
    if (inGroup) return inGroup;
  }
  return undefined;
}

/**
 * @param {import('firebase-admin/remote-config').RemoteConfigTemplate} template
 * @returns {string[]}
 */
export function listTopLevelManagedKeys(template) {
  return ALL_KEYS.filter((key) => Boolean(template.parameters?.[key]));
}

/**
 * @param {import('firebase-admin/remote-config').RemoteConfigTemplate} template
 */
function ensureGroupShells(template) {
  if (!template.parameterGroups) {
    template.parameterGroups = {};
  }
  for (const [groupName, { description }] of Object.entries(PARAMETER_GROUPS)) {
    if (!template.parameterGroups[groupName]) {
      template.parameterGroups[groupName] = { description, parameters: {} };
    } else {
      template.parameterGroups[groupName].description = description;
      if (!template.parameterGroups[groupName].parameters) {
        template.parameterGroups[groupName].parameters = {};
      }
    }
  }
}

/**
 * @param {import('firebase-admin/remote-config').RemoteConfigTemplate} template
 * @returns {string[]}
 */
export function migrateManagedKeysIntoGroups(template) {
  ensureGroupShells(template);
  /** @type {string[]} */
  const migrated = [];

  for (const key of ALL_KEYS) {
    const topLevel = template.parameters?.[key];
    if (!topLevel) continue;

    const groupName = getGroupForKey(key);
    if (!groupName) continue;

    template.parameterGroups[groupName].parameters[key] = topLevel;
    delete template.parameters[key];
    migrated.push(key);
  }

  return migrated;
}

/**
 * @param {import('firebase-admin/remote-config').RemoteConfigTemplate} template
 * @param {string} key
 * @param {import('firebase-admin/remote-config').RemoteConfigParameter} definition
 */
export function setGroupedParameter(template, key, definition) {
  const groupName = getGroupForKey(key);
  if (!groupName) {
    throw new Error(`No parameter group for key: ${key}`);
  }

  ensureGroupShells(template);
  template.parameterGroups[groupName].parameters[key] = definition;
  if (template.parameters?.[key]) {
    delete template.parameters[key];
  }
}

/**
 * @param {import('firebase-admin/remote-config').RemoteConfigTemplate} template
 * @returns {boolean}
 */
export function needsGroupMigration(template) {
  return listTopLevelManagedKeys(template).length > 0;
}

/**
 * @param {import('firebase-admin/remote-config').RemoteConfigTemplate} template
 */
export function pruneManagedKeysFromForeignGroups(template) {
  for (const [groupName, group] of Object.entries(
    template.parameterGroups ?? {},
  )) {
    if (groupName in PARAMETER_GROUPS) continue;
    if (!group?.parameters) continue;
    for (const key of Object.keys(group.parameters)) {
      if (MANAGED_KEYS.has(key)) {
        delete group.parameters[key];
      }
    }
  }
}

/**
 * @param {import('firebase-admin/remote-config').RemoteConfigTemplate} template
 * @returns {string[]}
 */
export function syncParameterGroups(template) {
  pruneManagedKeysFromForeignGroups(template);
  return migrateManagedKeysIntoGroups(template);
}
