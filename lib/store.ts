// A zero-dependency global store for the Wallet Balance.
// This guarantees Next.js will never throw a module error here.

export function useAppStore() {
  return {
    // Setting your default digital wallet balance to ₹250
    walletBalance: 250.00
  };
}