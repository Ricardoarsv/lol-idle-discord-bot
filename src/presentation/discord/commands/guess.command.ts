import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { container } from '../../../container';
import { GameEmbedBuilder } from '../builders/game-embed.builder';
import { API_URLS } from '../../../shared/constants';
import { GameSessionNotFoundError } from '../../../shared/errors';
import type { BotCommand } from '../../../shared/types';

/**
 * Comando /guess - Adivina el campeón
 */
export const guessCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('guess')
		.setDescription('Guess the champion')
		.setDescriptionLocalizations({
			'es-ES': 'Intenta adivinar el campeón',
			'en-US': 'Guess the champion'
		})
		.addStringOption((option) =>
			option
				.setName('name')
				.setNameLocalizations({
					'es-ES': 'nombre'
				})
				.setDescription('Name of the champion you think it is')
				.setDescriptionLocalizations({
					'es-ES': 'Nombre del campeón que crees que es'
				})
				.setRequired(true)
		) as SlashCommandBuilder,

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply();

			const guess = interaction.options.getString('name', true).trim();
			const channelId = interaction.channelId;

			console.log(`🤔 Adivinanza recibida: ${guess}`);

			// Ejecutar caso de uso
			const result = container.makeGuessUseCase.execute({
				channelId,
				guess
			});

			// Construir URL de splash
			const splashUrl = `${API_URLS.SPLASH_ART}`
				.replace('{champion}', result.session.targetChampion.id)
				.replace('{skin}', '0');

			// Construir embed según el resultado
			let embed;

			if (result.isCorrect) {
				// Ganó
				embed = GameEmbedBuilder.buildWinEmbed(
					result.session,
					splashUrl,
					interaction.client.user?.displayAvatarURL()
				);
			} else if (result.isGameOver) {
				// Perdió (se acabaron los intentos)
				embed = GameEmbedBuilder.buildGameOverEmbed(result.session, splashUrl);
			} else {
				// Incorrecto pero sigue el juego
				embed = GameEmbedBuilder.buildWrongEmbed(result.session, guess);
			}

			await interaction.editReply({ embeds: [embed] });

		} catch (error) {
			console.error('Error en comando guess:', error);

			if (error instanceof GameSessionNotFoundError) {
				const embed = GameEmbedBuilder.buildNoActiveGameEmbed();
				await interaction.editReply({ embeds: [embed] });
				return;
			}

			const errorEmbed = GameEmbedBuilder.buildErrorEmbed(
				'Error',
				'Ha ocurrido un error al procesar tu adivinanza. Por favor intenta de nuevo.'
			);

			await interaction.editReply({ embeds: [errorEmbed] });
		}
	}
};
