/**
 * Punto de entrada principal de la aplicación
 * Usa Clean Architecture
 */

import { DiscordBot } from './presentation/discord/bot';
import { config } from 'dotenv';

config({
	path: '.env'
});

async function main() {
	console.log('🚀 Initializing Discord Bot..');
	
	const bot = new DiscordBot();
	await bot.start();

	// Manejar señales de terminación
	process.on('SIGINT', async () => {
		await bot.stop();
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		await bot.stop();
		process.exit(0);
	});
}

main().catch((error) => {
	console.error('❌ Error fatal:', error);
	process.exit(1);
});
