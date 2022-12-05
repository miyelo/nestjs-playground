import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";



export function configSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('NestJS Playground')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document)

}