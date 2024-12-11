import { browser } from '$app/environment';
import { getRefreshToken } from '$lib/spotify/auth';
import { getContext, setContext } from 'svelte';
import { SvelteDate } from 'svelte/reactivity';

export interface UserState {
	loggedIn: boolean;
	refreshToken: string | null;
	accessToken: string | null;
	expiresAt: SvelteDate | null;
}

export class User {
	static readonly KEY = 'USER';

	data: UserState = $state({
		loggedIn: false,
		refreshToken: null,
		accessToken: null,
		expiresAt: null
	});

	constructor() {
		if (browser) {
			const item = localStorage.getItem(User.KEY);
			if (item) this.data = this.deserialize(item);
		}

		$effect(() => {
			localStorage.setItem(User.KEY, this.serialize(this.data));
		});

		$inspect('User logged in: ' + this.data.loggedIn);
		// $inspect(this.data.expiresAt);
	}

	serialize(value: UserState): string {
		return JSON.stringify(value);
	}

	deserialize(item: string): UserState {
		return JSON.parse(item);
	}

	validateTime() {
		// When newer, dont do anything
		if (this.data.expiresAt && this.data.expiresAt > new SvelteDate()) {
			return;
		}

		// When older, refresh
		if (this.data.refreshToken) {
			this.refreshTokenState();
		}
	}

	refreshTokenState() {
		getRefreshToken(this.data.refreshToken!).then((response) => {
			let expires_at = new SvelteDate();
			expires_at.setTime(expires_at.getTime() + 3600 * 1000);

			this.data.expiresAt = expires_at;
			this.data.accessToken = response.access_token;
			this.data.refreshToken = response.refresh_token;
			this.data.loggedIn = true;
		});
	}

	logOut() {
		this.data.loggedIn = false;
		this.data.expiresAt = null;
		this.data.accessToken = null;
		this.data.refreshToken = null;

		console.log(this.data);
	}
}

const USER_KEY = Symbol(User.KEY);

export function setUserStateContext() {
	const user = new User();

	user.validateTime();

	return setContext(USER_KEY, user);
}

export function getUserStateContext() {
	return getContext<ReturnType<typeof setUserStateContext>>(USER_KEY);
}
