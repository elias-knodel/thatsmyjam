<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { getUserStateContext } from '$lib/auth/user.svelte.js';
	import { getAccessToken } from '$lib/spotify/auth.svelte.js';
	import { SvelteDate } from 'svelte/reactivity';

	let { data } = $props();
    let user = getUserStateContext();

	if (data.code) {
		getAccessToken(data.code).then((resultJson) => {
            let expires_at = new SvelteDate();
            expires_at.setTime(expires_at.getTime() + 3600 * 1000);

			user.data.expiresAt = expires_at;
			user.data.accessToken = resultJson.access_token;
			user.data.refreshToken = resultJson.refresh_token;
			user.data.loggedIn = true;

			goto(`${base}/`);
		});
	}
</script>

<span>You will be redirected soon, do not resist.</span>
