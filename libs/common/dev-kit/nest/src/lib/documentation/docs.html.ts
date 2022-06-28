export interface APIDocumentationHtmlTemplateOptions {
  pageTitle: string;
  faviconUrl?: string;
  logoUrl?: string;
}

export function buildHtmlTemplate(options: APIDocumentationHtmlTemplateOptions, specFileName: string) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>${options.pageTitle}</title>
    ${options.faviconUrl ? `<link rel="icon" type="image/x-icon" href="${options.faviconUrl}">` : ''}

    <!-- Embed elements Elements via Web Component -->
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">

    <style>
      html, body {
        height: 100%;
        margin: 0;
      }

      a[href*="https://stoplight.io"],
      .sl-leading-relaxed:last-of-type,
      .sl-leading-relaxed ~ .ElementsTableOfContentsItem[href*="#/schemas"] {
        display: none;
      }
    </style>
  </head>

  <body>
    <elements-api
      apiDescriptionUrl="../${specFileName}"
      showPoweredByLink="false"
      hideMocking="true"
      layout="sidebar"
      router="hash"
      ${options.logoUrl ? `logo="${options.logoUrl}"` : ''}
    />
  </body>
</html>`;
}
