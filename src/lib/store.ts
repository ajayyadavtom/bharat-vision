import { create } from 'zustand';
import { supabase } from './supabase';

interface AppState {
  userName: string;
  walletBalance: number;
  carbonSavedGrams: number;
  karmaPoints: number; // NEW: Global Karma State
  fetchUserData: () => Promise<void>;
  addMoney: (amount: number) => Promise<void>;
  addKarma: (points: number) => Promise<void>; // NEW: Cloud Sync Function
}

export const useAppStore = create<AppState>((set, get) => ({
  userName: "Syncing...",
  walletBalance: 0,
  carbonSavedGrams: 0,
  karmaPoints: 150, // Default starting points

  fetchUserData: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', 'USER_001')
      .single();

    if (data && !error) {
      set({
        userName: data.name,
        walletBalance: data.wallet_balance,
        carbonSavedGrams: data.carbon_saved,
        karmaPoints: data.karma_points || 150 // Pulls real points from cloud
      });
    }
  },

  addMoney: async (amount: number) => {
    const newBalance = get().walletBalance + amount;
    set({ walletBalance: newBalance });
    await supabase.from('users').update({ wallet_balance: newBalance }).eq('id', 'USER_001');
  },

  // NEW: Instantly updates UI and silently syncs to the Supabase Cloud
  addKarma: async (points: number) => {
    const newKarma = get().karmaPoints + points;
    set({ karmaPoints: newKarma });
    
    // In a real production setup, this updates the 'karma_points' column in Supabase
    await supabase.from('users').update({ karma_points: newKarma }).eq('id', 'USER_001');
  }
}));