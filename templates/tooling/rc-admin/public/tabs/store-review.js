export const REVIEW_FIELDS = {
  isEnabled: 'review-is-enabled',
  version: 'review-version',
};

export const REVIEW_ACTIONS = {
  load: 'review-load',
  push: 'review-push',
  on: 'review-on',
  off: 'review-off',
};

/**
 * @param {Record<string, unknown>} payload
 */
export function applyReviewPayloadToForm(payload) {
  const enabledEl = document.getElementById(REVIEW_FIELDS.isEnabled);
  const versionEl = document.getElementById(REVIEW_FIELDS.version);
  if (enabledEl instanceof HTMLInputElement) {
    enabledEl.checked = Boolean(payload.is_enabled);
  }
  if (versionEl instanceof HTMLInputElement) {
    versionEl.value = String(payload.review_version ?? '0.0.0');
  }
}

/**
 * @returns {{ is_enabled: boolean, review_version: string }}
 */
export function readReviewPayloadFromForm() {
  const enabledEl = document.getElementById(REVIEW_FIELDS.isEnabled);
  const versionEl = document.getElementById(REVIEW_FIELDS.version);
  return {
    is_enabled: enabledEl instanceof HTMLInputElement ? enabledEl.checked : false,
    review_version:
      versionEl instanceof HTMLInputElement
        ? versionEl.value.trim() || '0.0.0'
        : '0.0.0',
  };
}
