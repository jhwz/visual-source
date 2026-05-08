<script lang="ts">
	type Props = {
		size?: number;
	};

	let { size = 16 }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width={size} height={size}>
	<rect width="256" height="256" fill="none" />
	<polyline
		points="208 96 128 176 48 96"
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="16"
	/>
</svg>
