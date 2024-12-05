import { fetchUserTopItems } from '$lib/spotify/api';
import type { Track } from '$lib/spotify/typings';
import { untrack } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';

let pageState = $state(1);

export const topItemsPage = {
    get count() {
        return pageState;
    },

    set count(v: number) {
        pageState = v;
    },

    increment() {
        pageState++;
        return pageState;
    },

    reset() {
        pageState = 1;
    }
}
 
let seenAlbumState: SvelteSet<string> = $state(new SvelteSet());

let topItemsTimeRangeState = $state("short_term");

export const topItemsTimeRange = {
    get range() {
        return topItemsTimeRangeState;
    },

    set range(v: string) {
        topItemsTimeRangeState = v;
    },

    reset() {
        topItemsTimeRangeState = "short_term";
    },

    get default() {
        return "short_term";
    }
}

let originalTopItemsState = $state(await getFilteredTopItemsState());

export const originalTopItems = {
    get items() {
        return originalTopItemsState;
    },

    set items(v: Track[]) {
        originalTopItemsState = v;
    },

    push (v: Track[]) {
        originalTopItemsState.push(...v);
    },

    reset () {
        originalTopItemsState = [];
    }
}

async function getAndFilterTopItems(seenAlbum: SvelteSet<string>, page: number) {
    let items = await fetchUserTopItems(page, topItemsTimeRange.range);

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

export function filteredTopItems() {
    return originalTopItems.items.slice(0, 9);
}

export async function fetchTopTrackItems () {
    while (originalTopItems.items.length < 15) {
        const page = untrack(() => ++pageState);
        const newItems = await getAndFilterTopItems(seenAlbumState, page);

        originalTopItems.push(newItems);
    }
};

export function removeItem(index: number) {
    let switchedItem = originalTopItems.items.at(9);

    originalTopItems.items.splice(9, 1);

    if (switchedItem) {
        originalTopItems.items.splice(index, 1, switchedItem);
    } else {
        originalTopItems.items.splice(index, 1);
    }

    return null;
}