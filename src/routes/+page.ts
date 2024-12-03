import { fetchProfile, fetchUserTopItems } from '$lib/spotify/api';

export const ssr = false;

export async function load() {
	return {
		profile: fetchProfile()
	};
}
