<script>
  import { onMount } from 'svelte';
  import Menu from 'lucide-svelte/icons/menu';
  import X from 'lucide-svelte/icons/x';

  /** @type {{ pathname: string }} */
  let { pathname } = $props();

  const NAV_ITEMS = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Products', href: '/products' },
    { label: 'Clients', href: '/client' },
    { label: 'Contact', href: '/contact' },
  ];

  let scrolled = $state(false);
  let mobileNavOpen = $state(false);

  let variant = $derived(!scrolled ? 'solid-dark' : 'solid-light');

  $effect(() => {
    pathname;
    mobileNavOpen = false;
  });

  onMount(() => {
    const onScroll = () => {
      scrolled = window.scrollY > 50;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function isActive(href) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }
</script>

<header class="fixed top-0 left-0 right-0 z-50" style="--header-h: 4rem;">
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>

  <!-- Desktop -->
  <div
    class="hidden lg:block transition-colors duration-300 {variant === 'solid-dark'
      ? 'bg-transparent'
      : 'bg-bg-secondary border-b border-black/[0.06] shadow-[0_4px_14px_rgba(0,0,0,0.04)]'}"
  >
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="flex flex-col leading-tight" aria-label="Kans Mode home">
          <span
            class="font-display font-extrabold text-lg tracking-[0.06em] bg-clip-text text-transparent transition-all duration-300 {variant ===
            'solid-dark'
              ? 'bg-gradient-to-b from-white to-slate-300'
              : 'bg-gradient-to-b from-brand-navy to-slate-600'}"
          >
            KANS MODE
          </span>
          <span
            class="text-[10px] font-medium tracking-[0.08em] uppercase transition-colors duration-300 {variant ===
            'solid-dark'
              ? 'text-white/50'
              : 'text-text-secondary/70'}"
          >
            Garments Buying House
          </span>
        </a>

        <nav class="flex items-center gap-1">
          {#each NAV_ITEMS as item}
            <a
              href={item.href}
              class="px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 {isActive(
                item.href,
              )
                ? 'text-brand-red bg-white/10'
                : variant === 'solid-dark'
                  ? 'text-white/80 hover:text-white hover:bg-white/10'
                  : 'text-text-secondary hover:text-brand-navy hover:bg-black/[0.04]'}"
            >
              {item.label}
            </a>
          {/each}
        </nav>
      </div>
    </div>
  </div>

  <!-- Mobile -->
  <div
    class="lg:hidden transition-colors duration-300 {variant === 'solid-dark'
      ? 'bg-transparent'
      : 'bg-bg-secondary border-b border-black/[0.06] shadow-[0_4px_14px_rgba(0,0,0,0.04)]'}"
  >
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div class="flex items-center justify-between h-16">
        <a href="/" class="flex flex-col leading-tight" aria-label="Kans Mode home">
          <span
            class="font-display font-extrabold text-lg tracking-[0.06em] bg-clip-text text-transparent transition-all duration-300 {variant ===
            'solid-dark'
              ? 'bg-gradient-to-b from-white to-slate-300'
              : 'bg-gradient-to-b from-brand-navy to-slate-600'}"
          >
            KANS MODE
          </span>
          <span
            class="text-[10px] font-medium tracking-[0.08em] uppercase transition-colors duration-300 {variant ===
            'solid-dark'
              ? 'text-white/50'
              : 'text-text-secondary/70'}"
          >
            Garments Buying House
          </span>
        </a>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="p-2 rounded-lg transition-colors {variant === 'solid-dark'
              ? 'text-white hover:bg-white/10'
              : 'text-text-heading hover:bg-gray-100'}"
            onclick={() => (mobileNavOpen = !mobileNavOpen)}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-sheet"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          >
            {#if mobileNavOpen}
              <X size={22} />
            {:else}
              <Menu size={22} />
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Mobile Sheet -->
  {#if mobileNavOpen}
    <div
      id="mobile-sheet"
      class="lg:hidden fixed inset-0 top-16 z-40 bg-brand-navy overflow-y-auto"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
      onclick={(e) => { if (e.target === e.currentTarget) mobileNavOpen = false; }}
    >
      <nav class="px-4 py-5 space-y-0.5">
        {#each NAV_ITEMS as item}
          <a
            href={item.href}
            onclick={() => (mobileNavOpen = false)}
            class="block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 {isActive(
              item.href,
            )
              ? 'text-brand-red bg-white/5'
              : 'text-white hover:bg-white/5'}"
          >
            {item.label}
          </a>
        {/each}
      </nav>
    </div>
  {/if}
</header>

<style>
  header {
    transition: background-color 0.3s ease;
  }
</style>
