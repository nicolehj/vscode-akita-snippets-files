# Akita Snippets and File Templates for VS Code
<!-- Visual Studio Code TypeScript snippets for Akita. -->

This extension for Visual Studio Code adds **Akita snippets** for Angular for TypeScript, and allows  **quickly scaffold file or custom file templates** in VS Code project.

## > Snippets

All code snippets are based on https://datorama.github.io/akita/.

![Snippets usage](https://nicolehj.github.io/vscode-akita-snippets-files/assets/gif/snippets.gif)

### Snippets Prefixes

| Prefix | Description |
| :- | :- |
| ak-store | Akita Store Snippets |
| ak-query | Akita Query Snippets |
| ak-service | Akita Service Snippets |
| ak-entity-store | Akita Entity Store Snippets |
| ak-entity-query | Akita Entity Query Snippets |

---

## > File Templates

**Right click on a folder** in your current project. 
You can find multiple options been added to the context menu:

![Template page usage](https://nicolehj.github.io/vscode-akita-snippets-files/assets/gif/template_page.gif)
![Template store usage](https://nicolehj.github.io/vscode-akita-snippets-files/assets/gif/template_store.gif)

### File Templates Options

| Menu Options |
| :- |
| Akita Page |
| Akita Component |
| Akita Store |
| Akita Query |
| Akita Service |

### File Templates Configurations

![Configurations](https://nicolehj.github.io/vscode-akita-snippets-files/assets/images/setting.png)

** Override default configurations in `settings.json`:

```json
{
  "akita.menu.prefix": "app",

  // scss or css
  "akita.menu.style": "scss", 

  // custom template path
  "akita.menu.templatePath": "src/templates"
}
```

---

## > Custom Templates

**!!! Custom templates can be used for any languages you like 👍👍👍!!!**

You can [download][repository_templates] the templates from this [repository][repository_templates] and start using it. 

![Custom Templates](https://nicolehj.github.io/vscode-akita-snippets-files/assets/gif/template_custom.gif)

---

Hope this extension helps you as well, and let's make it better together.

## Enjoy it!

[repository_templates]:https://github.com/nicolehj/vscode-akita-file-templates
