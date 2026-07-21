import { defineStore } from 'pinia'
// useEventListener is auto-imported globally by @vueuse/nuxt.

type ThemeChoice = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'tablesnap-theme'

const NEXT: Record<ThemeChoice, ThemeChoice> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
}

const META: Record<ThemeChoice, { icon: 'monitor' | 'sun' | 'moon'; label: string }> = {
  system: { icon: 'monitor', label: 'Matching your system' },
  light: { icon: 'sun', label: 'Light' },
  dark: { icon: 'moon', label: 'Dark' },
}

function readStoredChoice(): ThemeChoice {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

/**
 * Cycles system -> light -> dark -> system. The icon always reflects the
 * saved choice, not the resolved color scheme, so "system" reliably shows
 * the monitor glyph even when the OS happens to be in dark mode.
 *
 * Unlike the old React version (useSyncExternalStore + a hand-rolled
 * same-tab pub/sub), Vue's reactivity is the pub/sub -- writing `choice`
 * from `apply()` is enough for every consumer to update. The `storage`
 * listener below only exists to pick up changes made in *other* tabs.
 */
export const useThemeStore = defineStore('theme', {
  state: () => ({ choice: 'system' as ThemeChoice }),
  getters: {
    meta: (state) => META[state.choice],
  },
  actions: {
    hydrate() {
      this.choice = readStoredChoice()
      if (typeof window === 'undefined') return
      useEventListener(window, 'storage', (e: StorageEvent) => {
        if (e.key === STORAGE_KEY || e.key === null) this.choice = readStoredChoice()
      })
    },
    apply(theme: ThemeChoice) {
      this.choice = theme
      if (typeof document === 'undefined') return
      document.documentElement.classList.remove('light', 'dark')
      if (theme === 'system') {
        window.localStorage.removeItem(STORAGE_KEY)
      } else {
        document.documentElement.classList.add(theme)
        window.localStorage.setItem(STORAGE_KEY, theme)
      }
    },
    cycle() {
      this.apply(NEXT[this.choice])
    },
  },
})
