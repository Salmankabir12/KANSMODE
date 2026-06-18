<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    maxTilt = 10,
    perspective = 1000,
    scale = 1.02,
    glare = true,
    class: className = ''
  }: {
    maxTilt?: number;
    perspective?: number;
    scale?: number;
    glare?: boolean;
    class?: string;
  } = $props();

  let cardEl = $state<HTMLDivElement | undefined>(undefined);
  let glareEl = $state<HTMLDivElement | undefined>(undefined);

  function handleMouseMove(e: MouseEvent) {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    cardEl.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

    if (glareEl && glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.15) 0%, transparent 60%)`;
    }
  }

  function handleMouseLeave() {
    if (!cardEl) return;
    cardEl.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (glareEl) {
      glareEl.style.background = 'transparent';
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={cardEl}
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
  class="transition-transform duration-200 ease-out {className}"
  style="transform-style: preserve-3d;"
>
  <div style="display: contents;">
    <slot />
  </div>
  {#if glare}
    <div
      bind:this={glareEl}
      class="pointer-events-none absolute inset-0 rounded-[inherit] z-10 transition-opacity duration-300"
    ></div>
  {/if}
</div>
