import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import * as commands from './presentation/discord/commands';

/**
 * Script para registrar comandos slash en Discord
 */
async function registerCommands() {
	const token = process.env.DISCORD_TOKEN;
	const clientId = process.env.DISCORD_APP_ID;

	if (!token) {
		console.error('❌ DISCORD_TOKEN no encontrado en las variables de entorno.');
		process.exit(1);
	}

	if (!clientId) {
		console.error('❌ CLIENT_ID no encontrado en las variables de entorno.');
		process.exit(1);
	}

	const commandList = [
		commands.startCommand,
		commands.guessCommand,
		commands.hintCommand,
		commands.giveupCommand,
		commands.settingsCommand,
		commands.buildCommand,
		commands.pingCommand
	];

	const commandsData = commandList.map(command => command.data.toJSON());

	const rest = new REST({ version: '10' }).setToken(token);

	try {
		console.log(`🔄 Registrando ${commandsData.length} comandos...`);

		const data = await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commandsData }
		) as any[];

		console.log(`✅ ${data.length} comandos registrados exitosamente:`);
		data.forEach((cmd: any) => {
			console.log(`   • /${cmd.name}`);
		});
	} catch (error) {
		console.error('❌ Error al registrar comandos:', error);
		process.exit(1);
	}
}

registerCommands();
