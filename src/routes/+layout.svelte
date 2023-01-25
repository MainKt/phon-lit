<script>
	import Header from './Header.svelte';
	import './styles.scss';
</script>

<div id="root">
	<Header />

	<main class="container">
		<slot />
	</main>

	<footer style:text-align="center" class="container">
		<hr>
		Made with SvelteKit and PicoCSS -
		<a href="https://github.com/MainKt/phon-lit">Source Code</a>
	</footer>
</div>


