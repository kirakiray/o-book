# Set Page Description

In order to optimize search engine rankings, it is necessary to set the description text for web pages. You can set the description attribute for the generated pages by adding the **desc** comment in Markdown files, as shown below:

```markdown
<!--desc: Enter the description text for the current page here-->
```

Once the above comments are added, the generated page will be included in the header of the target HTML file, as shown below: 

```html
<head>
...
  <meta name="description" content="Enter the description text for the current page here">
...
</head>
...
```

Through this method, you can provide relevant descriptions about the content of your page, which helps search engines understand the content of the page and improve search engine optimization effectiveness.