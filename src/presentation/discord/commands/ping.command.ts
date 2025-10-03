import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  CacheType
} from 'discord.js';

/**
 * /ping command - Health check
 */
export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong! Check if the bot is alive'),

  async execute(interaction: ChatInputCommandInteraction<CacheType>) {
    const sent = await interaction.reply({ 
      content: '🏓 Pinging...', 
      fetchReply: true 
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      `🏓 Pong!\n` +
      `📡 Latency: ${latency}ms\n` +
      `💓 API Latency: ${apiLatency}ms`
    );
  }
};
