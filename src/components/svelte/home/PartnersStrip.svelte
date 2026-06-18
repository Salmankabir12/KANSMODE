<script lang="ts">
  import FadeIn from '../animations/FadeIn.svelte';

  let {
    partners,
  }: {
    partners: Array<{ name: string; country: string }>;
  } = $props();

  let doubled = $derived([...partners, ...partners, ...partners, ...partners]);
</script>

{#if partners.length > 0}
  <div>
    <div class="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl">
      <FadeIn>
        <div class="text-center mb-10">
          <p class="text-[11px] font-bold text-text-muted/60 uppercase tracking-[0.3em]">
            Global Partnerships
          </p>
        </div>
      </FadeIn>
    </div>

    <div class="marquee-container relative">
      <div class="marquee-track py-2">
        {#each doubled as partner, i}
          <div class="flex items-center gap-3 px-6 py-3 mx-3 rounded-xl bg-bg-tertiary/60 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-sm transition-all duration-300 shrink-0">
            <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-navy/10 to-brand-navy/20 flex items-center justify-center text-xs font-bold text-brand-navy shrink-0">
              {partner.name.charAt(0)}
            </div>
            <div class="whitespace-nowrap">
              <p class="text-sm font-semibold text-text-heading">{partner.name}</p>
              <p class="text-xs text-text-muted">{partner.country}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
