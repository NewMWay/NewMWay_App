

let selectedAddressId: string | null = null;
let listeners: Set<(id: string | null) => void> = new Set();

export const setSelectedAddressForCheckout = (id: string | null) => {
  selectedAddressId = id;
  listeners.forEach(listener => listener(id));
};

export const getSelectedAddressForCheckout = (): string | null => {
  return selectedAddressId;
};

export const clearSelectedAddressForCheckout = () => {
  selectedAddressId = null;
};

export const subscribeToAddressSelection = (listener: (id: string | null) => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
