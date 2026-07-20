<script setup lang="ts">
import { LayoutDashboard, ListChecks, Video, FileText, Users, QrCode, Settings, LogOut } from '@lucide/vue'
import { cn } from '@/lib/utils'
import type { Business } from '@/lib/supabase/types'

defineProps<{ business: Business }>()

const NAV_ITEMS = [
  { href: '/dashboard', label: 'The pass', icon: LayoutDashboard },
  { href: '/dashboard/testimonials', label: 'Video', icon: Video },
  { href: '/dashboard/written', label: 'Written', icon: FileText },
  { href: '/dashboard/customers', label: 'People', icon: Users },
  { href: '/dashboard/questions', label: 'Questions', icon: ListChecks },
  { href: '/dashboard/qr', label: 'QR code', icon: QrCode },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const route = useRoute()
const supabase = useSupabaseClient()

function isActive(href: string) {
  return href === '/dashboard' ? route.path === href : route.path.startsWith(href)
}

async function handleLogout() {
  await supabase.auth.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <aside class="sticky top-0 flex h-svh w-64 shrink-0 flex-col self-start overflow-y-auto border-r bg-sidebar">
    <div class="flex flex-col gap-3 px-5 py-5">
      <span class="font-display text-lg font-semibold tracking-tight">Vouch</span>
      <div class="flex items-center gap-2.5">
        <div
          class="flex size-7 items-center justify-center rounded-sm text-xs font-semibold text-primary-foreground"
          :style="{ backgroundColor: business.brand_color }"
        >
          {{ business.name.charAt(0).toUpperCase() }}
        </div>
        <span class="ticket-meta truncate text-ink">{{ business.name }}</span>
      </div>
    </div>

    <nav class="mt-2 flex flex-1 flex-col gap-0.5 px-3">
      <NuxtLink
        v-for="item in NAV_ITEMS"
        :key="item.href"
        :to="item.href"
        :class="
          cn(
            'flex items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
          )
        "
      >
        <component :is="item.icon" class="size-4" />
        {{ item.label }}
      </NuxtLink>
    </nav>

    <div class="flex items-center gap-2 border-t border-sidebar-border px-3 py-3">
      <button
        class="flex flex-1 items-center gap-3 rounded-sm px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        @click="handleLogout"
      >
        <LogOut class="h-4 w-4" />
        Log out
      </button>
      <ThemeToggle />
    </div>
  </aside>
</template>
