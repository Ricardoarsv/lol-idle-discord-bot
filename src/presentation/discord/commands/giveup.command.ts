import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { container } from '../../../container';
import { GameEmbedBuilder } from '../builders/game-embed.builder';
import { API_URLS } from '../../../shared/constants';
import { GameSessionNotFoundError } from '../../../shared/errors';
import type { BotCommand } from '../../../shared/types';

/**
 * Comando /giveup - Rendirse y ver la respuesta
 */
export const giveupCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('giveup')
		.setDescription('Give up and see the answer')
		.setDescriptionLocalizations({
			'es-ES': 'Rendirse y ver la respuesta',
			'en-US': 'Give up and see the answer'
		}),

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply();

			const channelId = interaction.channelId;

			console.log(`🏳️ Usuario se rinde`);

			// Ejecutar caso de uso
			const result = container.giveUpUseCase.execute({
				channelId
			});

			// Construir URL de splash
			const splashUrl = `${API_URLS.SPLASH_ART}`
				.replace('{champion}', result.session.targetChampion.id)
				.replace('{skin}', '0');

			// Construir embed
			const embed = GameEmbedBuilder.buildGiveUpEmbed(result.session, splashUrl);

			await interaction.editReply({ embeds: [embed] });

		} catch (error) {
			console.error('Error en comando giveup:', error);

			if (error instanceof GameSessionNotFoundError) {
				const embed = GameEmbedBuilder.buildNoActiveGameEmbed();
				await interaction.editReply({ embeds: [embed] });
				return;
			}

			const errorEmbed = GameEmbedBuilder.buildErrorEmbed(
				'Error',
				'Ha ocurrido un error al procesar tu rendición. Por favor intenta de nuevo.'
			);

			await interaction.editReply({ embeds: [errorEmbed] });
		}
	}
};
