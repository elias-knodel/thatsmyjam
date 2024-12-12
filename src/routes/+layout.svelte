<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import { userState } from '$lib/auth/user.svelte';
	import Header from '$lib/components/header/Header.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	let { children } = $props();

	userState.validateTime();
</script>

<ParaglideJS {i18n}>
	<div class="flex h-screen w-full flex-col">
		<header class="flex w-full items-center justify-center p-4">
			<Header />
		</header>

		<main class="flex w-full flex-grow justify-center p-4">
			<div class="w-full max-w-4xl">
				{@render children()}
			</div>
		</main>

		<footer class="flex w-full items-center justify-center bg-indigo-800 p-4 text-white">
			<Footer />
		</footer>
	</div>
</ParaglideJS>
