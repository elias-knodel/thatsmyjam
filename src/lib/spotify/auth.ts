import { PUBLIC_DOMAIN, PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { base } from '$app/paths';

const redirectUri = PUBLIC_DOMAIN + `${base}/callback`;

export async function getRefreshToken(refreshToken: string) {
	// refresh token that has been previously stored
	const url = 'https://accounts.spotify.com/api/token';

	const payload = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: <string>refreshToken,
			client_id: <string>PUBLIC_SPOTIFY_CLIENT_ID
		})
	};

	const body = await fetch(url, payload);

	return await body.json();
}