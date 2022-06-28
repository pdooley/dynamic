import { OpenAPIObject } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Document } from 'yaml';

export function useSpecJson(document: OpenAPIObject) {
  return (_: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    res.status(200);
    res.send(document);
  };
}

export function useSpecYaml(document: OpenAPIObject) {
  const yaml = new Document(document);

  return (_: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/x-yaml');

    res.status(200);
    res.send(yaml.toString());
  };
}
