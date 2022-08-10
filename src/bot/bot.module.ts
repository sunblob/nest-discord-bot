import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { PlayerModule } from 'src/player/player.module';
import { BotGateway } from './bot.gateway';
import { RandomCommand } from './commands/common/random.command';
import { PauseCommand } from './commands/music/pause.command';
import { PlayCommand } from './commands/music/play.command';
import { ResumeCommand } from './commands/music/resume.command';
import { StopCommand } from './commands/music/stop.command';
import { VolumeCommand } from './commands/music/volume.command';
import { TestCommand } from './commands/test.command';

@Module({
  imports: [DiscordModule.forFeature(), PlayerModule],
  providers: [
    BotGateway,
    PlayCommand,
    TestCommand,
    RandomCommand,
    PauseCommand,
    VolumeCommand,
    ResumeCommand,
    StopCommand,
  ],
})
export class BotModule {}
