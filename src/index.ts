import 'dotenv/config';
import {
	Client,
	GatewayIntentBits,
	Collection,
	Events,
	ActivityType,
	ClientUser
} from 'discord.js';
import { cleanupOldSessions, getGlobalStats } from './game/index';
import type { BotCommand } from './types/index';

import startCommand from './commands/start';
import guessCommand from './commands/guess';
import hintCommand from './commands/hint';
import giveupCommand from './commands/giveup';
import settingsCommand from './commands/settings';

declare module 'discord.js' {
	interface Client {
		commands: Collection<string, BotCommand>;
	}
}

if (!process.env.DISCORD_TOKEN) {
	console.error('❌ DISCORD_TOKEN no encontrado en las variables de entorno.');
	console.error('💡 Asegúrate de tener un archivo .env con tu token de Discord.');
	process.exit(1);
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	]
});

client.commands = new Collection<string, BotCommand>();
const commands: BotCommand[] = [
	startCommand,
	guessCommand,
	hintCommand,
	giveupCommand,
	settingsCommand
];


commands.forEach((command) => {
	client.commands.set(command.data.name, command);
	console.log(`📝 Comando cargado: /${command.data.name}`);
});

client.once(Events.ClientReady, (readyClient: Client<true>) => {
	console.log('🎉 ¡Bot conectado exitosamente!');
	console.log(`👤 Conectado como: ${readyClient.user.tag}`);
	console.log(`🌐 Conectado a ${readyClient.guilds.cache.size} servidor(es)`);

	readyClient.user.setPresence({
		activities: [
			{
				name: '¿Qué campeón es? | /start para jugar',
				type: ActivityType.Playing
			}
		],
		status: 'online'
	});

	setInterval(() => {
		const cleaned = cleanupOldSessions(24);
		if (cleaned > 0) {
			console.log(`🧹 Limpiadas ${cleaned} sesiones antiguas`);
		}
	}, 60 * 60 * 1000);

	try {
		const stats = getGlobalStats();
		console.log(`📈 Estadísticas del bot:`);
		console.log(`   • Sesiones activas: ${stats.activeSessions}`);
		console.log(`   • Canales con sesiones: ${stats.totalChannels.length}`);
		console.log(`   • Promedio de adivinanzas: ${stats.averageGuesses.toFixed(1)}`);
	} catch (error) {
		console.log('📊 Estadísticas no disponibles aún');
	}

	console.log('✅ Bot completamente inicializado y listo para usar');
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) {
		console.warn(`⚠️ Comando no encontrado: ${interaction.commandName}`);
		return;
	}

	try {
		console.log(
			`🎮 Ejecutando comando: /${interaction.commandName} por ${interaction.user.tag} en ${interaction.guild?.name || 'DM'}`
		);

		await command.execute(interaction);

	} catch (error) {
		console.error(`❌ Error ejecutando comando /${interaction.commandName}:`, error);

		const errorResponse = {
			content: '❌ Hubo un error ejecutando este comando. Inténtalo de nuevo.',
			ephemeral: true
		};

		try {
			if (interaction.replied) {
				await interaction.followUp(errorResponse);
			} else if (interaction.deferred) {
				await interaction.editReply(errorResponse);
			} else {
				await interaction.reply(errorResponse);
			}
		} catch (replyError) {
			console.error('❌ Error enviando respuesta de error:', replyError);
		}
	}
});

client.on(Events.Error, (error) => {
	console.error('❌ Error del cliente Discord:', error);
});

client.on(Events.Warn, (warning) => {
	console.warn('⚠️ Warning del cliente Discord:', warning);
});

if (process.env.NODE_ENV === 'development') {
	client.on(Events.Debug, (debug) => {
		console.debug('🔍 Debug:', debug);
	});
}

process.on('unhandledRejection', (error) => {
	console.error('❌ Unhandled promise rejection:', error);
});

process.on('uncaughtException', (error) => {
	console.error('❌ Uncaught exception:', error);
	process.exit(1);
});


process.on('SIGINT', async () => {
	console.log('🛑 Recibida señal SIGINT, cerrando bot...');
	
	try {
		
		const stats = getGlobalStats();
		console.log(`📊 Estadísticas finales:`);
		console.log(`   • Sesiones activas: ${stats.activeSessions}`);
		console.log(`   • Canales con sesiones: ${stats.totalChannels.length}`);
		
		await client.destroy();
		console.log('✅ Bot cerrado correctamente');
		process.exit(0);
	} catch (error) {
		console.error('❌ Error cerrando el bot:', error);
		process.exit(1);
	}
});

process.on('SIGTERM', async () => {
	console.log('🛑 Recibida señal SIGTERM, cerrando bot...');
	await client.destroy();
	process.exit(0);
});


console.log('🚀 Iniciando bot...');
client.login(process.env.DISCORD_TOKEN);