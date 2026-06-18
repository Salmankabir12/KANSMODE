<script>
	import { onMount, onDestroy } from 'svelte';

	/** @type {{ speed?: number, class?: string }} */
	let {
		speed = 0.3,
		class: className = ''
	} = $props();

	let offset = $state(0);
	let el;
	let ticking = false;

	function handleScroll() {
		if (!ticking) {
			requestAnimationFrame(() => {
				if (el) {
					const rect = el.getBoundingClientRect();
					const windowHeight = window.innerHeight;
					const elementCenter = rect.top + rect.height / 2;
					const viewportCenter = windowHeight / 2;
					offset = (elementCenter - viewportCenter) * speed;
				}
				ticking = false;
			});
			ticking = true;
		}
	}

	onMount(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<div style="display: contents;">
	<div
		bind:this={el}
		class="parallax-section {className}"
		style:transform="translateY({offset}px)"
	>
		<div style="display: contents;">
			<slot />
		</div>
	</div>
</div>

<style>
	.parallax-section {
		will-change: transform;
	}
</style>
