function ObservableState(target = this) {
  let listeners = [];
  const runListeners = () => listeners.forEach(l => l())

  target.subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    }
  }

  return new Proxy(target, {
    deleteProperty(target, prop) {
      const result = Reflect.deleteProperty(target, prop);
      runListeners();
      return result;
    },

    set(target, prop, value) {
      const result = Reflect.set(target, prop, value);
      runListeners();
      return result;
    }
  });
}

module.exports = ObservableState;
