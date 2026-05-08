<script lang="ts">
	type Props = {
		size?: number;
	};

	let { size = 16 }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width={size} height={size}>
	<rect width="256" height="256" fill="none" />
	<path
		d="M92.69,216H48a8,8,0,0,1-8-8V163.31a8,8,0,0,1,2.34-5.65l120-120a8,8,0,0,1,11.32,0l44.68,44.68a8,8,0,0,1,0,11.32l-120,120A8,8,0,0,1,92.69,216Z"
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="16"
	/>
	<line
		x1="136"
		y1="64"
		x2="192"
		y2="120"
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="16"
	/>
</svg>
