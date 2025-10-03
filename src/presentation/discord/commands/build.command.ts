import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  CacheType
} from 'discord.js';
import { DependencyContainer } from '../../../container';
import { BuildEmbedBuilder } from '../builders/build-embed.builder';
import { Locale } from '../../../shared/enums';
import type { Champion } from '../../../domain/entities/champion.entity';

/**
 * /build command - Show champion build, runes, and items
 */
export default {
  data: new SlashCommandBuilder()
    .setName('build')
    .setDescription('Get build, runes, and items for a champion')
    .addStringOption(option =>
      option
        .setName('champion')
        .setDescription('Champion name')
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption(option =>
      option
        .setName('role')
        .setDescription('Specific role (optional)')
        .setRequired(false)
        .addChoices(
          { name: 'Top', value: 'TOP' },
          { name: 'Jungle', value: 'JUNGLE' },
          { name: 'Mid', value: 'MID' },
          { name: 'ADC', value: 'ADC' },
          { name: 'Support', value: 'SUPPORT' }
        )
    ),

  async autocomplete(interaction: AutocompleteInteraction<CacheType>) {
    try {
      const container = DependencyContainer.getInstance();
      const championRepository = container.getChampionRepository();
      
      const focusedValue = interaction.options.getFocused().toLowerCase();
      
      // Get all champions
      const champions = await championRepository.getAll(Locale.ENGLISH);
      
      // Filter champions by name
      const filtered = champions
        .filter((champ: Champion) => 
          champ.name.toLowerCase().includes(focusedValue) ||
          champ.id.toLowerCase().includes(focusedValue)
        )
        .slice(0, 25) // Discord limit
        .map((champ: Champion) => ({
          name: champ.name,
          value: champ.id
        }));

      await interaction.respond(filtered);
    } catch (error) {
      console.error('Error in autocomplete:', error);
      await interaction.respond([]);
    }
  },

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    try {
      await interaction.deferReply();

      const championId = interaction.options.getString('champion', true);
      const role = interaction.options.getString('role') || undefined;

      const container = DependencyContainer.getInstance();
      const getChampionBuildUseCase = container.getGetChampionBuildUseCase();

      // Execute use case
      const championBuild = await getChampionBuildUseCase.execute(championId, role);

      // Build embed
      const embed = BuildEmbedBuilder.buildBuildEmbed(championBuild, role);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error executing build command:', error);
      
      const errorEmbed = BuildEmbedBuilder.buildErrorEmbed(
        error instanceof Error ? error.message : 'An error occurred while fetching champion build'
      );

      if (interaction.deferred) {
        await interaction.editReply({ embeds: [errorEmbed] });
      } else {
        await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      }
    }
  }
};
