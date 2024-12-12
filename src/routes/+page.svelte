<script lang="ts">
	import { userState } from '$lib/auth/user.svelte.js';
	import DynamicItemGrid from '$lib/components/spotify/DynamicItemGrid.svelte';
</script>

{#if !userState.data.loggedIn}
	<p>Here WOULD be content... if you would sign in already :D</p>
{:else}
	<DynamicItemGrid />
{/if}
