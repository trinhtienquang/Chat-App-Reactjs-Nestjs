import {IsOptional } from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    username: string;

    @IsOptional()
    about:string;

    @IsOptional()
    image:string
  }