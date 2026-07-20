<script setup lang="ts">
import { ArrowUpDown, Download, Users } from '@lucide/vue'
import type { ResponseStatus } from '@/lib/supabase/types'
import type { BadgeVariants } from '@/components/ui/Badge.vue'

type SortKey = 'name' | 'date' | 'videos' | 'texts' | 'status'

const statusVariant: Record<ResponseStatus, BadgeVariants['variant']> = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'destructive',
}

function toCsvValue(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

const store = useResponsesStore()
const search = ref('')
const sortKey = ref<SortKey>('date')
const sortAsc = ref(false)

const rows = computed(() =>
  store.responses.map((response) => ({
    response,
    videoCount: response.answers.filter((a) => a.video_url).length,
    textCount: response.answers.filter((a) => a.text_answer).length,
  })),
)

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase()
  const filtered = q
    ? rows.value.filter((row) =>
        [row.response.customer_name, row.response.customer_email, row.response.customer_phone]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(q)),
      )
    : rows.value

  return [...filtered].sort((a, b) => {
    let comparison = 0
    switch (sortKey.value) {
      case 'name':
        comparison = (a.response.customer_name ?? '').localeCompare(b.response.customer_name ?? '')
        break
      case 'date':
        comparison = new Date(a.response.created_at).getTime() - new Date(b.response.created_at).getTime()
        break
      case 'videos':
        comparison = a.videoCount - b.videoCount
        break
      case 'texts':
        comparison = a.textCount - b.textCount
        break
      case 'status':
        comparison = a.response.status.localeCompare(b.response.status)
        break
    }
    return sortAsc.value ? comparison : -comparison
  })
})

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function exportCsv() {
  const header = ['Name', 'Email', 'Phone', 'Date', '# Videos', '# Text', 'Status']
  const lines = [header.join(',')]

  for (const row of filteredRows.value) {
    lines.push(
      [
        toCsvValue(row.response.customer_name ?? ''),
        toCsvValue(row.response.customer_email ?? ''),
        toCsvValue(row.response.customer_phone ?? ''),
        toCsvValue(new Date(row.response.created_at).toLocaleDateString()),
        String(row.videoCount),
        String(row.textCount),
        toCsvValue(row.response.status),
      ].join(','),
    )
  }

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'vouch-customers.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <EmptyState
    v-if="store.responses.length === 0"
    :icon="Users"
    title="No customers yet"
    description="Everyone who submits a testimonial will show up here."
    action-label="Get your QR code"
    action-href="/dashboard/qr"
  />

  <div v-else>
    <div class="flex items-center justify-between gap-4">
      <Input v-model="search" placeholder="Search by name, email, or phone..." class="max-w-sm" />
      <Button variant="outline" @click="exportCsv">
        <Download class="h-4 w-4" />
        Export CSV
      </Button>
    </div>

    <div class="mt-4 rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <button class="flex items-center gap-1 font-medium" @click="toggleSort('name')">
                Name
                <ArrowUpDown :class="['h-3 w-3', sortKey === 'name' ? 'text-foreground' : 'text-muted-foreground/50']" />
              </button>
            </TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>
              <button class="flex items-center gap-1 font-medium" @click="toggleSort('date')">
                Date
                <ArrowUpDown :class="['h-3 w-3', sortKey === 'date' ? 'text-foreground' : 'text-muted-foreground/50']" />
              </button>
            </TableHead>
            <TableHead>
              <button class="flex items-center gap-1 font-medium" @click="toggleSort('videos')">
                # Videos
                <ArrowUpDown :class="['h-3 w-3', sortKey === 'videos' ? 'text-foreground' : 'text-muted-foreground/50']" />
              </button>
            </TableHead>
            <TableHead>
              <button class="flex items-center gap-1 font-medium" @click="toggleSort('texts')">
                # Text
                <ArrowUpDown :class="['h-3 w-3', sortKey === 'texts' ? 'text-foreground' : 'text-muted-foreground/50']" />
              </button>
            </TableHead>
            <TableHead>
              <button class="flex items-center gap-1 font-medium" @click="toggleSort('status')">
                Status
                <ArrowUpDown :class="['h-3 w-3', sortKey === 'status' ? 'text-foreground' : 'text-muted-foreground/50']" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="{ response, videoCount, textCount } in filteredRows"
            :key="response.id"
            class="cursor-pointer"
            @click="store.select(response.id)"
          >
            <TableCell class="font-medium">{{ response.customer_name || 'Anonymous' }}</TableCell>
            <TableCell class="text-muted-foreground">{{ response.customer_email || '—' }}</TableCell>
            <TableCell class="text-muted-foreground">{{ response.customer_phone || '—' }}</TableCell>
            <TableCell>{{ new Date(response.created_at).toLocaleDateString() }}</TableCell>
            <TableCell>{{ videoCount }}</TableCell>
            <TableCell>{{ textCount }}</TableCell>
            <TableCell>
              <Badge :variant="statusVariant[response.status]" class="capitalize">{{ response.status }}</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <ResponseDetailModal />
  </div>
</template>
