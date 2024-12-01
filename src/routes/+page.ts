import { fetchProfile, fetchUserTopItems } from '$lib/spotify/api';
import type { PageLoad } from './$types';

export const ssr = false;

async function getAndFilterTopItems(seenAlbum, page: number) {
	let items = await fetchUserTopItems(page);

	return items.items.filter(filterItems, seenAlbum);
}

function filterItems(item) {
	if (!item?.album?.name) {
		return true;
	}

	if (this.has(item.album.name)) {
		return false;
	} else {
		this.add(item.album.name);
		return true;
	}
}

export async function load() {
	const seenAlbum = new Set();

	const filteredItems = [];

	let page = 1;
	while (filteredItems.length < 9) {
		const newItems = await getAndFilterTopItems(seenAlbum, page);

		filteredItems.push(...newItems);

		page++;
	}

	const slicedItems = filteredItems.slice(0, 9);

	return {
		profile: await fetchProfile(),
		topItems: slicedItems
	};
}
