import { EmbedBuilder } from 'discord.js';
import type { GameSession } from '../../../domain/entities/game-session.entity';
import { translate } from '../../../shared/utils/translations.util';

/**
 * Builder para construir embeds del juego
 */
export class GameEmbedBuilder {
	/**
	 * Crea un embed para el inicio del juego
	 */
	static buildStartEmbed(session: GameSession, clientAvatarUrl?: string): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('🎮 ¡Adivina el Campeón!')
			.setDescription(
				`¡Adivina el campeón misterioso!\n\n` +
				`Dificultad: **${session.difficulty}**\n` +
				`Usa \`/guess <nombre>\` para adivinar o \`/hint\` para obtener pistas.`
			)
			.addFields([
				{
					name: '❓ Campeón Misterioso',
					value: '???',
					inline: true
				},
				{
					name: '🎯 Intentos Restantes',
					value: `${session.attemptsLeft}/${session.maxAttempts}`,
					inline: true
				},
				{
					name: '⚡ Dificultad',
					value: session.difficulty,
					inline: true
				}
			])
			.setThumbnail('https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-clash/global/default/assets/images/position-selector/positions/icon-position-unselected.png')
			.setFooter(clientAvatarUrl ? {
				text: 'Usa /guess <nombre> para adivinar • /hint para pistas',
				iconURL: clientAvatarUrl
			} : { text: 'Usa /guess <nombre> para adivinar • /hint para pistas' })
			.setTimestamp();
	}

	/**
	 * Crea un embed para cuando el usuario gana
	 */
	static buildWinEmbed(session: GameSession, splashUrl: string, clientAvatarUrl?: string): EmbedBuilder {
		const attempts = session.maxAttempts - session.attemptsLeft;
		const duration = session.getDuration();
		
		return new EmbedBuilder()
			.setColor(0x00FF00)
			.setTitle('🎉 ¡Correcto!')
			.setDescription(
				`¡Felicitaciones! Has adivinado **${session.targetChampion.name}** ` +
				`correctamente en ${attempts}/${session.maxAttempts} intentos.`
			)
			.addFields([
				{
					name: '⭐ Puntuación',
					value: `${session.getScore()} puntos`,
					inline: true
				},
				{
					name: '⚡ Dificultad',
					value: session.difficulty,
					inline: true
				},
				{
					name: '⏱️ Tiempo Transcurrido',
					value: `${duration}s`,
					inline: true
				}
			])
			.setImage(splashUrl)
			.setFooter(clientAvatarUrl ? {
				text: '¡Excelente trabajo!',
				iconURL: clientAvatarUrl
			} : { text: '¡Excelente trabajo!' })
			.setTimestamp();
	}

	/**
	 * Crea un embed para cuando el usuario falla
	 */
	static buildWrongEmbed(session: GameSession, guess: string): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0xFF6B6B)
			.setTitle('❌ Incorrecto')
			.setDescription(`**${guess}** no es correcto. Te quedan ${session.attemptsLeft} intentos.`)
			.addFields([
				{
					name: '🎯 Intentos Restantes',
					value: `${session.attemptsLeft}/${session.maxAttempts}`,
					inline: true
				},
				{
					name: '📝 Intentos Anteriores',
					value: session.guesses.slice(-3).join(', ') || 'Ninguno',
					inline: true
				}
			])
			.setTimestamp();
	}

	/**
	 * Crea un embed para cuando se acaban los intentos
	 */
	static buildGameOverEmbed(session: GameSession, splashUrl: string): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0xFF6B6B)
			.setTitle('💀 Juego Terminado')
			.setDescription(`Se acabaron los intentos. El campeón era **${session.targetChampion.name}**.`)
			.setImage(splashUrl)
			.setTimestamp();
	}

	/**
	 * Crea un embed para una pista
	 */
	static buildHintEmbed(session: GameSession, hint: string, hintType: string): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0xFFAA00)
			.setTitle('💡 Pista')
			.setDescription(hint)
			.addFields([
				{
					name: '📊 Progreso de Pistas',
					value: `Pistas usadas: ${session.hintsUsed}/${session.getMaxHints()}`,
					inline: false
				}
			])
			.setFooter({
				text: 'Usa /guess <nombre> para adivinar'
			})
			.setTimestamp();
	}

	/**
	 * Crea un embed para cuando se rinde
	 */
	static buildGiveUpEmbed(session: GameSession, splashUrl: string): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0xFFAA00)
			.setTitle('🏳️ Te has rendido')
			.setDescription(`La respuesta era **${session.targetChampion.name}**.`)
			.addFields([
				{
					name: 'Título',
					value: session.targetChampion.title,
					inline: true
				},
				{
					name: 'Rol',
					value: session.targetChampion.getPrimaryRole(),
					inline: true
				}
			])
			.setImage(splashUrl)
			.setTimestamp();
	}

	/**
	 * Crea un embed de error genérico
	 */
	static buildErrorEmbed(title: string, description: string): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0xFF6B6B)
			.setTitle(`❌ ${title}`)
			.setDescription(description)
			.setTimestamp();
	}

	/**
	 * Crea un embed cuando no hay juego activo
	 */
	static buildNoActiveGameEmbed(): EmbedBuilder {
		return new EmbedBuilder()
			.setColor(0xFF6B6B)
			.setTitle('❌ Error')
			.setDescription('No hay ninguna partida activa en este canal.')
			.addFields([{
				name: '💡 Sugerencia',
				value: 'Usa `/start` para comenzar una nueva partida.',
				inline: false
			}])
			.setTimestamp();
	}
}
