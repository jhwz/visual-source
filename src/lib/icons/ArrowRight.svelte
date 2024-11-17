<script lang="ts">
	type Props = {
		size?: number;
	};

	let { size = 16 }: Props = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width={size} height={size}
	><rect width="256" height="256" fill="none" /><line
		x1="40"
		y1="128"
		x2="216"
		y2="128"
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="16"
	/><polyline
		points="144 56 216 128 144 200"
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="16"
	/></svg
>
