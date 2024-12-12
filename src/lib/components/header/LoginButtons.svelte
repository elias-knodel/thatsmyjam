<script lang="ts">
	import { userState } from '$lib/auth/user.svelte';
	import { redirectToAuthCodeFlow } from '$lib/spotify/auth-tokens';
</script>

<div class="">
	{#if !userState.data.loggedIn}
		<section id="profile">
			<button
				onclick={redirectToAuthCodeFlow}
				class="flex rounded-md bg-[#1db954] px-4 py-2 hover:bg-opacity-80 focus:outline-none sm:px-8"
				>Sign in with Spotify</button
			>
		</section>
	{:else}
		<section>
			<h2 class="text-lg">
				Logged in as: <span class="font-bold">"placeholder"</span>
			</h2>

			<button onclick={() => userState.logOut()}>Log out</button>
		</section>
	{/if}
</div>
