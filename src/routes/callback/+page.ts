import { redirect } from '@sveltejs/kit';
import type { PageLoad } from '../$types';
import { getAccessToken, redirectToAuthCodeFlow } from '$lib/spotify/auth';

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		redirectToAuthCodeFlow();
	} else {
		await getAccessToken(code);
	}

	redirect(302, '/');
};
