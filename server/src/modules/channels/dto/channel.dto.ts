import { IsArray, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ChannelDto {
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)  // Chuyển đổi mỗi phần tử trong mảng thành string
  participants: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)  // Chuyển đổi mỗi phần tử trong mảng thành string
  admins?: string[];

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
