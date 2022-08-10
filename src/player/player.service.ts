import { InjectDiscordClient } from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { Client } from 'discord.js';
import { Player } from 'discord-player';

@Injectable()
export class PlayerService {
  private player: Player;

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
  ) {
    this.player = new Player(this.client);
  }

  getPlayer(): Player {
    return this.player;
  }
}
