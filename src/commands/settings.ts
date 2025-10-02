import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import {
	getUserConfig,
	setUserLanguage,
	setUserDifficulty,
	updateUserConfig
} from '../game/index';
import { translate } from '../util/translations';
import { LANGUAGE_CODES, DIFFICULTY_LEVELS } from '../util/enums';
import type { BotCommand, LanguageCodes, DifficultyLevels } from '../types/index';

const command: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Configure language and game preferences')
		.setDescriptionLocalizations({
			'es-ES': 'Configurar idioma y preferencias del juego',
			'en-US': 'Configure language and game preferences'
		})
		.addSubcommand((subcommand) =>
			subcommand
				.setName('language')
				.setDescription('Change bot language')
				.setDescriptionLocalizations({
					'es-ES': 'Cambiar idioma del bot',
					'en-US': 'Change bot language'
				})
				.addStringOption((option) =>
					option
						.setName('lang')
						.setDescription('Language to use')
						.setDescriptionLocalizations({
							'es-ES': 'Idioma a usar',
							'en-US': 'Language to use'
						})
						.setRequired(true)
						.addChoices(
							{ name: 'Español', value: LANGUAGE_CODES.ES },
							{ name: 'English', value: LANGUAGE_CODES.EN }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('difficulty')
				.setDescription('Change game difficulty')
				.setDescriptionLocalizations({
					'es-ES': 'Cambiar dificultad del juego',
					'en-US': 'Change game difficulty'
				})
				.addStringOption((option) =>
					option
						.setName('level')
						.setDescription('Difficulty level')
						.setDescriptionLocalizations({
							'es-ES': 'Nivel de dificultad',
							'en-US': 'Difficulty level'
						})
						.setRequired(true)
						.addChoices(
							{ name: 'Fácil / Easy', value: DIFFICULTY_LEVELS.EASY },
							{ name: 'Normal', value: DIFFICULTY_LEVELS.NORMAL },
							{ name: 'Difícil / Hard', value: DIFFICULTY_LEVELS.HARD },
							{ name: 'Experto / Expert', value: DIFFICULTY_LEVELS.EXPERT }
						)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('autohints')
				.setDescription('Toggle automatic hints')
				.setDescriptionLocalizations({
					'es-ES': 'Activar/desactivar pistas automáticas',
					'en-US': 'Toggle automatic hints'
				})
				.addBooleanOption((option) =>
					option
						.setName('enabled')
						.setDescription('Enable or disable automatic hints')
						.setDescriptionLocalizations({
							'es-ES': 'Activar o desactivar pistas automáticas',
							'en-US': 'Enable or disable automatic hints'
						})
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('view')
				.setDescription('View current settings')
				.setDescriptionLocalizations({
					'es-ES': 'Ver configuración actual',
					'en-US': 'View current settings'
				})
		) as SlashCommandBuilder,

	async execute(interaction) {
		try {
			await interaction.deferReply();

			const userId = interaction.user.id;
			const subcommand = interaction.options.getSubcommand();

			switch (subcommand) {
				case 'language':
					await handleLanguageCommand(interaction, userId);
					break;
				case 'difficulty':
					await handleDifficultyCommand(interaction, userId);
					break;
				case 'autohints':
					await handleAutoHintsCommand(interaction, userId);
					break;
				case 'view':
					await handleViewCommand(interaction, userId);
					break;
				default:
					await handleViewCommand(interaction, userId);
			}

		} catch (error) {
			console.error('❌ Error en comando settings:', error);

			const userConfig = getUserConfig(interaction.user.id);
			const errorEmbed = new EmbedBuilder()
				.setColor(0xFF6B6B)
				.setTitle(translate(userConfig.language, 'error.title'))
				.setDescription(translate(userConfig.language, 'error.generic'))
				.setTimestamp();

			const replyOptions = { embeds: [errorEmbed], ephemeral: true };

			if (interaction.deferred) {
				await interaction.editReply(replyOptions);
			} else {
				await interaction.reply(replyOptions);
			}
		}
	}
};

/**
 * Maneja el cambio de idioma
 */
async function handleLanguageCommand(interaction: any, userId: string): Promise<void> {
	const newLanguage = interaction.options.getString('lang', true) as LanguageCodes;
	
	try {
		setUserLanguage(userId, newLanguage);
		const userConfig = getUserConfig(userId);

		const successEmbed = new EmbedBuilder()
			.setColor(0x00FF00)
			.setTitle(translate(userConfig.language, 'settings.language.title'))
			.setDescription(translate(userConfig.language, 'settings.language.success', {
				language: translate(userConfig.language, `language.${newLanguage}`)
			}))
			.setTimestamp();

		await interaction.editReply({ embeds: [successEmbed] });

		console.log(`🌐 Usuario ${interaction.user.username} cambió idioma a: ${newLanguage}`);

	} catch (error) {
		console.error('Error al cambiar idioma:', error);
		
		const userConfig = getUserConfig(userId);
		const errorEmbed = new EmbedBuilder()
			.setColor(0xFF6B6B)
			.setTitle(translate(userConfig.language, 'error.title'))
			.setDescription(translate(userConfig.language, 'settings.language.error'))
			.setTimestamp();

		await interaction.editReply({ embeds: [errorEmbed] });
	}
}

/**
 * Maneja el cambio de dificultad
 */
async function handleDifficultyCommand(interaction: any, userId: string): Promise<void> {
	const newDifficulty = interaction.options.getString('level', true) as DifficultyLevels;
	
	try {
		setUserDifficulty(userId, newDifficulty);
		const userConfig = getUserConfig(userId);

		const successEmbed = new EmbedBuilder()
			.setColor(0x00FF00)
			.setTitle(translate(userConfig.language, 'settings.difficulty.title'))
			.setDescription(translate(userConfig.language, 'settings.difficulty.success', {
				difficulty: translate(userConfig.language, `difficulty.${newDifficulty}`)
			}))
			.addFields([{
				name: translate(userConfig.language, 'settings.difficulty.info'),
				value: getDifficultyInfo(newDifficulty, userConfig.language),
				inline: false
			}])
			.setTimestamp();

		await interaction.editReply({ embeds: [successEmbed] });

		console.log(`⚡ Usuario ${interaction.user.username} cambió dificultad a: ${newDifficulty}`);

	} catch (error) {
		console.error('Error al cambiar dificultad:', error);
		
		const userConfig = getUserConfig(userId);
		const errorEmbed = new EmbedBuilder()
			.setColor(0xFF6B6B)
			.setTitle(translate(userConfig.language, 'error.title'))
			.setDescription(translate(userConfig.language, 'settings.difficulty.error'))
			.setTimestamp();

		await interaction.editReply({ embeds: [errorEmbed] });
	}
}

/**
 * Maneja la configuración de pistas automáticas
 */
async function handleAutoHintsCommand(interaction: any, userId: string): Promise<void> {
	const enabled = interaction.options.getBoolean('enabled', true);
	
	try {
		updateUserConfig(userId, { autoHints: enabled });
		const userConfig = getUserConfig(userId);

		const successEmbed = new EmbedBuilder()
			.setColor(0x00FF00)
			.setTitle(translate(userConfig.language, 'settings.autohints.title'))
			.setDescription(translate(userConfig.language, enabled ? 'settings.autohints.enabled' : 'settings.autohints.disabled'))
			.setTimestamp();

		await interaction.editReply({ embeds: [successEmbed] });

		console.log(`💡 Usuario ${interaction.user.username} ${enabled ? 'activó' : 'desactivó'} pistas automáticas`);

	} catch (error) {
		console.error('Error al cambiar configuración de pistas automáticas:', error);
		
		const userConfig = getUserConfig(userId);
		const errorEmbed = new EmbedBuilder()
			.setColor(0xFF6B6B)
			.setTitle(translate(userConfig.language, 'error.title'))
			.setDescription(translate(userConfig.language, 'settings.autohints.error'))
			.setTimestamp();

		await interaction.editReply({ embeds: [errorEmbed] });
	}
}

/**
 * Muestra la configuración actual
 */
async function handleViewCommand(interaction: any, userId: string): Promise<void> {
	const userConfig = getUserConfig(userId);

	const settingsEmbed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(translate(userConfig.language, 'settings.view.title'))
		.setDescription(translate(userConfig.language, 'settings.view.description'))
		.addFields([
			{
				name: translate(userConfig.language, 'settings.view.language'),
				value: translate(userConfig.language, `language.${userConfig.language}`),
				inline: true
			},
			{
				name: translate(userConfig.language, 'settings.view.difficulty'),
				value: translate(userConfig.language, `difficulty.${userConfig.difficulty}`),
				inline: true
			},
			{
				name: translate(userConfig.language, 'settings.view.autohints'),
				value: translate(userConfig.language, userConfig.autoHints ? 'common.enabled' : 'common.disabled'),
				inline: true
			},
			{
				name: translate(userConfig.language, 'settings.view.locale'),
				value: userConfig.locale,
				inline: true
			},
			{
				name: translate(userConfig.language, 'settings.view.lastUsed'),
				value: new Date(userConfig.lastUsed).toLocaleString(userConfig.locale),
				inline: true
			}
		])
		.setFooter({
			text: translate(userConfig.language, 'settings.view.footer'),
			iconURL: interaction.client.user?.displayAvatarURL()
		})
		.setTimestamp();

	await interaction.editReply({ embeds: [settingsEmbed] });
}

/**
 * Obtiene información detallada sobre un nivel de dificultad
 */
function getDifficultyInfo(difficulty: DifficultyLevels, language: LanguageCodes): string {
	const info = {
		easy: { attempts: 6, hints: 8 },
		normal: { attempts: 5, hints: 6 },
		hard: { attempts: 4, hints: 4 },
		expert: { attempts: 3, hints: 3 }
	}[difficulty];

	return translate(language, 'settings.difficulty.details', {
		attempts: info.attempts.toString(),
		hints: info.hints.toString()
	});
}

export default command;