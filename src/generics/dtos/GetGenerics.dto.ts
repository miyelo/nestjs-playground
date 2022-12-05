import { ApiProperty } from "@nestjs/swagger";
import { BaseClass } from "../interfaces/baseInterface";

export class GetGenericsDto extends BaseClass {

    @ApiProperty({
        example: "Un text",
        required: false
    })
    text: string;

}