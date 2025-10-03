import type { Language } from '../enums';

export interface TranslationVariables {
	[key: string]: string | number;
}

/**
 * Sistema de traducciones simplificado
 * TODO: Migrar todas las traducciones aquí desde util/translations.ts
 */

export function translate(
	language: Language,
	key: string,
	variables?: TranslationVariables
): string {
	// Por ahora retornamos la key para evitar romper el código
	// Se debe migrar la lógica completa del archivo util/translations.ts
	let translation = key;
	
	if (variables) {
		Object.entries(variables).forEach(([varKey, value]) => {
			translation = translation.replace(`{{${varKey}}}`, String(value));
		});
	}
	
	return translation;
}
