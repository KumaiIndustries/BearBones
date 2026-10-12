import { Preferences } from '@capacitor/preferences';

// Save JSON object/array
export async function saveJSON(key, data) {
	await Preferences.set({
		key: key,
		value: JSON.stringify(data),
	});
}

// Retrieve JSON object/array
export async function loadJSON(key) {
	const { value } = await Preferences.get({ key: key });
	
	if (!value) return null;
	
	try {
		return JSON.parse(value);
	} catch (e) {
		console.error('Failed to parse JSON from storage', e);
		return null;
	}
}

// Remove the item if needed
export async function removeJSON(key) {
	await Preferences.remove({ key: key });
}