import { SlashCommandBuilder, EmbedBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { container } from '../../../container';
import { Language, DifficultyLevel } from '../../../shared/enums';
import type { BotCommand } from '../../../shared/types';

/**
 * Comando /settings - Configura las preferencias del usuario
 */
export const settingsCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Configure your preferences')
		.setDescriptionLocalizations({
			'es-ES': 'Configura tus preferencias',
			'en-US': 'Configure your preferences'
		})
		.addStringOption(option =>
			option
				.setName('language')
				.setNameLocalizations({ 'es-ES': 'idioma' })
				.setDescription('Change language')
				.setDescriptionLocalizations({ 'es-ES': 'Cambiar idioma' })
				.addChoices(
					{ name: 'Español', value: Language.ES },
					{ name: 'English', value: Language.EN }
				)
		)
		.addStringOption(option =>
			option
				.setName('difficulty')
				.setNameLocalizations({ 'es-ES': 'dificultad' })
				.setDescription('Change difficulty')
				.setDescriptionLocalizations({ 'es-ES': 'Cambiar dificultad' })
				.addChoices(
					{ name: 'Fácil', value: DifficultyLevel.EASY },
					{ name: 'Normal', value: DifficultyLevel.NORMAL },
					{ name: 'Difícil', value: DifficultyLevel.HARD },
					{ name: 'Experto', value: DifficultyLevel.EXPERT }
				)
		) as SlashCommandBuilder,

	async execute(interaction: ChatInputCommandInteraction) {
		try {
			await interaction.deferReply();

			const userId = interaction.user.id;
			const language = interaction.options.getString('language') as Language | null;
			const difficulty = interaction.options.getString('difficulty') as DifficultyLevel | null;

			// Si no se proporcionó ninguna opción, mostrar configuración actual
			if (!language && !difficulty) {
				const config = container.userConfigRepository.findByUserId(userId);
				
				const embed = new EmbedBuilder()
					.setColor(0x0099FF)
					.setTitle('⚙️ Tu Configuración Actual')
					.setDescription('Aquí puedes ver tu configuración personal.')
					.addFields([
						{
							name: '🌍 Idioma',
							value: config.language === Language.ES ? 'Español' : 'English',
							inline: true
						},
						{
							name: '⚡ Dificultad',
							value: config.difficulty,
							inline: true
						}
					])
					.setTimestamp();

				await interaction.editReply({ embeds: [embed] });
				return;
			}

			// Actualizar configuración
			const input: any = { userId };
			if (language) input.language = language;
			if (difficulty) input.difficulty = difficulty;
			
			const updatedConfig = container.updateUserConfigUseCase.execute(input);

			const embed = new EmbedBuilder()
				.setColor(0x00FF00)
				.setTitle('✅ Configuración Actualizada')
				.setDescription('Tu configuración ha sido actualizada correctamente.')
				.addFields([
					{
						name: '🌍 Idioma',
						value: updatedConfig.language === Language.ES ? 'Español' : 'English',
						inline: true
					},
					{
						name: '⚡ Dificultad',
						value: updatedConfig.difficulty,
						inline: true
					}
				])
				.setTimestamp();

			await interaction.editReply({ embeds: [embed] });

		} catch (error) {
			console.error('Error en comando settings:', error);

			const errorEmbed = new EmbedBuilder()
				.setColor(0xFF6B6B)
				.setTitle('❌ Error')
				.setDescription('Ha ocurrido un error al actualizar la configuración.')
				.setTimestamp();

			await interaction.editReply({ embeds: [errorEmbed] });
		}
	}
};
