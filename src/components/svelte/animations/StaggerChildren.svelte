<script>
	import { onMount } from 'svelte';

	/** @type {{ staggerDelay?: number, once?: boolean, class?: string }} */
	let {
		staggerDelay = 0.1,
		once = true,
		class: className = ''
	} = $props();

	let animated = $state(false);
	let el;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						animated = true;
						if (once) observer.unobserve(el);
					} else if (!once) {
						animated = false;
					}
				}
			},
			{ rootMargin: '-20px' }
		);
		observer.observe(el);

		if (el) {
			const rect = el.getBoundingClientRect();
			const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
			if (inViewport) {
				animated = true;
				if (once) observer.unobserve(el);
			}
		}

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={el}
	class="stagger-parent {className}"
	class:animated
	style:--stagger-delay="{staggerDelay}s"
>
	<slot />
</div>

<style>
	.stagger-parent :global(.stagger-item) {
		opacity: 1;
		transform: none;
	}

	.stagger-parent.animated :global(.stagger-item) {
		opacity: 0;
		transform: translateY(20px);
		animation: stagger-in 0.5s ease forwards;
		animation-delay: calc(var(--index, 0) * var(--stagger-delay, 0.1s));
	}

	@keyframes stagger-in {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
