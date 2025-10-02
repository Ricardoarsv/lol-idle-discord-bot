import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { translate } from '../util/translations';
import type { BotCommand, GameSession, ChampionData } from '../types/index';
import { getUserConfig } from '../game/user-config';
import { getDragonData, getChampionSplashUrl } from '../data/index';
import { createGameSession } from '../game/index';

const command: BotCommand = {
	data: new SlashCommandBuilder()
		.setName('start')
		.setDescription('Inicia un nuevo juego de adivinanza de campeones de League of Legends')
		.setDescriptionLocalizations({
			'es-ES': 'Inicia un nuevo juego de adivinanza de campeones de League of Legends',
			'en-US': 'Start a new League of Legends champion guessing game'
		}),

	async execute(interaction) {
		try {
			await interaction.deferReply();

			const userId = interaction.user.id;
			const userConfig = getUserConfig(userId);
			
			console.log(`🎮 ${interaction.user.tag} iniciando nuevo juego`);

			
			const champions = await getDragonData();

			if (champions.length === 0) {
			const errorEmbed = new EmbedBuilder()
				.setColor(0xFF6B6B)
				.setTitle(translate(userConfig.language, 'error.title'))
				.setDescription(translate(userConfig.language, 'error.noChampions'))
				.setTimestamp();				await interaction.editReply({ embeds: [errorEmbed] });
				return;
			}

			
			const gameSession: GameSession = createGameSession(
				userId, 
				champions, 
				userConfig, 
				interaction.channelId || 'default'
			);

			
			const gameEmbed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle(translate(userConfig.language, 'game.title'))
				.setDescription(translate(userConfig.language, 'game.start.description', {
					difficulty: translate(userConfig.language, `difficulty.${gameSession.difficulty}`)
				}))
				.addFields([
					{
						name: translate(userConfig.language, 'game.champion.mystery'),
						value: '❓ ???',
						inline: true
					},
					{
						name: translate(userConfig.language, 'game.attempts.remaining'),
						value: `${gameSession.attemptsLeft}/${gameSession.maxAttempts}`,
						inline: true
					},
					{
						name: translate(userConfig.language, 'game.difficulty.name'),
						value: translate(userConfig.language, `difficulty.${gameSession.difficulty}`),
						inline: true
					}
				])
				.setThumbnail('https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-unselected.png')
				.setFooter({ 
					text: translate(userConfig.language, 'game.footer.guess'),
					iconURL: interaction.client.user?.displayAvatarURL()
				})
				.setTimestamp();

			
			if (userConfig.autoHints && gameSession.hintsUsed === 0) {
				const hint = getHint(gameSession.targetChampion, gameSession.hintsUsed, userConfig.language);
				if (hint) {
					gameEmbed.addFields([{
						name: translate(userConfig.language, 'game.hint.title'),
						value: hint,
						inline: false
					}]);
					gameSession.hintsUsed++;
				}
			}

			await interaction.editReply({ 
				embeds: [gameEmbed],
				content: translate(userConfig.language, 'game.start.message', {
					user: interaction.user.toString()
				})
			});

		} catch (error) {
			console.error('❌ Error al iniciar el juego:', error);
			
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
 * Obtiene una pista basada en el campeón y el número de pistas usadas
 * @param champion - Datos del campeón
 * @param hintsUsed - Número de pistas ya usadas
 * @param language - Idioma del usuario
 * @returns Pista o null si no hay más pistas
 */
function getHint(champion: ChampionData, hintsUsed: number, language: string): string | null {
	// Traducir roles
	const translatedRoles = champion.tags.map(tag => 
		translate(language as any, `championTags.${tag}`)
	).join(', ');
	
	const hints = [
		translate(language as any, 'game.hint.types.role', { role: translatedRoles }),
		translate(language as any, 'game.hint.types.resource', { resource: champion.partype }),
		translate(language as any, 'game.hint.types.title', { title: champion.title }),
		translate(language as any, 'game.hint.types.firstLetter', { letter: champion.name.charAt(0) })
	];

	return hints[hintsUsed] || null;
}

export default command;