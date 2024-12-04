import { PUBLIC_SPOTIFY_CLIENT_ID } from '$env/static/public';
import { base } from '$app/paths';

const redirectUri = `${window.location.origin}${base}/callback`;

export async function redirectToAuthCodeFlow() {
	const verifier = generateCodeVerifier(128);
	const challenge = await generateCodeChallenge(verifier);

	localStorage.setItem('verifier', verifier);

	const params = new URLSearchParams();
	params.append('client_id', PUBLIC_SPOTIFY_CLIENT_ID);
	params.append('response_type', 'code');
	params.append('redirect_uri', redirectUri);
	params.append('scope', 'user-top-read user-read-private user-read-email');
	params.append('code_challenge_method', 'S256');
	params.append('code_challenge', challenge);

	document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function getAccessToken(code: string): Promise<string> {
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

	const resultJson = await result.json();

	let expires_at = new Date();
	expires_at.setTime(expires_at.getTime() + 3600 * 1000);

	localStorage.setItem('jwt_expires_at', expires_at.toISOString());
	localStorage.setItem('access_token', resultJson.access_token);

	console.log(resultJson.refresh_token);
	localStorage.setItem('refresh_token', resultJson.refresh_token);

	return resultJson.access_token;
}

export async function getRefreshToken() {
	console.log('refreshing tokens');

	// refresh token that has been previously stored
	const refreshToken = localStorage.getItem('refresh_token');
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
	const response = await body.json();

	console.log(response);

	let expires_at = new Date();
	expires_at.setTime(expires_at.getTime() + 3600 * 1000);

	localStorage.setItem('jwt_expires_at', expires_at.toISOString());

	localStorage.setItem('access_token', response.access_token);
	if (response.refresh_token) {
		localStorage.setItem('refresh_token', response.refresh_token);
	}
}

function generateCodeVerifier(length: number) {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

async function generateCodeChallenge(codeVerifier: string) {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}
