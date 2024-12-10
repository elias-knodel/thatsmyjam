<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import LanguageSwitcher from '$lib/components/lang/LanguageSwitcher.svelte';
	import { setUserStateContext } from '$lib/auth/user.svelte';
	let { children } = $props();

	setUserStateContext();
</script>

<ParaglideJS {i18n}>
	<LanguageSwitcher />

	<main>
		{@render children()}
	</main>
</ParaglideJS>
