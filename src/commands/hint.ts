import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getSession, incrementHints } from '../game/index';
import { getUserConfig } from '../game/index';
import { translate } from '../util/translations';
import { getChampionSplashUrl } from '../data/index';
import type { BotCommand, GameSession } from '../types/index';

const command: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('hint')
		.setDescription('Get an additional hint about the champion')
		.setDescriptionLocalizations({
			'es-ES': 'Obtiene una pista adicional sobre el campeón',
			'en-US': 'Get an additional hint about the champion'
		}),

	async execute(interaction) {
		try {
			await interaction.deferReply();

			const userId = interaction.user.id;
			const userConfig = getUserConfig(userId);
			const language = userConfig.language;

			
			const session = getSession(interaction.channelId);
			if (!session) {
				const noGameEmbed = new EmbedBuilder()
					.setColor(0xFF6B6B)
					.setTitle(translate(language, 'error.title'))
					.setDescription(translate(language, 'validation.noActiveGame'))
					.addFields([{
						name: translate(language, 'validation.suggestion'),
						value: translate(language, 'validation.useStartCommand'),
						inline: false
					}])
					.setTimestamp();

				await interaction.editReply({ embeds: [noGameEmbed] });
				return;
			}

			
			if (session.userId !== userId) {
				const wrongUserEmbed = new EmbedBuilder()
					.setColor(0xFF6B6B)
					.setTitle(translate(language, 'error.title'))
					.setDescription(translate(language, 'validation.notYourGame'))
					.setTimestamp();

				await interaction.editReply({ embeds: [wrongUserEmbed] });
				return;
			}

			
			if (!session.isActive) {
				const gameEndedEmbed = new EmbedBuilder()
					.setColor(0xFF6B6B)
					.setTitle(translate(language, 'error.title'))
					.setDescription(translate(language, 'validation.gameEnded'))
					.setTimestamp();

				await interaction.editReply({ embeds: [gameEndedEmbed] });
				return;
			}

			
			const maxHints = getMaxHints(session.difficulty);

			
			if (session.hintsUsed >= maxHints) {
				const noMoreHintsEmbed = new EmbedBuilder()
					.setColor(0xFF6B6B)
					.setTitle(translate(language, 'hint.noMore.title'))
					.setDescription(translate(language, 'hint.noMore.description', {
						maxHints: maxHints.toString()
					}))
					.setTimestamp();

				await interaction.editReply({ embeds: [noMoreHintsEmbed] });
				return;
			}

			
			const totalHints = incrementHints(interaction.channelId);

			console.log(
				`💡 Pista solicitada - Canal: ${interaction.channelId}, Usuario: ${interaction.user.username}, Pistas usadas: ${totalHints}`
			);

			
			const hint = getHintByNumber(session, session.hintsUsed - 1, language);

			if (!hint) {
				const noHintEmbed = new EmbedBuilder()
					.setColor(0xFF6B6B)
					.setTitle(translate(language, 'error.title'))
					.setDescription(translate(language, 'hint.error.unavailable'))
					.setTimestamp();

				await interaction.editReply({ embeds: [noHintEmbed] });
				return;
			}

			
			const hintEmbed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle(translate(language, 'hint.title', {
					number: session.hintsUsed.toString()
				}))
				.setDescription(hint)
				.addFields([
					{
						name: translate(language, 'hint.progress.title'),
						value: translate(language, 'hint.progress.used', {
							used: session.hintsUsed.toString(),
							max: maxHints.toString()
						}),
						inline: true
					},
					{
						name: translate(language, 'game.attempts.remaining'),
						value: `${session.attemptsLeft}/${session.maxAttempts}`,
						inline: true
					}
				])
				.setFooter({
					text: translate(language, 'hint.footer'),
					iconURL: interaction.client.user?.displayAvatarURL()
				})
				.setTimestamp();

			
			if (session.hintsUsed >= maxHints - 1) {
				hintEmbed.setImage(getChampionSplashUrl(session.targetChampion.id));
				hintEmbed.addFields([{
					name: translate(language, 'hint.final.title'),
					value: translate(language, 'hint.final.description'),
					inline: false
				}]);
			}

			await interaction.editReply({ embeds: [hintEmbed] });

		} catch (error) {
			console.error('❌ Error en comando hint:', error);

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
 * Obtiene el número máximo de pistas basado en la dificultad
 */
function getMaxHints(difficulty: string): number {
	switch (difficulty) {
		case 'easy': return 8;
		case 'normal': return 6;
		case 'hard': return 4;
		case 'expert': return 3;
		default: return 6;
	}
}

/**
 * Obtiene una pista específica por número
 */
function getHintByNumber(session: GameSession, hintNumber: number, language: string): string | null {
	const champion = session.targetChampion;
	const attackType = champion.info.attack > 5 ? 'ranged' : 'melee';
	const attackTypeTranslated = translate(language as any, `attackTypes.${attackType}`);
	
	// Traducir roles
	const translatedRoles = champion.tags.map(tag => 
		translate(language as any, `championTags.${tag}`)
	).join(', ');
	
	const hints = [
		translate(language as any, 'game.hint.types.role', { role: translatedRoles }),
		translate(language as any, 'game.hint.types.resource', { resource: champion.partype }),
		translate(language as any, 'game.hint.types.title', { title: champion.title }),
		translate(language as any, 'game.hint.types.range', { range: attackTypeTranslated }),
		translate(language as any, 'game.hint.types.difficulty', { difficulty: champion.info.difficulty.toString() }),
		translate(language as any, 'game.hint.types.firstLetter', { letter: champion.name.charAt(0) }),
		translate(language as any, 'game.hint.types.length', { length: champion.name.length.toString() }),
		translate(language as any, 'game.hint.types.partial', { partial: champion.name.substring(0, Math.ceil(champion.name.length / 2)) })
	];

	return hints[hintNumber] || null;
}

export default command;