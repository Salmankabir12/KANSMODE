<script>
	import Activity from 'lucide-svelte/icons/activity';
	import Zap from 'lucide-svelte/icons/zap';
	import Cpu from 'lucide-svelte/icons/cpu';
	import Hexagon from 'lucide-svelte/icons/hexagon';
	import Wifi from 'lucide-svelte/icons/wifi';
	import Leaf from 'lucide-svelte/icons/leaf';
	import Car from 'lucide-svelte/icons/car';
	import FlaskConical from 'lucide-svelte/icons/flask-conical';
	import HelpCircle from 'lucide-svelte/icons/help-circle';

	let {
		name = '',
		size = 24,
		strokeWidth = 2,
		class: className = '',
	} = $props();

	const icons = {
		activity: Activity,
		zap: Zap,
		cpu: Cpu,
		hexagon: Hexagon,
		wifi: Wifi,
		leaf: Leaf,
		car: Car,
		'flask-conical': FlaskConical,
	};

	let IconComponent = $derived(icons[name] || HelpCircle);
</script>

<svelte:component
	this={IconComponent}
	{size}
	{strokeWidth}
	class={className}
/>
