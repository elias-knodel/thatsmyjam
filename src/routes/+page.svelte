<script lang="ts">
	import { userState } from '$lib/auth/user.svelte.js';
	import DynamicItemGrid from '$lib/components/spotify/DynamicItemGrid.svelte';
</script>

<svelte:head>
	<title>Thats my Jam 🎶! | Spotify 3x3 Generator</title>
	<meta
		name="description"
		content="Log in with spotify to generate and share a custom 3x3 image based on your recently listened to or old time favourite songs. Affinity calculated by spotify, everything done client side."
	/>
</svelte:head>

{#if !userState.data.loggedIn}
	<p>Here WOULD be content... if you would sign in already :D</p>
{:else}
	<DynamicItemGrid />
{/if}
