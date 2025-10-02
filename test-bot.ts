import 'dotenv/config';
import { getChampionIndex, getChampionDetail } from './src/data/ddragon';
import { normalizeName, matchesChampion } from './src/data/normalize';
import { getTranslation } from './src/util/translations';
import { getLatestVersion } from './src/util/version-manager';
import { getUserConfig } from './src/game/user-config';
import { LANGUAGE_CODES } from './src/util/enums';
import type { LanguageCodes } from './src/util/enums';

async function testBot(): Promise<void> {
	console.log('🧪 Iniciando pruebas del bot...\n');

	try {
		console.log('0️⃣ Probando gestión automática de versiones...');
		const version = await getLatestVersion();
		console.log(`✅ Versión más reciente: ${version}`);

		console.log('\n1️⃣ Probando carga de campeones...');
		const champions = await getChampionIndex(version, 'es_ES');
		console.log(`✅ Cargados ${champions.length} campeones en español`);

		console.log('\n2️⃣ Probando sistema de configuración de usuario...');
		const testUserId = 'test-user-123';
		const userConfig = getUserConfig(testUserId);
		console.log(
			`✅ Configuración de usuario: idioma=${userConfig.language}, locale=${userConfig.locale}, dificultad=${userConfig.difficulty}`
		);

		console.log('\n3️⃣ Probando sistema de traducciones...');
		const spanishText = getTranslation(LANGUAGE_CODES.ES as LanguageCodes, 'game.gameStarted');
		const englishText = getTranslation(LANGUAGE_CODES.EN as LanguageCodes, 'game.gameStarted');
		console.log(`✅ Español: ${spanishText}`);
		console.log(`✅ English: ${englishText}`);

		console.log('\n4️⃣ Probando selección de campeón aleatorio...');
		const randomChampion = champions[Math.floor(Math.random() * champions.length)];
		console.log(`✅ Campeón seleccionado: ${randomChampion?.name}`);

		if (randomChampion) {
			console.log('\n5️⃣ Probando obtención de detalles...');
			const champion = await getChampionDetail(randomChampion.id, version, 'es_ES');
			if (champion) {
				console.log(`✅ Detalles obtenidos para: ${champion.name}`);
			}
		}

		console.log('\n6️⃣ Probando normalización de nombres...');
		const testNames = ['Kai\'Sa', 'kaisa', 'KAISA', 'kai sa'];
		testNames.forEach(name => {
			const normalized = normalizeName(name);
			const matches = matchesChampion(name, 'Kai\'Sa');
			console.log(`   "${name}" → "${normalized}" (coincide: ${matches})`);
		});

		console.log('\n✅ Todas las pruebas completadas exitosamente!');

	} catch (error) {
		console.error('❌ Error durante las pruebas:', error);
		if (error instanceof Error) {
			console.error('   Mensaje:', error.message);
			console.error('   Stack:', error.stack);
		}
	}
}

testBot();