import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class HintRequestDto {
  @IsString()
  @IsNotEmpty()
  fen!: string;

  @IsIn(['white', 'black'])
  player!: 'white' | 'black';

  // Required so hint usage can be tied to the real, server-authoritative
  // ActiveGame session in GameStateService rather than trusting a client
  // -reported counter. See PATCHES.md for why this differs slightly from
  // the brief's original { fen, player } body.
  @IsString()
  @IsNotEmpty()
  gameId!: string;
}
