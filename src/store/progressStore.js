import { create } from 'zustand'

export const useProgressStore = create((set) => ({
  progress: [],       // progress[] rows from DB
  stats: null,        // teen_stats row
  badges: [],         // badge_id strings
  loading: false,
  setProgress: (progress) => set({ progress }),
  setStats: (stats) => set({ stats }),
  setBadges: (badges) => set({ badges }),
  setLoading: (loading) => set({ loading }),
  addProgress: (record) =>
    set((s) => ({
      progress: [
        ...s.progress.filter(
          (p) => !(p.module_id === record.module_id && p.day_number === record.day_number)
        ),
        record,
      ],
    })),
  addBadges: (newIds) =>
    set((s) => ({ badges: [...new Set([...s.badges, ...newIds])] })),
}))
