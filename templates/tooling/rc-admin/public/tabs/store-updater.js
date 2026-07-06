/**
 * @param {{
 *   getSelectors: () => { flavor: string, platform: string },
 *   readUpdatePayload: () => Record<string, unknown>,
 *   applyUpdateToForm: (value: unknown) => void,
 *   loadUpdaterForm: () => Promise<void>,
 *   refreshConfig: () => Promise<Record<string, unknown | null>>,
 *   refreshPreview: () => void,
 *   setButtonsBusy: (busy: boolean) => void,
 *   setStatus: (kind: string, message: string) => void,
 *   api: (path: string, body?: Record<string, unknown>) => Promise<Record<string, unknown>>,
 * }} deps
 */
export function initStoreUpdaterTab(deps) {
  const {
    getSelectors,
    readUpdatePayload,
    applyUpdateToForm,
    loadUpdaterForm,
    refreshConfig,
    refreshPreview,
    setButtonsBusy,
    setStatus,
    api,
  } = deps;

  async function loadFromFirebase() {
    try {
      setButtonsBusy(true);
      setStatus('loading', 'Reloading from Firebase…');
      await refreshConfig();
      await loadUpdaterForm();
      setStatus('ok', 'Loaded from Firebase');
    } catch (err) {
      setStatus('error', err instanceof Error ? err.message : String(err));
    } finally {
      setButtonsBusy(false);
    }
  }

  async function pushUpdate() {
    const { flavor, platform } = getSelectors();
    try {
      setButtonsBusy(true);
      setStatus('loading', 'Publishing to Firebase…');
      const result = await api('/api/push', {
        feature: 'storeUpdater',
        flavor,
        platform,
        payload: readUpdatePayload(),
      });
      setStatus('ok', String(result.message ?? 'Published'));
      await refreshConfig();
      await loadUpdaterForm();
    } catch (err) {
      setStatus('error', err instanceof Error ? err.message : String(err));
    } finally {
      setButtonsBusy(false);
    }
  }

  async function presetUpdate(path) {
    const { flavor, platform } = getSelectors();
    const payload = readUpdatePayload();
    try {
      setButtonsBusy(true);
      setStatus('loading', 'Applying preset…');
      const result = await api(path, {
        flavor,
        platform,
        forceUpdate: payload.force_update,
      });
      if (result.payload) {
        applyUpdateToForm(result.payload);
        refreshPreview();
      }
      setStatus('ok', String(result.message ?? 'Preset applied'));
      await refreshConfig();
      await loadUpdaterForm();
    } catch (err) {
      setStatus('error', err instanceof Error ? err.message : String(err));
    } finally {
      setButtonsBusy(false);
    }
  }

  document.getElementById('update-load')?.addEventListener('click', () => {
    loadFromFirebase();
  });
  document.getElementById('update-push')?.addEventListener('click', () => {
    pushUpdate();
  });
  document.getElementById('update-on')?.addEventListener('click', () => {
    presetUpdate('/api/presets/update-on');
  });
  document.getElementById('update-off')?.addEventListener('click', () => {
    presetUpdate('/api/presets/update-off');
  });
}
