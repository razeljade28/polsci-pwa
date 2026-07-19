// Minimal observable state store for the app
export const State = (function () {
  const store = new Map();
  const subs = new Map();

  function get(key) {
    return store.get(key);
  }

  function set(key, value) {
    store.set(key, value);
    const list = subs.get(key) || [];
    list.forEach((fn) => {
      try {
        fn(value);
      } catch (e) {
        console.error("State subscriber error", e);
      }
    });
  }

  function subscribe(key, fn) {
    if (!subs.has(key)) subs.set(key, []);
    subs.get(key).push(fn);
    // return unsubscribe
    return () => {
      const arr = subs.get(key) || [];
      const idx = arr.indexOf(fn);
      if (idx !== -1) arr.splice(idx, 1);
    };
  }

  function clear() {
    store.clear();
    subs.clear();
  }

  return { get, set, subscribe, clear };
})();
