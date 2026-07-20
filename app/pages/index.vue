<script setup lang="ts">
// Marketing landing page — ported from app/page.tsx.
</script>

<template>
  <div class="relative flex flex-1 flex-col items-center justify-center px-6 py-20">
    <ThemeToggle class="absolute top-6 right-6" />
    <Ticket edge="bottom" class="w-full max-w-md pb-4">
      <TicketHeader business="Vouch" meta="Order up" />
      <TicketPerforation />
      <div class="flex flex-col gap-6 px-6 pt-6 pb-2">
        <h1 class="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance">
          Turn a good meal into a video testimonial
        </h1>
        <p class="text-[0.95rem] leading-relaxed text-muted-foreground text-balance">
          Put a QR code on the table. Diners answer a few questions on camera and get a discount.
          You review and publish in 30 seconds.
        </p>
        <div class="flex flex-col gap-3 sm:flex-row">
          <Button as-child size="xl" class="flex-1">
            <NuxtLink to="/signup">Get started free</NuxtLink>
          </Button>
          <Button as-child variant="outline" size="xl" class="flex-1">
            <NuxtLink to="/login">Log in</NuxtLink>
          </Button>
        </div>
      </div>
    </Ticket>
  </div>
</template>
