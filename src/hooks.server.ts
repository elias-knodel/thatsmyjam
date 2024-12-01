import type { Handle } from '@sveltejs/kit';
import { i18n } from '$lib/i18n';
import { sequence } from '@sveltejs/kit/hooks';

const langHandle: Handle = i18n.handle();

export const handle: Handle = sequence(langHandle);
