/** @typedef {'storeReview' | 'storeUpdater'} Feature */
/** @typedef {string} Flavor */
/** @typedef {'android' | 'ios' | 'both'} Platform */

/** Keep in sync with rc-keys.js KEY_MAP */
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

/** @type {string} */
let appVersion = '0.0.0';

/**
 * @param {string} version
 */
export function setAppVersion(version) {
  appVersion = version;
}

export function getAppVersion() {
  return appVersion;
}

/**
 * @param {Feature} feature
 * @param {Flavor} flavor
 * @param {Platform} platform
 * @returns {string[]}
 */
export function resolveKeysPreview(feature, flavor, platform) {
  const byFlavor = KEY_MAP[feature][flavor];
  if (platform === 'both') {
    return [byFlavor.android, byFlavor.ios];
  }
  return [byFlavor[platform]];
}

/**
 * @param {string} path
 * @param {Record<string, unknown>} [body]
 */
export async function api(path, body) {
  const options = {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const res = await fetch(path, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? `Request failed (${res.status})`);
  }
  return data;
}

/**
 * @param {'idle' | 'loading' | 'ok' | 'error'} kind
 * @param {string} message
 */
export function setStatus(kind, message) {
  const el = document.getElementById('status-message');
  if (!el) return;
  el.textContent = message;
  el.className =
    kind === 'loading'
      ? 'status-loading'
      : kind === 'ok'
        ? 'status-ok'
        : kind === 'error'
          ? 'status-error'
          : 'status-idle';
}

/**
 * @param {string} message
 */
export function setLoaderMessage(message) {
  const el = document.getElementById('loader-message');
  if (el) el.textContent = message;
}

/**
 * @param {'loading' | 'ready' | 'error'} state
 * @param {string} [errorMessage]
 */
export function setPageState(state, errorMessage) {
  const loader = document.getElementById('page-loader');
  const content = document.getElementById('page-content');
  if (state === 'loading') {
    loader?.removeAttribute('hidden');
    if (content) content.hidden = true;
    return;
  }
  if (loader) loader.hidden = true;
  if (content) content.hidden = false;
  if (state === 'error' && errorMessage) {
    setStatus('error', errorMessage);
  }
}

/**
 * @returns {{ flavor: Flavor, platform: Platform }}
 */
export function getSelectors() {
  const flavor = /** @type {Flavor} */ (
    document.querySelector('input[name="flavor"]:checked')?.value ?? 'user'
  );
  const platform = /** @type {Platform} */ (
    document.querySelector('input[name="platform"]:checked')?.value ?? 'android'
  );
  return { flavor, platform };
}

/**
 * @param {Record<string, unknown | null>} config
 * @param {string[]} keys
 * @returns {unknown | null}
 */
export function pickFirstConfig(config, keys) {
  for (const key of keys) {
    const value = config[key];
    if (value != null && typeof value === 'object' && !('_parseError' in value)) {
      return value;
    }
  }
  return null;
}

/**
 * @param {Record<string, unknown | null>} config
 * @param {string[]} keys
 * @returns {'unset' | 'set' | 'mixed'}
 */
export function keysFirebaseState(config, keys) {
  let setCount = 0;
  for (const key of keys) {
    const value = config[key];
    if (value != null && typeof value === 'object' && !('_parseError' in value)) {
      setCount++;
    }
  }
  if (setCount === 0) return 'unset';
  if (setCount === keys.length) return 'set';
  return 'mixed';
}

/**
 * @param {HTMLElement | null} el
 * @param {'unset' | 'set' | 'mixed'} state
 */
export function applyFirebaseBadge(el, state) {
  if (!el) return;
  const labels = {
    unset: 'Not set in Firebase',
    set: 'Configured in Firebase',
    mixed: 'Partially configured',
  };
  el.textContent = labels[state];
  el.className = `badge badge--${state}`;
}

/**
 * @param {string} id
 * @param {boolean} checked
 */
export function setSwitch(id, checked) {
  const el = document.getElementById(id);
  if (el instanceof HTMLInputElement) {
    el.checked = checked;
  }
}

/**
 * @param {string} id
 * @returns {boolean}
 */
export function getSwitch(id) {
  const el = document.getElementById(id);
  return el instanceof HTMLInputElement ? el.checked : false;
}

/**
 * @param {Record<string, unknown>} payload
 */
export function formatJson(payload) {
  return JSON.stringify(payload, null, 2);
}

/**
 * @param {Feature} feature
 * @param {string[]} keys
 * @param {Record<string, unknown>} payload
 * @param {Record<string, unknown | null>} config
 */
export function updatePublishPreview(feature, keys, payload, config) {
  const keysEl = document.getElementById('preview-keys');
  const jsonEl = document.getElementById('preview-json');
  const currentEl = document.getElementById('preview-current');

  if (keysEl) {
    keysEl.innerHTML = '';
    for (const key of keys) {
      const li = document.createElement('li');
      const value = config[key];
      const isSet =
        value != null && typeof value === 'object' && !('_parseError' in value);
      li.textContent = key;
      li.className = isSet ? 'key--set' : 'key--unset';
      keysEl.appendChild(li);
    }
  }

  if (jsonEl) {
    jsonEl.textContent = formatJson(payload);
  }

  if (currentEl) {
    const currentValues = keys.map((key) => {
      const value = config[key];
      return { key, value: value ?? null };
    });
    const allNull = currentValues.every((item) => item.value == null);
    if (allNull) {
      currentEl.textContent = 'No values yet — keys are not set in Firebase.';
    } else if (keys.length === 1) {
      currentEl.textContent = formatJson(
        /** @type {Record<string, unknown>} */ (currentValues[0].value ?? {}),
      );
    } else {
      currentEl.textContent = formatJson(
        Object.fromEntries(currentValues.map((item) => [item.key, item.value])),
      );
    }
  }

  const rcPill = document.getElementById('rc-state-pill');
  if (rcPill) {
    const state = keysFirebaseState(config, keys);
    const labels = { unset: 'RC not set', set: 'RC configured', mixed: 'RC partial' };
    rcPill.innerHTML = labels[state];
  }
}

/**
 * @param {boolean} busy
 */
export function setButtonsBusy(busy) {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.disabled = busy;
  });
  document.querySelectorAll('.switch input').forEach((input) => {
    if (input instanceof HTMLInputElement) {
      input.disabled = busy;
    }
  });
  document.querySelectorAll('.field input[type="text"]').forEach((input) => {
    if (input instanceof HTMLInputElement) {
      input.disabled = busy;
    }
  });
}

/**
 * @param {Feature} feature
 * @param {Flavor} flavor
 * @param {Platform} platform
 */
export function updatePresetExamples(feature) {
  const version = appVersion;
  if (feature === 'storeReview') {
    const onEl = document.getElementById('review-on-example');
    if (onEl) {
      onEl.textContent = JSON.stringify({
        is_enabled: true,
        review_version: version,
      });
    }
  } else {
    const onEl = document.getElementById('update-on-example');
    if (onEl) {
      onEl.textContent = JSON.stringify({
        is_enabled: true,
        min_version: version,
        force_update: false,
      });
    }
  }
}
