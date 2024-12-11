<script lang="ts">
	import { getUserStateContext } from '$lib/auth/user.svelte.js';
	import DynamicItemGrid from '$lib/components/spotify/DynamicItemGrid.svelte';

	const user = getUserStateContext();
</script>

{#if !user.data.loggedIn}
	<p>Here WOULD be content... if you would sign in already :D</p>
{:else}
	<DynamicItemGrid />
{/if}
