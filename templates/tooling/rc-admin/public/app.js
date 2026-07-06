import {
  api,
  applyFirebaseBadge,
  getSelectors,
  getSwitch,
  keysFirebaseState,
  pickFirstConfig,
  resolveKeysPreview,
  setAppVersion,
  setButtonsBusy,
  setLoaderMessage,
  setPageState,
  setStatus,
  setSwitch,
  updatePresetExamples,
  updatePublishPreview,
} from './shared.js';
import { initStoreUpdaterTab } from './tabs/store-updater.js';
import { validateReviewVersion } from './version-validate.js';

/** @type {'storeReview' | 'storeUpdater'} */
let activeTab = 'storeReview';

/** @type {Record<string, unknown | null>} */
let cachedConfig = {};

function releaseBusy() {
  setButtonsBusy(false);
  validateReviewVersionField();
}

/**
 * @param {'storeReview' | 'storeUpdater'} tab
 */
function switchTab(tab) {
  activeTab = tab;
  document.querySelectorAll('.tab').forEach((el) => {
    const isActive = el.dataset.tab === tab;
    el.classList.toggle('active', isActive);
    el.setAttribute('aria-selected', String(isActive));
  });
  document.querySelectorAll('.tab-panel').forEach((el) => {
    const isActive = el.id === `panel-${tab}`;
    el.classList.toggle('active', isActive);
    el.hidden = !isActive;
  });
  refreshPreview();
  updatePresetExamples(tab);
}

function readReviewPayload() {
  const versionEl = document.getElementById('review-version');
  const raw =
    versionEl instanceof HTMLInputElement
      ? versionEl.value.trim() || '0.0.0'
      : '0.0.0';
  const validated = validateReviewVersion(raw);
  return {
    is_enabled: getSwitch('review-is-enabled'),
    review_version: validated.valid ? validated.value : raw,
  };
}

/**
 * @returns {boolean}
 */
function validateReviewVersionField() {
  const versionEl = document.getElementById('review-version');
  const errorEl = document.getElementById('review-version-error');
  const pushBtn = document.getElementById('review-push');
  const raw = versionEl instanceof HTMLInputElement ? versionEl.value : '';
  const result = validateReviewVersion(raw);

  if (versionEl instanceof HTMLInputElement) {
    versionEl.classList.toggle('input--invalid', !result.valid);
    versionEl.classList.toggle('input--valid', result.valid);
    versionEl.setAttribute('aria-invalid', String(!result.valid));
  }

  if (errorEl) {
    if (result.valid) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    } else {
      errorEl.hidden = false;
      errorEl.textContent = result.error;
    }
  }

  if (pushBtn instanceof HTMLButtonElement) {
    pushBtn.disabled = !result.valid;
    pushBtn.title = result.valid ? '' : result.error;
  }

  return result.valid;
}

function readUpdatePayload() {
  const versionEl = document.getElementById('update-min-version');
  return {
    is_enabled: getSwitch('update-is-enabled'),
    min_version:
      versionEl instanceof HTMLInputElement
        ? versionEl.value.trim() || '0.0.0'
        : '0.0.0',
    force_update: getSwitch('update-force'),
  };
}

function getActivePayload() {
  return activeTab === 'storeReview' ? readReviewPayload() : readUpdatePayload();
}

function refreshPreview() {
  const { flavor, platform } = getSelectors();
  const keys = resolveKeysPreview(activeTab, flavor, platform);
  const payload = getActivePayload();
  updatePublishPreview(activeTab, keys, payload, cachedConfig);

  const badgeId =
    activeTab === 'storeReview' ? 'review-firebase-badge' : 'update-firebase-badge';
  applyFirebaseBadge(
    document.getElementById(badgeId),
    keysFirebaseState(cachedConfig, keys),
  );
}

async function loadMeta() {
  setLoaderMessage('Loading project metadata…');
  const meta = await api('/api/meta');
  const projectEl = document.getElementById('project-id');
  const versionEl = document.getElementById('app-version');
  if (projectEl) projectEl.textContent = `Project · ${meta.projectId}`;
  if (versionEl) versionEl.textContent = meta.appVersion;
  setAppVersion(meta.appVersion);
  configureFlavorSelector(meta.flavors ?? []);
  updatePresetExamples('storeReview');
  updatePresetExamples('storeUpdater');
  return meta;
}

/**
 * @param {string[]} flavors
 */
function configureFlavorSelector(flavors) {
  const group = document.getElementById('flavor-selector-group');
  const pillGroup = document.getElementById('flavor-pill-group');
  if (!group || !pillGroup || flavors.length === 0) return;

  if (flavors.length === 1) {
    group.hidden = true;
    pillGroup.innerHTML = '';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'flavor';
    input.value = flavors[0];
    input.checked = true;
    input.hidden = true;
    pillGroup.appendChild(input);
    return;
  }

  group.hidden = false;
  pillGroup.innerHTML = '';
  flavors.forEach((flavor, index) => {
    const label = document.createElement('label');
    label.className = 'pill-option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'flavor';
    input.value = flavor;
    if (index === 0) input.checked = true;
    const span = document.createElement('span');
    span.textContent = flavor.charAt(0).toUpperCase() + flavor.slice(1);
    label.append(input, span);
    pillGroup.appendChild(label);
  });

  pillGroup.querySelectorAll('input[name="flavor"]').forEach((el) => {
    el.addEventListener('change', () => {
      onSelectorsChanged();
    });
  });
}

async function refreshConfig() {
  setLoaderMessage('Fetching Remote Config values…');
  const data = await api('/api/config');
  cachedConfig = data.config ?? {};

  if (data.needsGroupMigration) {
    setStatus('loading', 'Organizing keys into Console groups…');
    await api('/api/sync-groups');
    const refreshed = await api('/api/config');
    cachedConfig = refreshed.config ?? {};
  }

  return cachedConfig;
}

