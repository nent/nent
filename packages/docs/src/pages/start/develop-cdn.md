
### VS Code

1. Create a folder called `.vscode` at the root of your project
2. <a href="https://unpkg.com/@nent/core/dist/custom-elements.json" download=".vscode/nent-elements.json">Download elements from CDN</a>
3. Save as `./.vscode/nent-elements.json`
4. Create a file inside the folder called `settings.json`
5. Add the following to the file

```json
{
  "html.customData": [
    "./nent-elements.json"
  ]
}
```

If `settings.json` already exists in your project, simply add the `html.customData` line to the root of the object.
