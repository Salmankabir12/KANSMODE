<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		variant?: 'primary' | 'secondary' | string;
		size?: 'sm' | 'md' | 'lg';
		class?: string;
		children?: Snippet;
		[key: string]: any;
	}

	let {
		href = undefined,
		type = 'button',
		variant = 'primary',
		size = 'md',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	let isHovered = $state(false);

	const isPrimary = $derived(variant === 'primary');
	
	const sizeClasses = $derived({
		sm: 'px-6 py-2 text-sm',
		md: 'px-9 py-4 text-base',
		lg: 'px-12 py-5 text-lg'
	}[size]);

	const beamClasses = $derived(
		isHovered
			? 'opacity-100 animate-[spin_2.5s_linear_infinite]'
			: 'opacity-0'
	);
</script>

{#snippet content()}
	<span class="absolute inset-0 w-full h-full {isPrimary ? 'bg-brand-red/80' : 'bg-brand-navy border border-white/5'}"></span>
	
	<span
		class="beam-spin absolute w-[300%] h-[300%] left-[-100%] top-[-100%] pointer-events-none transition-opacity duration-300 {beamClasses}"
		style="background: conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 38%, #ffffff 42%, #ffffff 58%, transparent 62%, transparent 100%);"
	></span>
	
	<span class="relative flex items-center justify-center w-full h-full {sizeClasses} rounded-[9.5px] transition-colors duration-300 {isPrimary ? 'bg-brand-red text-white hover:bg-[#d63d56]' : 'bg-brand-navy text-white/80 hover:text-white hover:bg-[#1f1f38]'} z-10 mx-auto my-auto font-medium tracking-wide">
		{#if children}
			{@render children()}
		{/if}
	</span>
{/snippet}

<div class="contents">
	{#if href}
		<a
			{href}
			class="relative inline-flex items-center justify-center p-[2.5px] overflow-hidden rounded-xl {className}"
			onmouseenter={(e: MouseEvent) => {
				isHovered = true;
				if (typeof rest?.onmouseenter === 'function') rest.onmouseenter(e);
			}}
			onmouseleave={(e: MouseEvent) => {
				isHovered = false;
				if (typeof rest?.onmouseleave === 'function') rest.onmouseleave(e);
			}}
			style="box-shadow: {isHovered ? (isPrimary ? '0 0 35px rgba(233,69,96,0.4)' : '0 4px 25px rgba(0,0,0,0.6)') : 'none'}; {rest?.style || ''}"
			{...rest}
		>
			{@render content()}
		</a>
	{:else}
		<button
			{type}
			class="relative inline-flex items-center justify-center p-[2.5px] overflow-hidden rounded-xl {className}"
			onmouseenter={(e: MouseEvent) => {
				isHovered = true;
				if (typeof rest?.onmouseenter === 'function') rest.onmouseenter(e);
			}}
			onmouseleave={(e: MouseEvent) => {
				isHovered = false;
				if (typeof rest?.onmouseleave === 'function') rest.onmouseleave(e);
			}}
			style="box-shadow: {isHovered ? (isPrimary ? '0 0 35px rgba(233,69,96,0.4)' : '0 4px 25px rgba(0,0,0,0.6)') : 'none'}; {rest?.style || ''}"
			{...rest}
		>
			{@render content()}
		</button>
	{/if}
</div>
