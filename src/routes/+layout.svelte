<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css'; // global design system

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Google Fonts -->
	<link
		href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;700&family=Roboto:wght@400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}