<script lang="ts">
	import { getUserStateContext } from '$lib/auth/user.svelte';
	import { redirectToAuthCodeFlow } from '$lib/spotify/auth.svelte';

	const user = getUserStateContext();
</script>

<div class="">
	{#if !user.data.loggedIn}
		<section id="profile">
			<button onclick="{redirectToAuthCodeFlow}"
				class="bg-[#1db954] flex rounded-md sm:px-8 px-4 py-2 hover:bg-opacity-80 focus:outline-none"
				>Sign in with Spotify</button
			>
		</section>
	{:else}
		<section>
			<h2 class="text-lg">
				Logged in as: <span class="font-bold">"placeholder"</span>
			</h2>

			<button onclick="{() => user.logOut()}">Log out</button>
		</section>
	{/if}
</div>
