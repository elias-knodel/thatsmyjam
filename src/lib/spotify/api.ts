import { fetchWithAuth } from './fetch';
import type { Paging, PrivateUser, Track } from './typings';

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
