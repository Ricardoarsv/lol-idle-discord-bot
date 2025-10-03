import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { container } from '../../../container';
import { GameEmbedBuilder } from '../builders/game-embed.builder';
import { GameSessionNotFoundError } from '../../../shared/errors';
import type { BotCommand } from '../../../shared/types';

/**
 * Comando /hint - Obtiene una pista
 */
export const hintCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('hint')
		.setDescription('Get a hint about the champion')
		.setDescriptionLocalizations({
			'es-ES': 'Obtén una pista sobre el campeón',
			'en-US': 'Get a hint about the champion'
		}),

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply();

			const channelId = interaction.channelId;

			console.log(`💡 Pista solicitada`);

			// Ejecutar caso de uso
			const result = container.getHintUseCase.execute({
				channelId
			});

			// Construir embed de pista
			const embed = GameEmbedBuilder.buildHintEmbed(
				result.session,
				result.hint,
				result.hintType
			);

			await interaction.editReply({ embeds: [embed] });

		} catch (error) {
			console.error('Error en comando hint:', error);

			if (error instanceof GameSessionNotFoundError) {
				const embed = GameEmbedBuilder.buildNoActiveGameEmbed();
				await interaction.editReply({ embeds: [embed] });
				return;
			}

			if (error instanceof Error && error.message === 'No more hints available') {
				const embed = GameEmbedBuilder.buildErrorEmbed(
					'Sin pistas',
					'Ya has usado todas las pistas disponibles. ¡Intenta adivinar con la información que tienes!'
				);
				await interaction.editReply({ embeds: [embed] });
				return;
			}

			const errorEmbed = GameEmbedBuilder.buildErrorEmbed(
				'Error',
				'Ha ocurrido un error al obtener la pista. Por favor intenta de nuevo.'
			);

			await interaction.editReply({ embeds: [errorEmbed] });
		}
	}
};
