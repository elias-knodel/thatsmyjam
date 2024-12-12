import { userState } from '$lib/auth/user.svelte';
import { SvelteDate } from 'svelte/reactivity';
import { getRefreshToken } from './auth-tokens';

export async function fetchWithAuth(url: string, options = {}) {
	if (!userState.data.expiresAt || userState.data.expiresAt < new SvelteDate()) {
		console.log('requesting new access and refresh token');

		if (!userState.data.refreshToken) {
			userState.logOut();
		}

		const response = await getRefreshToken(userState.data.refreshToken!);

		let expires_at = new SvelteDate();
		expires_at.setTime(expires_at.getTime() + 3600 * 1000);

		userState.data.expiresAt = expires_at;
		userState.data.accessToken = response.access_token;
		userState.data.refreshToken = response.refresh_token;
		userState.data.loggedIn = true;
	}

	const result = await fetch(url, {
		method: 'GET',
		headers: { Authorization: `Bearer ${userState.data.accessToken}` }
	});

	return result;
}
