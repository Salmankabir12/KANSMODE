<script lang="ts">
  import ArrowRight from 'lucide-svelte/icons/arrow-right';
  import FadeIn from "../animations/FadeIn.svelte";
  import LightBeamButton from "./LightBeamButton.svelte";

  let {
    title,
    description = undefined,
    buttonText = "Get in Touch",
    buttonHref = "/contact",
    transparent = false,
    class: className = "",
  }: {
    title: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
    transparent?: boolean;
    class?: string;
  } = $props();
</script>

<section
  class="relative overflow-hidden {transparent
    ? 'bg-transparent'
    : 'bg-brand-navy'} py-20 md:py-28 {className}"
>
  {#if !transparent}
    <div
      class="absolute inset-0 bg-gradient-to-br from-[#0d1117] via-brand-navy to-[#16213e]"
    ></div>

    <div
      class="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-brand-red/8 blur-3xl"
    ></div>
    <div
      class="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-red/5 blur-3xl"
    ></div>
  {/if}

  <div class="cta-blob cta-blob-1" aria-hidden="true"></div>
  <div class="cta-blob cta-blob-2" aria-hidden="true"></div>
  <div class="cta-blob cta-blob-3" aria-hidden="true"></div>

  <div class="absolute top-0 left-0 right-0 divider-glow"></div>

  <div
    class="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-white/5 rounded-tl hidden md:block"
  ></div>
  <div
    class="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-white/5 rounded-tr hidden md:block"
  ></div>
  <div
    class="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-white/5 rounded-bl hidden md:block"
  ></div>
  <div
    class="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-white/5 rounded-br hidden md:block"
  ></div>

  <div
    class="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-center"
  >
    <FadeIn>
              <span
          class="inline-block text-[11px] font-bold uppercase tracking-[0.3em] text-brand-red/70 mb-5"
        >
          Let's Work Together
        </span>

        <h2
          class="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-display leading-tight max-w-3xl mx-auto"
        >
          {title}
        </h2>

        {#if description}
          <p
            class="mt-5 text-white/45 max-w-2xl mx-auto text-base md:text-lg leading-relaxed"
          >
            {description}
          </p>
        {/if}

        <div
          class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <LightBeamButton
            href={buttonHref}
            variant="primary"
          >
            <span class="flex items-center gap-2 font-semibold text-sm tracking-wide">
              {buttonText}
              <ArrowRight
                class="h-4 w-4 group-hover:translate-x-1 transition-transform"
              />
            </span>
          </LightBeamButton>
          <LightBeamButton
            href="/about"
            variant="secondary"
          >
            <span class="font-medium text-sm">Learn More</span>
          </LightBeamButton>
        </div>
    </FadeIn>
  </div>
</section>

<style>
  .cta-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    will-change: transform;
    mix-blend-mode: screen;
  }

  .cta-blob-1 {
    width: 600px;
    height: 600px;
    top: -100px;
    right: -150px;
    background: radial-gradient(
      ellipse at center,
      rgba(233, 69, 96, 0.12) 0%,
      transparent 70%
    );
    animation: blob-drift 12s ease-in-out infinite alternate;
  }

  .cta-blob-2 {
    width: 400px;
    height: 400px;
    bottom: -80px;
    left: 20%;
    background: radial-gradient(
      ellipse at center,
      rgba(233, 69, 96, 0.08) 0%,
      transparent 65%
    );
    animation: blob-pulse 8s ease-in-out infinite;
  }

  .cta-blob-3 {
    width: 250px;
    height: 250px;
    top: 40%;
    left: -60px;
    background: radial-gradient(
      ellipse at center,
      rgba(255, 107, 138, 0.1) 0%,
      transparent 60%
    );
    animation: blob-rotate 16s linear infinite;
  }

  @keyframes blob-drift {
    from {
      transform: translate(0, 0) scale(1);
    }
    to {
      transform: translate(-80px, 60px) scale(1.15);
    }
  }

  @keyframes blob-pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.7;
    }
  }

  @keyframes blob-rotate {
    from {
      transform: rotate(0deg) translateX(30px);
    }
    to {
      transform: rotate(360deg) translateX(30px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cta-blob {
      animation: none;
    }
  }
</style>
