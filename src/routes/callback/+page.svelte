<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { userState } from '$lib/auth/user.svelte.js';
	import { getAccessToken } from '$lib/spotify/auth-tokens.js';
	import { SvelteDate } from 'svelte/reactivity';

	let { data } = $props();

	if (data.code) {
		getAccessToken(data.code).then((resultJson) => {
			let expires_at = new SvelteDate();
			expires_at.setTime(expires_at.getTime() + 3600 * 1000);

			userState.data.expiresAt = expires_at;
			userState.data.accessToken = resultJson.access_token;
			userState.data.refreshToken = resultJson.refresh_token;
			userState.data.loggedIn = true;

			goto(`${base}/`);
		});
	}
</script>

<span>You will be redirected soon, do not resist.</span>
