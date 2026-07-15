import { IsString, IsOptional } from 'class-validator';

export class JoinQueueDto {
  @IsString()
  @IsOptional()
  timeControl?: string; // e.g. "10+0"
}
