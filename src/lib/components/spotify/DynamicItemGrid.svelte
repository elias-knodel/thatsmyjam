<script lang="ts">
	import { fade } from 'svelte/transition';
	import { uppercased } from '$lib/utils';
	import { cubicInOut } from 'svelte/easing';
	import * as m from '$lib/paraglide/messages.js';
	import { TopTrackItems } from './TopTrackItems.svelte';
	import { untrack } from 'svelte';
	import { flip } from 'svelte/animate';

	let timeRangeOptions = $state([
		{
			key: 'short_term',
			text: m.spotify_time_range_short()
		},
		{
			key: 'medium_term',
			text: m.spotify_time_range_medium()
		},
		{
			key: 'long_term',
			text: m.spotify_time_range_long()
		}
	]);

	let selectedTimeRange = $state(timeRangeOptions[0]);

	const topTrackItemsState = new TopTrackItems();

	// $inspect(selectedTimeRange);

	$effect(() => {
		let rangeValue = selectedTimeRange;

		untrack(() => topTrackItemsState.setTimeSpan(rangeValue.key));
	});
</script>

<br />

<div class="flex-inline flex">
	<h1 class="text-xl">Your Jam:</h1>

	<span>&emsp;&emsp;</span>

	<select class="text-gray-900" bind:value={selectedTimeRange}>
		{#each timeRangeOptions as timeRange}
			<option value={timeRange}>
				{timeRange.text}
			</option>
		{/each}
	</select>
</div>

<br />
<br />
<br />

{#await topTrackItemsState.filtered()}
	<span>Loading...</span>
{:then topItems}
	<div class="grid max-w-[864px] grid-cols-3">
		{#each topItems as item, index (item.id)}
			<section
				onclick={() => topTrackItemsState.removeItem(index)}
				in:fade={{ duration: 700, easing: cubicInOut }}
				out:fade={{ duration: 0, delay: 0 }}
				aria-hidden="true"
				class="relative isolate flex max-h-72 min-h-72 min-w-72 max-w-72 flex-col justify-end overflow-hidden px-4 pb-6 pt-36"
			>
				<img
					class="absolute inset-0 h-full w-full object-cover"
					alt="Album cover"
					src={item?.album.images[0].url}
				/>

				<div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
				<h3 class="z-10 text-2xl font-bold text-white">{item?.name}</h3>
				<div class="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
					{uppercased(item?.album.album_type)}: {item?.album.name}
				</div>
				<div class="z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
					Aritst: {item?.artists[0].name}
				</div>
			</section>
		{/each}
	</div>
{/await}

<div class="my-12">
	<h2 class="mb-4 text-xl">Next:</h2>

	{#await topTrackItemsState.next()}
		<span>Loading...</span>
	{:then topItems}
		<!-- <div class="flex max-w-[864px] flex-row justify-between"> -->
		<div class="grid max-w-[864px] grid-cols-4 gap-x-40">
			{#each topItems as item, index (item.id)}
				<section
					animate:flip={{ delay: 0, duration: 300 }}
					out:fade={{ duration: 0, delay: 0 }}
					aria-hidden="true"
					class="h-24 w-24"
					style="z-index: {5 - index};"
				>
					<img class="h-full w-full" alt={item?.album.name} src={item?.album.images[1].url} />
				</section>
			{/each}
		</div>
	{/await}
</div>
