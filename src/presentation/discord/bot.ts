import 'dotenv/config';
import {
	Client,
	GatewayIntentBits,
	Collection,
	Events,
	ActivityType
} from 'discord.js';
import { container } from '../../container';
import type { BotCommand } from '../../shared/types';
import * as commands from './commands';

declare module 'discord.js' {
	interface Client {
		commands: Collection<string, BotCommand>;
	}
}

/**
 * Clase principal del Bot de Discord
 */
export class DiscordBot {
	private client: Client;

	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent
			]
		});

		this.client.commands = new Collection<string, BotCommand>();
		this.setupCommands();
		this.setupEventListeners();
	}

	/**
	 * Registra los comandos del bot
	 */
	private setupCommands(): void {
		const commandList: BotCommand[] = [
			commands.startCommand,
			commands.guessCommand,
			commands.hintCommand,
			commands.giveupCommand,
			commands.settingsCommand,
			commands.buildCommand,
			commands.pingCommand
		];

		commandList.forEach((command) => {
			this.client.commands.set(command.data.name, command);
			console.log(`📝 Comando cargado: /${command.data.name}`);
		});
	}

	/**
	 * Configura los event listeners
	 */
	private setupEventListeners(): void {
		this.client.once(Events.ClientReady, (readyClient) => {
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

			// Limpieza de sesiones antiguas cada hora
			setInterval(() => {
				const cleaned = container.gameSessionRepository.cleanupOldSessions(24);
				if (cleaned > 0) {
					console.log(`🧹 Limpiadas ${cleaned} sesiones antiguas`);
				}
			}, 60 * 60 * 1000);

			// Mostrar estadísticas
			try {
				const stats = container.gameSessionRepository.getGlobalStats();
				console.log(`📈 Estadísticas del bot:`);
				console.log(`   • Sesiones activas: ${stats.activeSessions}`);
				console.log(`   • Canales con sesiones: ${stats.totalChannels.length}`);
				console.log(`   • Promedio de adivinanzas: ${stats.averageGuesses.toFixed(1)}`);
			} catch (error) {
				console.log('📊 Estadísticas no disponibles aún');
			}

			console.log('✅ Bot completamente inicializado y listo para usar');
		});

		this.client.on(Events.InteractionCreate, async (interaction) => {
			// Handle autocomplete interactions
			if (interaction.isAutocomplete()) {
				const command = this.client.commands.get(interaction.commandName);
				if (!command || !command.autocomplete) {
					return;
				}

				try {
					await command.autocomplete(interaction);
				} catch (error) {
					console.error(`❌ Error in autocomplete for /${interaction.commandName}:`, error);
				}
				return;
			}

			// Handle command interactions
			if (!interaction.isChatInputCommand()) return;

			const command = this.client.commands.get(interaction.commandName);
			if (!command) {
				console.warn(`⚠️ Comando no encontrado: ${interaction.commandName}`);
				return;
			}

			try {
				console.log(
					`🎮 Ejecutando comando: /${interaction.commandName} por ${interaction.user.tag} en ${interaction.guild?.name || 'DM'}`
				);

				await command.execute(interaction);

				console.log(`✅ Comando /${interaction.commandName} ejecutado exitosamente`);
			} catch (error) {
				console.error(`❌ Error ejecutando comando /${interaction.commandName}:`, error);

				const errorMessage = {
					content: '❌ Hubo un error al ejecutar este comando.',
					ephemeral: true
				};

				if (interaction.replied || interaction.deferred) {
					await interaction.followUp(errorMessage);
				} else {
					await interaction.reply(errorMessage);
				}
			}
		});
	}

	/**
	 * Inicia el bot
	 */
	async start(): Promise<void> {
		const token = process.env.DISCORD_TOKEN;

		if (!token) {
			console.error('❌ DISCORD_TOKEN no encontrado en las variables de entorno.');
			console.error('💡 Asegúrate de tener un archivo .env con tu token de Discord.');
			process.exit(1);
		}

		try {
			await this.client.login(token);
		} catch (error) {
			console.error('❌ Error al conectar el bot:', error);
			process.exit(1);
		}
	}

	/**
	 * Detiene el bot
	 */
	async stop(): Promise<void> {
		console.log('🛑 Deteniendo bot...');
		this.client.destroy();
		console.log('✅ Bot detenido');
	}
}
