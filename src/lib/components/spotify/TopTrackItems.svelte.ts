import { fetchUserTopItems } from '$lib/spotify/api';
import type { Track } from '$lib/spotify/typings';

export class TopTrackItems {
	#topItems: Track[] = $state([]);

	locked: boolean = $state(false);

	page: number = 1;
	filter: Set<string> = new Set();

	error: number = 5;

	timeSpan = 'short_term';

	constructor() {
		$effect.root(() => {
			// $inspect(this.#topItems.length);

			$effect(() => {
				this.fetchItemsWhenBelowThreshhold();
			});
		});
	}

	/**
	 * Will get executed by an effect when this.topItems.length or this.locked changes
	 */
	fetchItemsWhenBelowThreshhold() {
		while (this.#topItems.length < 13 && !this.locked && this.error > 1) {
			this.error = this.error - 1;

			this.locked = true;
			this.fetchItemsWithFilter()
				.then((items) => {
					this.#topItems.push(...items);
					this.error = this.error + 1;
				})
				.finally(() => {
					++this.page;
					this.locked = false;
				})
				.catch((errorMsg) => {
					this.error = 1;
				});
		}
	}

	setTimeSpan(v: string) {
		if (v === this.timeSpan) {
			return;
		}

		this.page = 1;
		this.filter.clear();
		this.timeSpan = v;

		this.locked = false;
		this.#topItems = [];
	}

	get read() {
		return this.#topItems;
	}

	set write(v: Track[]) {
		this.#topItems = v;
	}

	removeItem(index: number) {
		if (this.#topItems.length <= 9) {
			return;
		}

		let nextItem = this.#topItems.at(9);

		this.#topItems.splice(9, 1);

		if (nextItem) {
			this.#topItems.splice(index, 1, nextItem);
		}
	}

	async fetchItemsWithFilter() {
		const newTopItems = (await fetchUserTopItems(this.page, this.timeSpan)).items;

		if (newTopItems === undefined) {
			this.error = 1;
			throw new Error('Fetch failed, please login again.');
		}

		const tmpArray = [];
		for (let i = 0; i < newTopItems.length; i++) {
			const localItem = newTopItems[i];

			if (this.filter.has(localItem.album.name)) {
				continue;
			}
			this.filter.add(localItem.album.name);

			if (this.filter.has(localItem.artists[0].name)) {
				continue;
			}
			this.filter.add(localItem.artists[0].name);

			tmpArray.push(localItem);
		}

		return tmpArray;
	}

	filtered() {
		return this.#topItems.slice(0, 9);
	}

	next() {
		let maxIndex = 13 > this.#topItems.length ? this.#topItems.length : 13;

		return this.#topItems.slice(9, maxIndex);
	}
}
