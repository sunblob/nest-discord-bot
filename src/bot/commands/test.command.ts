import { Command, DiscordCommand } from '@discord-nestjs/core';

@Command({
  name: 'test',
  description: 'test command',
})
export class TestCommand implements DiscordCommand {
  handler(): string {
    return 'Testing';
  }
}
