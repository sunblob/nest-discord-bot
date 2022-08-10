import { TransformPipe } from '@discord-nestjs/common';
import {
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

class FlipImageDto {
  @Param({ description: 'image url to flip', required: true })
  url: string;

  @Param({
    description: 'angle to rotate',
    required: true,
    type: ParamType.INTEGER,
  })
  angle: number;
}

@Command({
  name: 'rotate',
  description: 'flip image',
})
@UsePipes(TransformPipe)
export class RotateCommand {
  async handler(
    @Payload() { url, angle }: FlipImageDto,
    { interaction }: TransformedCommandExecutionContext,
  ) {
    if (!interaction.isChatInputCommand()) return;

    const img = await axios
      .get(url, { responseType: 'arraybuffer' })
      .then((res) => Buffer.from(res.data, 'base64'));

    const flippedImage = await sharp(img)
      .toFormat('jpg')
      .rotate(angle)
      .toBuffer();

    const image = new AttachmentBuilder(flippedImage, {
      name: 'flipimage.jpg',
    });

    const embed = new EmbedBuilder().setImage('attachment://flipimage.jpg');

    return await interaction.reply({ embeds: [embed], files: [image] });
  }
}
