import { HttpServer, INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Response } from 'express';
import { APIDocumentationHtmlTemplateOptions, buildHtmlTemplate } from './docs.html';
import { useSpecJson, useSpecYaml } from './spec';

export interface APIDocumentationOptions {
  specFileName?: string;
  openAPISpec?: DocumentBuilder;
  htmlTemplate: APIDocumentationHtmlTemplateOptions;
}

/**
 * Configures the given nest application with 2 new routes where auto-generated API documentation will be hosted.
 *
 * **OpenAPI Spec**
 * GET /spec.json
 *
 * **Auto-Generated API Documentation**
 * GET /docs
 *
 * @param app
 */
export function enableAPIDocumentation(app: INestApplication, options: APIDocumentationOptions) {
  const adapter = app.getHttpAdapter();
  if (!options.specFileName) useSpec(app, adapter, options.openAPISpec);
  useAutoGeneratedDocumentation(adapter, options.htmlTemplate, options.specFileName || 'spec.yaml');
}

function useSpec(app: INestApplication, adapter: HttpServer, documentBuilder?: DocumentBuilder) {
  const builder = documentBuilder ?? new DocumentBuilder();
  const document = SwaggerModule.createDocument(app, builder.build());

  adapter.get('/spec.json', useSpecJson(document));
  adapter.get('/spec.yaml', useSpecYaml(document));

  Logger.log('OpenAPI Spec {/spec.json, GET}', 'APIDocumentation');
}

function useAutoGeneratedDocumentation(
  adapter: HttpServer,
  options: APIDocumentationHtmlTemplateOptions,
  specFileName: string
) {
  const html = buildHtmlTemplate(options, specFileName);

  adapter.get('/docs', (_, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/html');

    res.status(200);
    res.send(html);
  });

  Logger.log('Auto-Generated API Documentation {/docs, GET}', 'APIDocumentation');
}