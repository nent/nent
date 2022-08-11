
### VS Code

1. [Install NENT locally](/start/npm)
2. Create a folder called `.vscode` at the root of your project
3. Create a file inside the folder called `settings.json`
4. Add the following to the file

```json
{
  "html.customData": [
    "./node_modules/@nent/core/dist/custom-elements.json"
  ]
}
```

If `settings.json` already exists in your project, simply add the `html.customData` line to the root of the object.
