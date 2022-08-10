import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
