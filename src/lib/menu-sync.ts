const MENU_SYNC_CHANNEL = "sub-on-cloud-menu-sync";
const MENU_SYNC_EVENT = "sub-on-cloud:menu-updated";
const MENU_SYNC_STORAGE_KEY = "sub-on-cloud-menu-updated-at";

export function notifyMenuUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  const timestamp = String(Date.now());
  window.dispatchEvent(new CustomEvent(MENU_SYNC_EVENT));
  window.localStorage.setItem(MENU_SYNC_STORAGE_KEY, timestamp);

  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(MENU_SYNC_CHANNEL);
    channel.postMessage({ type: "menu-updated", timestamp });
    channel.close();
  }
}

export function subscribeToMenuUpdates(onUpdate: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleCustomEvent = () => onUpdate();
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === MENU_SYNC_STORAGE_KEY) {
      onUpdate();
    }
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      onUpdate();
    }
  };

  window.addEventListener(MENU_SYNC_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);
  document.addEventListener("visibilitychange", handleVisibilityChange);

  let channel: BroadcastChannel | null = null;

  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel(MENU_SYNC_CHANNEL);
    channel.addEventListener("message", onUpdate);
  }

  return () => {
    window.removeEventListener(MENU_SYNC_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    channel?.close();
  };
}
