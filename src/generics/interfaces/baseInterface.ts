import { ApiProperty } from "@nestjs/swagger";

export abstract class BaseClass {

    @ApiProperty({
        example: '1',
        required: true
    })
    id: string

}