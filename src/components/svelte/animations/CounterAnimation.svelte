<script>
	import { onMount, onDestroy } from 'svelte';

	/** @type {{ end: number, duration?: number, prefix?: string, suffix?: string, class?: string }} */
	let {
		end,
		duration = 2,
		prefix = '',
		suffix = '',
		class: className = ''
	} = $props();

	let count = $state(0);
	let el;
	let intervalId;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						startCounting();
						observer.unobserve(el);
					}
				}
			},
			{ rootMargin: '-80px' }
		);
		observer.observe(el);

		if (el) {
			const rect = el.getBoundingClientRect();
			const inViewport = rect.top < window.innerHeight && rect.bottom > 0;
			if (inViewport) {
				startCounting();
				observer.unobserve(el);
			}
		}

		return () => observer.disconnect();
	});

	function startCounting() {
		const totalFrames = Math.round(duration * 60);
		let frame = 0;
		const frameInterval = (duration * 1000) / totalFrames;

		intervalId = setInterval(() => {
			frame++;
			const progress = frame / totalFrames;
			count = Math.round(end * Math.min(progress, 1));
			if (frame >= totalFrames) {
				count = end;
				clearInterval(intervalId);
				intervalId = undefined;
			}
		}, frameInterval);
	}

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});
</script>

<span bind:this={el} class={className}>{prefix}{count.toLocaleString()}{suffix}</span>
