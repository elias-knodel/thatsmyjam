import { fetchUserTopItems } from '$lib/spotify/api';
import type { Track } from '$lib/spotify/typings';
import { SvelteSet } from 'svelte/reactivity';

export async function getAndFilterTopItems(seenAlbum: SvelteSet<string>, page: number) {
    let items = await fetchUserTopItems(page);

    const filteredItems = [];
    for (let i = 0; i < items.items.length; i++)  {
        const localItem = filterItems(items.items[i], seenAlbum);

        if (localItem) filteredItems.push(localItem);
    }

    return filteredItems;
}

function filterItems(item: Track, seenAlbum: SvelteSet<string>) {
    if (seenAlbum.has(item.album.name) || seenAlbum.has(item.artists[0].name)) {
        return null;
    } else {
        seenAlbum.add(item.album.name);
        seenAlbum.add(item.artists[0].name);
        return item;
    }
}

async function getFilteredTopItemsState() {
    const filteredItems = [];

    let page = 1;
    while (filteredItems.length < 9) {
        const newItems = await getAndFilterTopItems(seenAlbumState, page);

        filteredItems.push(...newItems);

        page++;
    }

    return filteredItems;
}

export let seenAlbumState: SvelteSet<string> = $state(new SvelteSet());

export let originalTopItems = $state(await getFilteredTopItemsState());

export function filteredTopItems() {
    return originalTopItems.slice(0, 9);
}
