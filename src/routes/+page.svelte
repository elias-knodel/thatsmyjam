<script lang="ts">
	import DynamicItemGrid from '$lib/components/spotify/DynamicItemGrid.svelte';

	let { data } = $props();
</script>

<div class="flex h-screen">
	<div class="mx-auto">
		<div class="max-w-4xl">
			<br /><br />

			{#await data.profile}
				<section id="profile">
					<h2 class="text-lg">Loading your data...</h2>
				</section>
			{:then profile}
				{#if !profile}
					<section id="profile">
						<h2 class="text-lg">You are not logged in yet, please log in.</h2>
					</section>
				{/if}

				{#if profile}
					<section>
						<h2 class="text-lg">
							Logged in as: <span class="font-bold">{profile?.display_name}</span>
						</h2>
					</section>
				{/if}
			{/await}

			<!-- <DynamicItemGrid /> -->
			<div class="w-screen"></div>
		</div>
	</div>
</div>
