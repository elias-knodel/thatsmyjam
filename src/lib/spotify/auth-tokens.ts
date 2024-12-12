import { base } from '$app/paths';
import { PUBLIC_DOMAIN, PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { generateCodeChallenge, generateCodeVerifier } from './pkce-utils';

const redirectUri = PUBLIC_DOMAIN + `${base}/callback`;

export async function redirectToAuthCodeFlow() {
	const verifier = generateCodeVerifier(128);
	const challenge = await generateCodeChallenge(verifier);

	localStorage.setItem('verifier', verifier);

	const params = new URLSearchParams();
	params.append('client_id', PUBLIC_SPOTIFY_CLIENT_ID);
	params.append('response_type', 'code');
	params.append('redirect_uri', redirectUri);
	params.append('scope', 'user-top-read');
	params.append('code_challenge_method', 'S256');
	params.append('code_challenge', challenge);

	document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code: string): Promise<any> {
	const verifier = localStorage.getItem('verifier');

	const params = new URLSearchParams();
	params.append('client_id', PUBLIC_SPOTIFY_CLIENT_ID);
	params.append('grant_type', 'authorization_code');
	params.append('code', code);
	params.append('redirect_uri', redirectUri);
	params.append('code_verifier', verifier!);

	const result = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	});

	return await result.json();
}

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
