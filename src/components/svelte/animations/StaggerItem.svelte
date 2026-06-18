<script>
	/** @type {{ index?: number, class?: string }} */
	let {
		index = 0,
		class: className = ''
	} = $props();
</script>

<div class="stagger-item {className}" style:--index={index}>
	<div style="display: contents;">
		<slot />
	</div>
</div>
