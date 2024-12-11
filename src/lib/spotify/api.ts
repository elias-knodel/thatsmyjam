import { getUserStateContext, User, type UserState } from '$lib/auth/user.svelte';
import { getRefreshToken } from './auth';
import type { Paging, PrivateUser, Track } from './typings';

async function fetchWithAuth(url: string, options = {}) {
	const user: UserState = JSON.parse(localStorage.getItem(User.KEY));

	// const verifier = localStorage.getItem('verifier');
	let token = user.accessToken;
	// const refreshToken = localStorage.getItem('refresh_token')

	// If there is no access token or there is no refresh token, get a new one
	// if (!refreshToken || !verifier) {
	//     redirectToAuthCodeFlow();
	// }

	// if (!token) {
	//     getRefreshToken()
	// }

	// if (!user.expiresAt || user.expiresAt < new Date()) {
	// 	console.log('requesting new access and refresh token');
	// 	getRefreshToken(user.refreshToken);
	// 	token = localStorage.getItem('access_token');
	// }

	const result = await fetch(url, {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` }
	});

	return result;
}

export async function fetchProfile(): Promise<PrivateUser> {
	const result = await fetchWithAuth('https://api.spotify.com/v1/me');

	return await result.json();
}

export async function fetchUserTopItems(
	page: number = 1,
	timeRange: string
): Promise<Paging<Track>> {
	const limit = 15;

	page = page - 1;

	const urlParameters = new URLSearchParams({
		type: 'tracks',
		time_range: timeRange,
		limit: limit.toString(),
		offset: (page * limit).toString()
	});

	const url = 'https://api.spotify.com/v1/me/top/tracks?' + urlParameters;

	const result = await fetchWithAuth(url);

	return await result.json();
}
