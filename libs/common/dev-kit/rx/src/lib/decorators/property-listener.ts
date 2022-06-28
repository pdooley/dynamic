export function PropertyListener(listenTo: string): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Object, propertyKey: string | symbol) => {
    const originalDescriptor = Object.getOwnPropertyDescriptor(target, listenTo);

    const storageKey = `__${listenTo}__`;
    Object.defineProperty(target, listenTo, {
      set(value) {
        this[storageKey] = value;

        if (originalDescriptor?.set) {
          originalDescriptor.set.call(this, value);
        }

        const listener = this[propertyKey];
        if (listener && 'next' in listener && typeof listener.next === 'function') {
          listener.next(value);
        } else if (typeof listener === 'function') {
          listener.call(this, value);
        }
      },
      get() {
        if (originalDescriptor?.get) {
          return originalDescriptor.get.call(this);
        } else return this[storageKey];
      },
    });
  };
}
