import { create } from 'zustand';
import { supabase } from './supabase';

interface AppState {
  userName: string;
  walletBalance: number;
  karmaPoints: number;
  carbonSavedGrams: number;
  addMoney: (amount: number) => Promise<void>;
  addKarma: (points: number) => Promise<void>;
  fetchUserData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  userName: "Guest",
  walletBalance: 0,
  karmaPoints: 0,
  carbonSavedGrams: 0,
  
  // 1. DYNAMIC CLOUD SYNC: Wallet Balance
  addMoney: async (amount: number) => {
    // Optimistic UI update for instant feedback
    set((state) => ({ walletBalance: state.walletBalance + amount }));
    
    // Background sync to PostgreSQL
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const newBalance = get().walletBalance;
      await supabase.from('commuter_profiles').update({ wallet_balance: newBalance }).eq('id', user.id);
    }
  },

  // 2. DYNAMIC CLOUD SYNC: Karma Engine
  addKarma: async (points: number) => {
    set((state) => ({ karmaPoints: state.karmaPoints + points }));
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const newKarma = get().karmaPoints;
      await supabase.from('commuter_profiles').update({ karma_points: newKarma }).eq('id', user.id);
    }
  },

  // 3. MASTER FETCH: Pulls live data on app load
  fetchUserData: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('commuter_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        // Load existing cloud profile
        set({
          userName: data.full_name || user.email?.split('@')[0] || "Commuter",
          walletBalance: Number(data.wallet_balance) || 0,
          karmaPoints: data.karma_points || 0,
          carbonSavedGrams: data.carbon_saved_grams || 0,
        });
      } else if (error && error.code === 'PGRST116') {
        // Profile doesn't exist yet, automatically create it in the database
        const newProfile = {
          id: user.id,
          full_name: user.email?.split('@')[0] || "Ajay M.", 
          wallet_balance: 0,
          karma_points: 0,
          carbon_saved_grams: 0,
        };
        await supabase.from('commuter_profiles').insert(newProfile);
        
        set({
          userName: newProfile.full_name,
          walletBalance: 0,
          karmaPoints: 0,
          carbonSavedGrams: 0,
        });
      }
    } else {
      // Guest state (not logged in)
      set({ userName: "Guest", walletBalance: 0, karmaPoints: 0, carbonSavedGrams: 0 });
    }
  }
}));