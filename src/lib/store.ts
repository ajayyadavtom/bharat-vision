import { create } from 'zustand';

// STRICT ALIAS PATH: Connects directly to your existing src/lib/supabase.ts
import { supabase } from '@/lib/supabase';

interface AppState {
  userName: string;
  walletBalance: number;
  karmaPoints: number;
  carbonSavedGrams: number;
  isInitialized: boolean; // <-- NEW: Tracks if Supabase data has loaded
  addMoney: (amount: number) => Promise<void>;
  addKarma: (points: number) => Promise<void>;
  fetchUserData: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  userName: "Guest",
  walletBalance: 0,
  karmaPoints: 0,
  carbonSavedGrams: 0,
  isInitialized: false, // <-- Starts false to prevent flashing "0"
  
  // 1. SYNCED WALLET: Updates local state and instantly pushes to Supabase PostgreSQL
  addMoney: async (amount: number) => {
    set((state) => ({ walletBalance: state.walletBalance + amount }));
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const newBalance = get().walletBalance;
      await supabase
        .from('commuter_profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', user.id);
    }
  },

  // 2. SYNCED KARMA: Updates local state and persists points to cloud profile
  addKarma: async (points: number) => {
    set((state) => ({ karmaPoints: state.karmaPoints + points }));
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const newKarma = get().karmaPoints;
      await supabase
        .from('commuter_profiles')
        .update({ karma_points: newKarma })
        .eq('id', user.id);
    }
  },

  // 3. MASTER CLOUD FETCHER: Pulls real user data on session load or auto-creates profile
  fetchUserData: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('commuter_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          set({
            userName: data.full_name || user.email?.split('@')[0] || "Commuter",
            walletBalance: Number(data.wallet_balance) || 0,
            karmaPoints: data.karma_points || 0,
            carbonSavedGrams: data.carbon_saved_grams || 0,
          });
        } else if (error && error.code === 'PGRST116') {
          // Profile row doesn't exist yet for this auth user, create it automatically
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
        set({ userName: "Guest", walletBalance: 0, karmaPoints: 0, carbonSavedGrams: 0 });
      }
    } catch (error) {
      console.error("Supabase Fetch Error:", error);
    } finally {
      // <-- NEW: Once everything is done (success or fail), mark as initialized
      set({ isInitialized: true }); 
    }
  }
}));