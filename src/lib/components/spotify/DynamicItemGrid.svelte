<script lang="ts">
	import { fade } from 'svelte/transition';
	import { uppercased } from '$lib/utils';
	import { cubicInOut } from 'svelte/easing';
	import * as m from '$lib/paraglide/messages.js';
	import { TopTrackItems } from './TopTrackItems.svelte';
	import { untrack } from 'svelte';
	import { flip } from 'svelte/animate';
	import * as htmlToImage from 'html-to-image';

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

	function downloadGridImage() {
		console.log('click received');

		const node = document.getElementById('spotify-top-items-grid');

		htmlToImage.toPng(node!).then(function (dataUrl) {
			// Create download button
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = dataUrl;

			// Filename
			a.download = 'thatsmyjam-spotify3x3.png';
			document.body.appendChild(a);
			a.click();

			window.URL.revokeObjectURL(dataUrl);
		});
	}
</script>

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

<button
	class="mb-2 me-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
	onclick={downloadGridImage}
>
	Download as image
</button>

<br />
<br />

{#await topTrackItemsState.filtered()}
	<span>Loading...</span>
{:then topItems}
	<div id="spotify-top-items-grid" class="grid max-w-[384px] sm:max-w-[864px] grid-cols-3">
		{#each topItems as item, index (item.id)}
			<section
				onclick={() => topTrackItemsState.removeItem(index)}
				in:fade={{ duration: 700, easing: cubicInOut }}
				out:fade={{ duration: 0, delay: 0 }}
				aria-hidden="true"
				class="relative isolate flex sm:h-72 sm:w-72 w-32 flex-col justify-end overflow-hidden sm:px-4 sm:pb-6 sm:pt-36 pt-32"
			>
				<img
					class="absolute inset-0 h-full w-full object-cover"
					alt="Album cover"
					src={item?.album.images[0].url}
				/>

				<div class="sm:absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
				<h3 class="hidden sm:block z-10 text-2xl font-bold text-white">{item?.name}</h3>
				<div class="hidden sm:block z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
					{uppercased(item?.album.album_type)}: {item?.album.name}
				</div>
				<div class="hidden sm:block z-10 gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
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
		<div class="grid max-w-[384px] sm:max-w-[864px] grid-cols-3 sm:grid-cols-4 gap-10 sm:gap-x-40">
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
