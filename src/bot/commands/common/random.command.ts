import { TransformPipe } from '@discord-nestjs/common';
import {
  Command,
  DiscordTransformedCommand,
  Param,
  ParamType,
  Payload,
  UsePipes,
} from '@discord-nestjs/core';

class RandomDto {
  @Param({
    description: 'Min value for random generation',
    type: ParamType.INTEGER,
  })
  from: number;

  @Param({
    description: 'Max value for random generation',
    type: ParamType.INTEGER,
  })
  to: number;
}

@Command({
  name: 'random',
  description:
    'Generates a random number from 0 to 100 if values were not provided',
})
@UsePipes(TransformPipe)
export class RandomCommand implements DiscordTransformedCommand<RandomDto> {
  handler(@Payload() { from, to }: RandomDto): string {
    if (!from && !to) {
      return `Your lucky number is ${Math.floor(Math.random() * 101)}`;
    }

    if (from && !to) {
      return `Your lucky number is ${Math.floor(Math.random() * 101) + from}`;
    }

    if (from && to && from < to) {
      return `Your lucky number is ${
        Math.floor(Math.random() * (to - from + 1)) + from
      }`;
    } else {
      return '"from" must be lower than "to"';
    }
  }
}