function applyReviewToForm(value) {
  const versionEl = document.getElementById('review-version');
  if (value && typeof value === 'object') {
    const obj = /** @type {Record<string, unknown>} */ (value);
    setSwitch('review-is-enabled', Boolean(obj.is_enabled));
    if (versionEl instanceof HTMLInputElement) {
      versionEl.value = String(obj.review_version ?? '0.0.0');
    }
  } else {
    setSwitch('review-is-enabled', false);
    if (versionEl instanceof HTMLInputElement) {
      versionEl.value = '0.0.0';
    }
  }
}

function applyUpdateToForm(value) {
  const versionEl = document.getElementById('update-min-version');
  if (value && typeof value === 'object') {
    const obj = /** @type {Record<string, unknown>} */ (value);
    setSwitch('update-is-enabled', Boolean(obj.is_enabled));
    if (versionEl instanceof HTMLInputElement) {
      versionEl.value = String(obj.min_version ?? '0.0.0');
    }
    setSwitch('update-force', Boolean(obj.force_update));
  } else {
    setSwitch('update-is-enabled', false);
    if (versionEl instanceof HTMLInputElement) {
      versionEl.value = '0.0.0';
    }
    setSwitch('update-force', false);
  }
}

async function loadReviewForm() {
  const { flavor, platform } = getSelectors();
  const keys = resolveKeysPreview('storeReview', flavor, platform);
  applyReviewToForm(pickFirstConfig(cachedConfig, keys));
  refreshPreview();
  validateReviewVersionField();
}

async function loadUpdaterForm() {
  const { flavor, platform } = getSelectors();
  const keys = resolveKeysPreview('storeUpdater', flavor, platform);
  applyUpdateToForm(pickFirstConfig(cachedConfig, keys));
  refreshPreview();
}

async function loadActiveTab(silent = false) {
  try {
    setButtonsBusy(true);
    if (!silent) setStatus('loading', 'Reloading from Firebase…');
    await refreshConfig();
    if (activeTab === 'storeReview') {
      await loadReviewForm();
    } else {
      await loadUpdaterForm();
    }
    if (!silent) setStatus('ok', 'Loaded from Firebase');
  } catch (err) {
    setStatus('error', err instanceof Error ? err.message : String(err));
  } finally {
    releaseBusy();
  }
}

async function onSelectorsChanged() {
  await loadActiveTab(true);
}

async function pushReview() {
  if (!validateReviewVersionField()) {
    setStatus('error', 'Fix review_version before pushing');
    return;
  }
  const { flavor, platform } = getSelectors();
  try {
    setButtonsBusy(true);
    setStatus('loading', 'Publishing to Firebase…');
    const result = await api('/api/push', {
      feature: 'storeReview',
      flavor,
      platform,
      payload: readReviewPayload(),
    });
    setStatus('ok', result.message ?? 'Published');
    await refreshConfig();
    await loadReviewForm();
  } catch (err) {
    setStatus('error', err instanceof Error ? err.message : String(err));
  } finally {
    releaseBusy();
  }
}

async function presetReview(path) {
  const { flavor, platform } = getSelectors();
  try {
    setButtonsBusy(true);
    setStatus('loading', 'Applying preset…');
    const result = await api(path, { flavor, platform });
    if (result.payload) {
      applyReviewToForm(result.payload);
      refreshPreview();
    }
    setStatus('ok', result.message ?? 'Preset applied');
    await refreshConfig();
    await loadReviewForm();
  } catch (err) {
    setStatus('error', err instanceof Error ? err.message : String(err));
  } finally {
    releaseBusy();
  }
}

function bindFormPreviewListeners() {
  const reviewFields = ['review-is-enabled', 'review-version'];
  const updateFields = ['update-is-enabled', 'update-min-version', 'update-force'];

  document.getElementById('review-version')?.addEventListener('input', () => {
    validateReviewVersionField();
    refreshPreview();
  });
  document.getElementById('review-version')?.addEventListener('blur', () => {
    validateReviewVersionField();
  });

  for (const id of ['review-is-enabled', ...updateFields]) {
    const el = document.getElementById(id);
    el?.addEventListener('input', () => refreshPreview());
    el?.addEventListener('change', () => refreshPreview());
  }
}

function bindReviewTab() {
  document.getElementById('review-load')?.addEventListener('click', () => {
    loadActiveTab();
  });
  document.getElementById('review-push')?.addEventListener('click', () => {
    pushReview();
  });
  document.getElementById('review-on')?.addEventListener('click', () => {
    presetReview('/api/presets/review-on');
  });
  document.getElementById('review-off')?.addEventListener('click', () => {
    presetReview('/api/presets/review-off');
  });
}

async function init() {
  setPageState('loading');

  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = /** @type {'storeReview' | 'storeUpdater'} */ (btn.dataset.tab);
      if (tab) {
        switchTab(tab);
        loadActiveTab(true);
      }
    });
  });

  document.querySelectorAll('input[name="flavor"], input[name="platform"]').forEach((el) => {
    el.addEventListener('change', () => {
      onSelectorsChanged();
    });
  });

  bindFormPreviewListeners();
  bindReviewTab();

  initStoreUpdaterTab({
    getSelectors,
    readUpdatePayload,
    applyUpdateToForm,
    loadUpdaterForm,
    refreshConfig,
    refreshPreview,
    setButtonsBusy,
    setStatus,
    api,
  });

  try {
    await loadMeta();
    await refreshConfig();
    await loadReviewForm();
    setPageState('ready');
    setStatus('idle', 'Ready — values loaded from Firebase');
    validateReviewVersionField();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    setPageState('error', message);
  }
}

init();
