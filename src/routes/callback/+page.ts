import type { PageLoad } from '../$types';

export const ssr = false;

export const load: PageLoad = async ({ url }) => {
	const code = url.searchParams.get('code');

	return {
		code: code
	};
};
