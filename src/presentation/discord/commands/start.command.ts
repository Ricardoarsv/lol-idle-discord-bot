import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { container } from '../../../container';
import { GameEmbedBuilder } from '../builders/game-embed.builder';
import { API_URLS } from '../../../shared/constants';
import type { BotCommand } from '../../../shared/types';

/**
 * Comando /start - Inicia una nueva partida
 */
export const startCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Inicia un nuevo juego de adivinanza de campeones de League of Legends')
		.setDescriptionLocalizations({
			'es-ES': 'Inicia un nuevo juego de adivinanza de campeones de League of Legends',
			'en-US': 'Start a new League of Legends champion guessing game'
		}),

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply();

			const userId = interaction.user.id;
			const channelId = interaction.channelId;

			console.log(`🎮 ${interaction.user.tag} iniciando nuevo juego`);

			// Ejecutar caso de uso
			const session = await container.startGameUseCase.execute({
				userId,
				channelId,
				isDaily: false
			});

			// Construir embed de respuesta
			const embed = GameEmbedBuilder.buildStartEmbed(
				session,
				interaction.client.user?.displayAvatarURL()
			);

			await interaction.editReply({ embeds: [embed] });

		} catch (error) {
			console.error('Error en comando start:', error);

			const errorEmbed = GameEmbedBuilder.buildErrorEmbed(
				'Error',
				'Ha ocurrido un error al iniciar el juego. Por favor intenta de nuevo.'
			);

			await interaction.editReply({ embeds: [errorEmbed] });
		}
	}
};
