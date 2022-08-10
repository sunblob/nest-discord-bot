import {
  DiscordArgumentMetadata,
  DiscordExceptionFilter,
  Catch,
} from '@discord-nestjs/core';

@Catch()
export class InteractionAlreadyRepliedFilter implements DiscordExceptionFilter {
  async catch(
    exceptionList: Error,
    metadata: DiscordArgumentMetadata<'interactionCreate'>,
  ): Promise<void> {
    const [interaction] = metadata.eventArgs;

    if (interaction.isCommand())
      await interaction.reply('Something went wrong');
  }
}
