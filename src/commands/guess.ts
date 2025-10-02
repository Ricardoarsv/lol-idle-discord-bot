import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getSession, addGuess } from '../game/index';
import { getUserConfig } from '../game/index';
import { translate } from '../util/translations';
import { matchesChampion, getBestMatches, getChampionSplashUrl } from '../data/index';
import type { BotCommand, GameSession, ChampionData } from '../types/index';

const command: BotCommand = {
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
				.setAutocomplete(false)
		) as SlashCommandBuilder,

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

			const guess = interaction.options.getString('name', true).trim();

			
			if (!guess) {
				const emptyGuessEmbed = new EmbedBuilder()
					.setColor(0xFF6B6B)
					.setTitle(translate(language, 'error.title'))
					.setDescription(translate(language, 'validation.emptyGuess'))
					.setTimestamp();

				await interaction.editReply({ embeds: [emptyGuessEmbed] });
				return;
			}

			
			if (session.guesses.includes(guess.toLowerCase())) {
				const alreadyGuessedEmbed = new EmbedBuilder()
					.setColor(0xFF6B6B)
					.setTitle(translate(language, 'error.title'))
					.setDescription(translate(language, 'validation.alreadyGuessed', { guess }))
					.setTimestamp();

				await interaction.editReply({ embeds: [alreadyGuessedEmbed] });
				return;
			}

			
			addGuess(interaction.channelId, guess.toLowerCase());
			session.attemptsLeft--;

			
			const isCorrect = matchesChampion(guess, session.targetChampion.name);

			if (isCorrect) {
				
				const score = calculateScore(session);
				session.score = score;
				session.isActive = false;
				session.endTime = Date.now();

				const successEmbed = new EmbedBuilder()
					.setColor(0x00FF00)
					.setTitle(translate(language, 'game.win.title'))
					.setDescription(translate(language, 'game.win.description', {
						champion: session.targetChampion.name,
						attempts: session.maxAttempts - session.attemptsLeft,
						maxAttempts: session.maxAttempts
					}))
					.addFields([
						{
							name: translate(language, 'game.score.title'),
							value: `${score} ${translate(language, 'game.score.points')}`,
							inline: true
						},
						{
							name: translate(language, 'game.difficulty.name'),
							value: translate(language, `difficulty.${session.difficulty}`),
							inline: true
						},
						{
							name: translate(language, 'game.time.elapsed'),
							value: formatTime(Date.now() - session.startTime),
							inline: true
						}
					])
					.setImage(getChampionSplashUrl(session.targetChampion.id))
					.setFooter({
						text: translate(language, 'game.win.footer'),
						iconURL: interaction.client.user?.displayAvatarURL()
					})
					.setTimestamp();

				await interaction.editReply({ embeds: [successEmbed] });

			} else {
				
				// ✅ Verificar si el juego termina DESPUÉS de reducir intentos
				if (session.attemptsLeft <= 0) {
					const noAttemptsEmbed = new EmbedBuilder()
						.setColor(0xFF6B6B)
						.setTitle(translate(language, 'game.over.title'))
						.setDescription(translate(language, 'game.over.noAttempts', {
							champion: session.targetChampion.name
						}))
						.setImage(getChampionSplashUrl(session.targetChampion.id))
						.setTimestamp();

					
					session.isActive = false;
					session.endTime = Date.now();

					await interaction.editReply({ embeds: [noAttemptsEmbed] });
					return;
				}
				
				const wrongEmbed = new EmbedBuilder()
					.setColor(0xFF6B6B)
					.setTitle(translate(language, 'game.wrong.title'))
					.setDescription(translate(language, 'game.wrong.description', {
						guess,
						remaining: session.attemptsLeft
					}))
					.addFields([
						{
							name: translate(language, 'game.attempts.remaining'),
							value: `${session.attemptsLeft}/${session.maxAttempts}`,
							inline: true
						},
						{
							name: translate(language, 'game.guesses.previous'),
							value: session.guesses.slice(-3).join(', ') || translate(language, 'game.guesses.none'),
							inline: true
						}
					])
					.setTimestamp();

				
				

				
				
				
				
				const maxHints = 5; 
				if (session.hintsUsed < maxHints) {
					const hint = getAutoHint(session, language);
					if (hint) {
						wrongEmbed.addFields([{
							name: translate(language, 'game.hint.auto'),
							value: hint,
							inline: false
						}]);
						session.hintsUsed++;
					}
				}				await interaction.editReply({ embeds: [wrongEmbed] });
			}

		} catch (error) {
			console.error('❌ Error en comando guess:', error);

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
 * Calcula la puntuación basada en intentos usados, dificultad y tiempo
 */
function calculateScore(session: GameSession): number {
	const baseScore = 100;
	const attemptsUsed = session.maxAttempts - session.attemptsLeft;
	const attemptsBonus = Math.max(0, (session.maxAttempts - attemptsUsed) * 20);
	
	const difficultyMultiplier: Record<string, number> = {
		easy: 1,
		normal: 1.2,
		hard: 1.5,
		expert: 2
	};
	
	const multiplier = difficultyMultiplier[session.difficulty] || 1;

	const timeElapsed = Date.now() - session.startTime;
	const timeBonus = Math.max(0, 50 - Math.floor(timeElapsed / 10000)); 

	return Math.floor((baseScore + attemptsBonus + timeBonus) * multiplier);
}

/**
 * Genera una pista automática basada en la situación del juego
 */
function getAutoHint(session: GameSession, language: string): string | null {
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
		translate(language as any, 'game.hint.types.firstLetter', { letter: champion.name.charAt(0) })
	];

	return hints[session.hintsUsed] || null;
}

/**
 * Formatea el tiempo transcurrido
 */
function formatTime(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000);
	const minutes = Math.floor(seconds / 60);
	
	if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`;
	}
	return `${seconds}s`;
}

export default command;