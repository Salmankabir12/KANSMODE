<script>
	import { onMount } from 'svelte';

	/** @type {{ text: string, class?: string, delay?: number, as?: string }} */
	let {
		text,
		class: className = '',
		delay = 0,
		as = 'h2'
	} = $props();

	let animated = $state(false);
	let el;

	let words = $derived(text.split(' '));

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						animated = true;
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
				animated = true;
				observer.unobserve(el);
			}
		}

		return () => observer.disconnect();
	});
</script>

<div bind:this={el} class="text-reveal-wrapper">
	<svelte:element this={as} class="text-reveal {className}" class:animated>
		{#each words as word, i}
			<span class="word-wrap">
				<span
					class="word"
					style:--word-index={i}
					style:--word-delay="{delay}s"
				>
					{word}
				</span>
			</span>
			{#if i < words.length - 1}
				{' '}
			{/if}
		{/each}
	</svelte:element>
</div>

<style>
	.text-reveal {
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.3em;
	}

	.word-wrap {
		display: inline-block;
		overflow: hidden;
		vertical-align: bottom;
		padding-bottom: 0.3em;
		margin-bottom: -0.3em;
	}

	.word {
		display: inline-block;
		transform: translateY(0);
	}

	.text-reveal.animated .word {
		animation: text-reveal-in 0.5s ease-out forwards;
		animation-delay: calc(var(--word-index) * 0.05s + var(--word-delay, 0s));
	}

	@keyframes text-reveal-in {
		from {
			transform: translateY(100%);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
