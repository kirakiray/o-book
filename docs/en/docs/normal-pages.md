# Add Non-Document Pages

Sometimes, you may need to add some pages that are not of document type, such as the homepage. In this case, you can specify the relative address of the Markdown file for non-document type pages by editing the `pages` property in the `config.json` file.

```json
// config.json
{
  ...
  "pages": ["./index.md"],
  ...
}
```

In the above example, we have set up a homepage (`index.md`), which means that the homepage will only include the top navigation component and will not display the left-side document navigation and right-side article navigation of the document type pages.

This method allows you to easily add additional types of pages and customize them as needed, without being limited by the structure of the document pages.

