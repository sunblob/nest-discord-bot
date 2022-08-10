import {
  Command,
  Param,
  ParamType,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { GuildMember } from 'discord.js';
import { TransformPipe } from '@discord-nestjs/common';
import { PlayerService } from 'src/player/player.service';

class VolumeDto {
  @Param({
    description: 'The volume amount to set (0-100)',
    minValue: 0,
    maxValue: 100,
    type: ParamType.INTEGER,
  })
  amount: number;
}

@Command({
  name: 'volume',
  description: 'Set music volume',
})
@UsePipes(TransformPipe)
export class VolumeCommand {
  constructor(private playerService: PlayerService) {}

  async handler(
    @Payload() { amount }: VolumeDto,
    { interaction }: TransformedCommandExecutionContext,
  ) {
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

    if (!amount)
      return await interaction.followUp({
        content: `🎧 | Current volume is **${queue.volume}**%!`,
      });

    const success = queue.setVolume(amount);
    return await interaction.followUp({
      content: success
        ? `✅ | Volume set to **${amount}%**!`
        : '❌ | Something went wrong!',
    });
  }
}
