import { EmbedBuilder } from 'discord.js';
import type { ChampionBuild } from '../../../domain/entities/champion-build.entity';
import type { RoleBuild } from '../../../shared/types/build.types';

/**
 * Builder for champion build Discord embeds
 */
export class BuildEmbedBuilder {
  /**
   * Build an embed showing champion build information
   */
  static buildBuildEmbed(
    championBuild: ChampionBuild,
    selectedRole?: string
  ): EmbedBuilder {
    const roleBuild = selectedRole 
      ? championBuild.getRoleBuild(selectedRole) 
      : championBuild.getMostPopularRole();

    if (!roleBuild) {
      return new EmbedBuilder()
        .setTitle('❌ Build Not Found')
        .setDescription(`No build information available for ${championBuild.championName}`)
        .setColor(0xFF0000);
    }

    const embed = new EmbedBuilder()
      .setTitle(`${championBuild.championName} - ${roleBuild.role}`)
      .setThumbnail(championBuild.championIcon)
      .setColor(0x0099FF)
      .setFooter({ text: `Patch ${championBuild.patch} • Pick Rate: ${roleBuild.pickRate.toFixed(1)}% • Win Rate: ${roleBuild.winRate.toFixed(1)}%` });

    // Add runes information
    embed.addFields({
      name: '🔮 Runes',
      value: this.formatRunes(roleBuild),
      inline: false
    });

    // Add summoner spells
    embed.addFields({
      name: '✨ Summoner Spells',
      value: `${roleBuild.summonerSpells.spell1} + ${roleBuild.summonerSpells.spell2}`,
      inline: true
    });

    // Add skill order
    embed.addFields({
      name: '📊 Skill Priority',
      value: roleBuild.skillOrder.slice(0, 6).join(' → '),
      inline: true
    });

    // Add starting items
    if (roleBuild.startingItems.length > 0) {
      embed.addFields({
        name: '🎒 Starting Items',
        value: roleBuild.startingItems.map(item => `• ${item.name}`).join('\n'),
        inline: true
      });
    }

    // Add core items
    if (roleBuild.coreItems.length > 0) {
      embed.addFields({
        name: '⚔️ Core Build',
        value: roleBuild.coreItems.map(item => `• ${item.name}`).join('\n'),
        inline: true
      });
    }

    // Add situational items
    if (roleBuild.situationalItems.length > 0) {
      embed.addFields({
        name: '🛡️ Situational Items',
        value: roleBuild.situationalItems.slice(0, 3).map(item => `• ${item.name}`).join('\n'),
        inline: true
      });
    }

    // Add other viable roles
    const otherRoles = championBuild.getAvailableRoles()
      .filter(r => r !== roleBuild.role)
      .slice(0, 3);
    
    if (otherRoles.length > 0) {
      embed.addFields({
        name: '📋 Other Roles',
        value: otherRoles.join(', '),
        inline: false
      });
    }

    return embed;
  }

  /**
   * Build an embed for role selection
   */
  static buildRoleSelectionEmbed(championBuild: ChampionBuild): EmbedBuilder {
    const roles = championBuild.roles;
    
    const embed = new EmbedBuilder()
      .setTitle(`${championBuild.championName} - Select Role`)
      .setThumbnail(championBuild.championIcon)
      .setDescription('Available roles for this champion:')
      .setColor(0x00FF00);

    roles.forEach(role => {
      embed.addFields({
        name: `${role.role}`,
        value: `Pick Rate: ${role.pickRate.toFixed(1)}% | Win Rate: ${role.winRate.toFixed(1)}%`,
        inline: true
      });
    });

    return embed;
  }

  /**
   * Format runes information
   */
  private static formatRunes(roleBuild: RoleBuild): string {
    const { runePage } = roleBuild;
    const lines: string[] = [];

    lines.push(`**Primary:** ${runePage.primaryTree.name}`);
    if (runePage.runes.length > 0) {
      lines.push(runePage.runes.slice(0, 4).map(r => `• ${r.name}`).join('\n'));
    }

    lines.push(`\n**Secondary:** ${runePage.secondaryTree.name}`);

    return lines.join('\n');
  }

  /**
   * Build error embed
   */
  static buildErrorEmbed(message: string): EmbedBuilder {
    return new EmbedBuilder()
      .setTitle('❌ Error')
      .setDescription(message)
      .setColor(0xFF0000);
  }
}
