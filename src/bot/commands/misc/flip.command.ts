import { TransformPipe } from '@discord-nestjs/common';
import {
  Choice,
  Command,
  Param,
  ParamType,
  Payload,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core';
import sharp from 'sharp';
import { AttachmentBuilder, EmbedBuilder } from 'discord.js';
import axios from 'axios';

enum Orientation {
  VERTICAL,
  HORIZONTAL,
}

class FlipImageDto {
  @Param({ description: 'image url to flip', required: true })
  url: string;

  @Choice(Orientation)
  @Param({ description: 'Orientation', type: ParamType.INTEGER })
  orientation: Orientation;
}

@Command({
  name: 'flip',
  description: 'flip image',
})
@UsePipes(TransformPipe)
export class FlipCommand {
  async handler(
    @Payload() { url, orientation }: FlipImageDto,
    { interaction }: TransformedCommandExecutionContext,
  ) {
    if (!interaction.isChatInputCommand()) return;

    if (!orientation) orientation = Orientation.VERTICAL;

    const img = await axios
      .get(url, { responseType: 'arraybuffer' })
      .then((res) => Buffer.from(res.data, 'base64'));

    const flippedImage =
      orientation === Orientation.HORIZONTAL
        ? await sharp(img).toFormat('jpg').flip().rotate(180).toBuffer()
        : await sharp(img).toFormat('jpg').flip().toBuffer();

    const image = new AttachmentBuilder(flippedImage, {
      name: 'flipimage.jpg',
    });

    const embed = new EmbedBuilder().setImage('attachment://flipimage.jpg');

    return await interaction.reply({ embeds: [embed], files: [image] });
  }
}
