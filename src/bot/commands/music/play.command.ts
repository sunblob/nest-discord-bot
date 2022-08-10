import {
  Command,
  Param,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import { GuildMember } from 'discord.js';
import { TransformPipe } from '@discord-nestjs/common';
import { PlayerService } from 'src/player/player.service';

class PlayDto {
  @Param({ description: 'The song you want to play', required: true })
  query: string;
}

@Command({
  name: 'play',
  description: 'Plays a song preferably from youtube',
})
@UsePipes(TransformPipe)
export class PlayCommand {
  constructor(private playerService: PlayerService) {}

  async handler(
    @Payload() dto: PlayDto,
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

    const queue = this.playerService
      .getPlayer()
      .createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel,
        },
      });

    // verify vc connection
    try {
      if (!queue.connection) await queue.connect(voiceChannel);
    } catch {
      queue.destroy();

      return await interaction.reply({
        content: 'Could not join your voice channel!',
        ephemeral: true,
      });
    }

    const track = await this.playerService
      .getPlayer()
      .search(dto.query, {
        requestedBy: interaction.user,
      })
      .then((x) => x.tracks[0]);

    if (!track)
      return await interaction.followUp({
        content: `❌ | Track **${dto.query}** not found!`,
      });

    queue.addTrack(track);

    if (!queue.playing) {
      await queue.play();
    }

    return await interaction.followUp({
      content: `⏱️ | Loading track **${track.title}**!`,
    });
  }
}
