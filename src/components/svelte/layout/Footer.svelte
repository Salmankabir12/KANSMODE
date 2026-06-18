<script>
  import { onMount } from 'svelte';
  import Mail from 'lucide-svelte/icons/mail';
  import Phone from 'lucide-svelte/icons/phone';
  import MapPin from 'lucide-svelte/icons/map-pin';
  import ArrowRight from 'lucide-svelte/icons/arrow-right';

  let footerHeight = $state(0);
  let footerEl = $state();
  let currentYear = $state(2026);

  const footerLinks = {
    company: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Products', href: '/products' },
      { label: 'Clients', href: '/client' },
      { label: 'Contact', href: '/contact' },
    ],
    resources: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  onMount(() => {
    currentYear = new Date().getFullYear();
    const updateHeight = () => {
      if (footerEl) {
        footerHeight = footerEl.offsetHeight;
      }
    };
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (footerEl) resizeObserver.observe(footerEl);
    window.addEventListener('resize', updateHeight);
    return () => {
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
    };
  });
</script>

<!-- Reveal-on-scroll wrapper -->
<div class="relative lg:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]">
  <div class="h-auto lg:h-[var(--footer-height)]" style="--footer-height: {footerHeight}px;">
    <footer
      bind:this={footerEl}
      class="relative lg:fixed bottom-0 left-0 right-0 bg-brand-navy text-white"
    >
      <!-- Decorative background -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-32 h-32 border border-white/5 rotate-12"></div>
        <div class="absolute top-40 right-20 w-24 h-24 border border-white/5 -rotate-6"></div>
        <div class="absolute bottom-32 left-1/3 w-40 h-40 border border-white/5 rotate-45"></div>
        <div class="absolute bottom-20 right-1/4 w-20 h-20 border border-brand-red/10 rotate-12"></div>
      </div>

      <div class="relative z-10">
        <!-- Main Footer Content -->
        <div class="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl py-16 lg:py-20">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            <!-- Brand Column -->
            <div class="lg:col-span-1">
              <a href="/" class="inline-block mb-6">
                <span class="text-2xl font-bold font-display tracking-tight text-white">
                  KANS MODE
                </span>
              </a>
              <p class="text-white/60 text-sm leading-relaxed mb-6">
                100% export oriented readymade garments buying house company based in Bangladesh.
                We connect global buyers with reliable manufacturers, ensuring quality, compliance,
                and timely delivery.
              </p>
            </div>

            <!-- Quick Links -->
            <div>
              <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                Quick Links
              </h3>
              <ul class="space-y-3">
                {#each footerLinks.company as link}
                  <li>
                    <a
                      href={link.href}
                      class="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"
                    >
                      <ArrowRight
                        size={12}
                        class="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      />
                      <span class="group-hover:translate-x-0 -translate-x-4 transition-transform duration-200">
                        {link.label}
                      </span>
                    </a>
                  </li>
                {/each}
              </ul>
            </div>

            <!-- Products -->
            <div>
              <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                Products
              </h3>
              <ul class="space-y-3">
                <li><a href="/products" class="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"><ArrowRight size={12} class="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" /><span class="group-hover:translate-x-0 -translate-x-4 transition-transform duration-200">Woven Garments</span></a></li>
                <li><a href="/products" class="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"><ArrowRight size={12} class="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" /><span class="group-hover:translate-x-0 -translate-x-4 transition-transform duration-200">Knit Garments</span></a></li>
                <li><a href="/products" class="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-200"><ArrowRight size={12} class="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" /><span class="group-hover:translate-x-0 -translate-x-4 transition-transform duration-200">Sweater</span></a></li>
              </ul>
            </div>

            <!-- Contact -->
            <div>
              <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                Contact
              </h3>
              <ul class="space-y-4">
                <li>
                  <a
                    href="mailto:info@kansmode.com"
                    class="flex items-start gap-3 text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    <Mail size={16} class="mt-0.5 shrink-0" />
                    <span>info@kansmode.com</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+8801716972940"
                    class="flex items-start gap-3 text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    <Phone size={16} class="mt-0.5 shrink-0" />
                    <span>+880 1716 972 940</span>
                  </a>
                </li>
                <li>
                  <div class="flex items-start gap-3 text-sm text-white/60">
                    <MapPin size={16} class="mt-0.5 shrink-0" />
                    <span>House# 06 Road# 19 Sector# 12 Uttara Dhaka-1230, Bangladesh</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-white/10">
          <div class="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-center sm:text-left">
              <p class="text-sm text-white/40">
                &copy; {currentYear} Kans Mode International. All rights reserved.
              </p>
              <span class="hidden sm:inline text-white/10">|</span>
              <p class="text-sm text-white/40">
                Design and development by <span class="text-white/60">GrandScope</span>
              </p>
            </div>
            <div class="flex items-center gap-6">
              {#each footerLinks.resources as link}
                <a
                  href={link.href}
                  class="text-sm text-white/40 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</div>
