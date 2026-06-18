<script>
	import { onMount } from 'svelte';

	/** @type {{ delay?: number, duration?: number, direction?: 'up'|'down'|'left'|'right'|'none', once?: boolean, class?: string }} */
	let {
		delay = 0,
		duration = 0.6,
		direction = 'up',
		once = true,
		class: className = ''
	} = $props();

	let animated = $state(false);
	let el;

	const offsets = {
		up: 'translateY(30px)',
		down: 'translateY(-30px)',
		left: 'translateX(30px)',
		right: 'translateX(-30px)',
		none: 'none'
	};

	let initialTransform = $derived(offsets[direction] || 'none');

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
	class="fade-in {className}"
	class:animated
	style:--fade-duration="{duration}s"
	style:--fade-delay="{delay}s"
	style:--fade-transform={initialTransform}
>
	<slot />
</div>

<style>
	.fade-in {
		opacity: 1;
		transform: none;
	}
	.fade-in.animated {
		opacity: 0;
		transform: var(--fade-transform);
		animation: fade-in-anim var(--fade-duration) ease-out var(--fade-delay) both;
		will-change: opacity, transform;
	}
	@keyframes fade-in-anim {
		from {
			opacity: 0;
			transform: var(--fade-transform);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
