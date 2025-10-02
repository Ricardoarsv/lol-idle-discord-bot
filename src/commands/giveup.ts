import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getSession, clearSession, getSessionStats } from '../game/index';
import { getChampionSplashUrl, getChampionIconUrl } from '../data/index';
import { getUserConfig } from '../game/index';
import { translate } from '../util/translations';
import type { BotCommand, GameSession } from '../types/index';

const command: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('giveup')
		.setDescription('Give up and reveal the correct answer')
		.setDescriptionLocalizations({
			'es-ES': 'Rendirse y revelar la respuesta correcta',
			'en-US': 'Give up and reveal the correct answer'
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

			console.log(
				`🏳️ Rendición - Canal: ${interaction.channelId}, Usuario: ${interaction.user.username}, Campeón: ${session.targetChampion.name}`
			);

			
			const stats = getSessionStats(interaction.channelId);

			
			session.isActive = false;
			session.endTime = Date.now();

			
			const giveupEmbed = new EmbedBuilder()
				.setColor(0xFFA500)
				.setTitle(translate(language, 'game.giveup.title'))
				.setDescription(translate(language, 'game.giveup.description', {
					champion: session.targetChampion.name
				}))
				.addFields([
					{
						name: translate(language, 'game.champion.info'),
						value: `**${session.targetChampion.name}** - *${session.targetChampion.title}*`,
						inline: false
					},
					{
						name: translate(language, 'game.champion.role'),
						value: session.targetChampion.tags.join(', '),
						inline: true
					},
					{
						name: translate(language, 'game.champion.resource'),
						value: session.targetChampion.partype,
						inline: true
					},
					{
						name: translate(language, 'game.stats.attempts'),
						value: `${session.maxAttempts - session.attemptsLeft}/${session.maxAttempts}`,
						inline: true
					},
					{
						name: translate(language, 'game.stats.hints'),
						value: session.hintsUsed.toString(),
						inline: true
					},
					{
						name: translate(language, 'game.stats.time'),
						value: formatTime(Date.now() - session.startTime),
						inline: true
					},
					{
						name: translate(language, 'game.difficulty.name'),
						value: translate(language, `difficulty.${session.difficulty}`),
						inline: true
					}
				])
				.setImage(getChampionSplashUrl(session.targetChampion.id))
				.setThumbnail(getChampionIconUrl(session.targetChampion.id))
				.setFooter({
					text: translate(language, 'game.giveup.footer'),
					iconURL: interaction.client.user?.displayAvatarURL()
				})
				.setTimestamp();

			
			if (session.guesses.length > 0) {
				giveupEmbed.addFields([{
					name: translate(language, 'game.guesses.attempted'),
					value: session.guesses.slice(-5).join(', ') || translate(language, 'game.guesses.none'),
					inline: false
				}]);
			}

			
			if (stats) {
				const sessionStats = `${translate(language, 'game.stats.attempts')}: ${stats.attempts}, ${translate(language, 'game.stats.duration')}: ${Math.floor(stats.duration / 60)}m`;
				giveupEmbed.addFields([{
					name: translate(language, 'game.stats.session'),
					value: sessionStats,
					inline: false
				}]);
			}

			
			const cleared = clearSession(interaction.channelId);
			if (cleared) {
				console.log(`🧹 Sesión limpiada para canal: ${interaction.channelId}`);
			}

			await interaction.editReply({ 
				embeds: [giveupEmbed],
				content: translate(language, 'game.giveup.message', {
					user: interaction.user.toString()
				})
			});

		} catch (error) {
			console.error('❌ Error en comando giveup:', error);

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
 * Formatea el tiempo transcurrido en un formato legible
 */
function formatTime(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	
	if (hours > 0) {
		return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
	} else if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`;
	}
	return `${seconds}s`;
}

export default command;