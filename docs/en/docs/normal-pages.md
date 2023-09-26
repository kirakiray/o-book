# Add non-document pages

Sometimes, you may need to add some pages that are not document types, such as a homepage. In this case, you can specify the relative address of the non-document type Markdown file by editing the `pages` attribute of the `config.json` file.

```json
// config.json
{
  ...
  "pages": ["./index.md"],
  ...
}
```

In the above example, we have set up a homepage (`index.md`), which means that the homepage will only include the top navigation component and will not display the left document navigation and right article navigation of the document type pages.

This allows you to easily add other types of pages and customize as needed, without being limited by the structure of the document page.

