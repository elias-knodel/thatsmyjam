<script lang="ts">
	import DynamicItemGrid from '$lib/components/spotify/DynamicItemGrid.svelte';

	let { data } = $props();
</script>

{#await data.profile}
	<h1 class="text-xl">Display your Spotify profile data</h1>

	<br />

	<section id="profile">
		<h2 class="text-lg">You are not logged in yet, please log in.</h2>
	</section>
{:then profile}
	<section>
		<h2 class="text-lg">Logged in as: <span class="font-bold">{profile?.display_name}</span></h2>
		<!-- <span></span>
		<ul>
			<li>User ID: <span>{profile?.id}</span></li>
			<li>Email: <span>{profile?.email}</span></li>
			<li>Link: <a target="_blank" href={profile?.external_urls.spotify}>{profile?.uri}</a></li>
			<li>Profile Image: <span>{profile?.images[0].url}</span></li>
		</ul> -->
	</section>
{/await}

<DynamicItemGrid />
