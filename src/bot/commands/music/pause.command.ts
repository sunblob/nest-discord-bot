import { Command } from '@discord-nestjs/core';
import { CommandInteraction, GuildMember } from 'discord.js';
import { PlayerService } from 'src/player/player.service';

@Command({
  name: 'pause',
  description: 'Pause music',
})
export class PauseCommand {
  constructor(private playerService: PlayerService) {}

  async handler(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    await interaction.deferReply();

    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel)
      return await interaction.reply({
        content: 'You are not in a voice channel!',
        ephemeral: true,
      });

    if (
      interaction.guild.members.me.voice.channelId &&
      voiceChannel.id !== interaction.guild.members.me.voice.channelId
    )
      return await interaction.reply({
        content: 'You are not in my voice channel!',
        ephemeral: true,
      });

    const queue = this.playerService.getPlayer().getQueue(interaction.guildId);

    if (!queue || !queue.playing)
      return await interaction.followUp({
        content: '❌ | No music is being played!',
      });

    const success = queue.setPaused(true);
    return await interaction.followUp({
      content: success ? '⏸ | Paused!' : '❌ | Something went wrong!',
    });
  }
}
