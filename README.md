![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Paragraph_i18n Tool for Editor.js

Basic text Tool for the [Editor.js](https://ifmo.su/editor).

## Installation

Get the package

```shell
yarn add @zeainc/editorjs_paragraph_i18n
```

Include module at your application

```javascript
import Paragraph_i18n from '@zeainc/editorjs_paragraph_i18n';
```

## Usage

If you want to connect Paragraph_i18n, do not forget modify the [`defaultBlock`](https://editorjs.io/configuration#change-the-default-block)
option of the editor config.

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = new EditorJS({
  ...

  tools: {
    ...
    paragraph: {
      class: Paragraph_i18n,
      inlineToolbar: true,
    },
  }

  ...
});
```

## Config Params

The Paragraph_i18n Tool supports these configuration parameters:

| Field         | Type      | Description                                                                                |
| ------------- | --------- | ------------------------------------------------------------------------------------------ |
| placeholder   | `string`  | The placeholder. Will be shown only in the first paragraph when the whole editor is empty. |
| preserveBlank | `boolean` | (default: `false`) Whether or not to keep blank paragraphs when saving editor data         |

## Output data

| Field | Type     | Description      |
| ----- | -------- | ---------------- |
| text  | `string` | paragraph's text |

```json
{
  "type": "paragraph_i18n",
  "data": {
    "en": {
      "text": "Check out our projects on a <a href=\"https://github.com/codex-team\">GitHub page</a>."
    },
    "fr": {
      "text": "Découvrez nos projets sur <a href=\"https://github.com/codex-team\">GitHub page</a>."
    }
  }
}
```
