<script lang="ts">
	import { fade } from 'svelte/transition';
	import { uppercased } from '$lib/utils';
	import {
		originalTopItems,
		filteredTopItems,
		seenAlbumState,
		getAndFilterTopItems
	} from './ItemGridHelper.svelte';
	import { cubicInOut, cubicOut } from 'svelte/easing';
	import { untrack } from 'svelte';

	let pageState = $state(1);

	function removeItem(index: number) {
		let switchedItem = originalTopItems.at(9);

		originalTopItems.splice(9, 1);

		if (switchedItem) {
			originalTopItems.splice(index, 1, switchedItem);
		} else {
			originalTopItems.splice(index, 1);
		}

		return null;
	}

	$effect(() => {
		const fetchItems = async () => {
			while (originalTopItems.length < 15) {
				const page = untrack(() => ++pageState);
				const newItems = await getAndFilterTopItems(seenAlbumState, page);

				originalTopItems.push(...newItems);
			}
		};

		fetchItems();
	});
</script>

{#await filteredTopItems()}
	<span>Loading...</span>
{:then topItems}
	<br />

	<h1 class="text-xl">Your Jam (short_term):</h1>

	<br />

	<div class="grid max-w-[864px] grid-cols-3">
		{#each topItems as item, index (item.id)}
			<section
				onclick={() => removeItem(index)}
				in:fade={{ duration: 1000, easing: cubicInOut }}
				out:fade={{ duration: 0, delay: 0, }}
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
