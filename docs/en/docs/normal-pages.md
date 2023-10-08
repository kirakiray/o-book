# Add Non-Document Pages

Sometimes, you may need to add pages that are not of the documentation type, such as a homepage. In this case, you can specify the relative address of the non-documentation Markdown file by editing the `pages` property in the `config.json` file.

```json
// config.json
{
  ...
  "pages": ["./index.md"],
  ...
}
```

In the above example, we set up a home page (`index.md`), which means the home page will only contain the top navigation component, and will not display the left document navigation and right article navigation for document type pages.

This approach allows you to easily add other types of pages and customize them as needed, without being constrained by the structure of the document page.