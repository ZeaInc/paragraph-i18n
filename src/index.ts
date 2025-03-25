/**
 * Build styles
 */
import './index.css';

import { IconText } from '@codexteam/icons';
import makeFragment from './utils/makeFragment';

import type {
  API,
  ConversionConfig,
  HTMLPasteEvent,
  PasteConfig,
  SanitizerConfig,
  ToolConfig,
  ToolboxConfig,
} from '@editorjs/editorjs';

/**
 * Base Paragraph Block for the Editor.js.
 * Represents a regular text block
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */

/**
 * @typedef {object} Paragraph_i18n_Config
 * @property {string} placeholder - placeholder for the empty paragraph
 * @property {boolean} preserveBlank - Whether or not to keep blank paragraphs when saving editor data
 */
export interface Paragraph_i18n_Config extends ToolConfig {
  /**
   * Placeholder for the empty paragraph
   */
  placeholder?: string;

  /**
   * Whether or not to keep blank paragraphs when saving editor data
   */
  preserveBlank?: boolean;
}

type Language = string;

// A callback that leverages a translation service to translate text from one language to another.
// The function should return a promise that resolves with the translated text.
// e.g. https://cloud.google.com/translate/docs/reference/rest/v2/translate
// or https://libretranslate.com/
type LanguageTranslator = (
  q: string,
  source: Language,
  target: Language
) => Promise<string>;

interface ParagraphData {
  /**
   * Paragraph's content
   */
  text: string;
}

/**
 * @typedef {object} Paragraph_i18n_Data
 * @description Tool's input and output data format
 * @property {string} text — Paragraph's content. Can include HTML tags: <a><b><i>
 */
export interface Paragraph_i18n_Data {
  /**
   * Paragraph's content
   */

  translations: Record<string, ParagraphData>;
}

/**
 * @typedef {object} Paragraph_i18n_Params
 * @description Constructor params for the Paragraph tool, use to pass initial data and settings
 * @property {Paragraph_i18n_Data} data - Preload data for the paragraph.
 * @property {Paragraph_i18n_Config} config - The configuration for the paragraph.
 * @property {API} api - The Editor.js API.
 * @property {boolean} readOnly - Is paragraph is read-only.
 */
interface Paragraph_i18n_Params {
  /**
   * Initial data for the paragraph
   */
  data: Paragraph_i18n_Data;
  /**
   * Paragraph tool configuration
   */
  config: Paragraph_i18n_Config;
  /**
   * Editor.js API
   */
  api: API;
  /**
   * Is paragraph read-only.
   */
  readOnly: boolean;

  /**
   * Which language is currently active.
   */
  activeLanguage: 'en' | 'fr' | 'es';

  /**
   * Provide a trasnlation callback to the paragraph tool.
   */
  autoTranslate: LanguageTranslator;
}

/**
 * @typedef {object} ParagraphCSS
 * @description CSS classes names
 * @property {string} block - Editor.js CSS Class for block
 * @property {string} wrapper - Paragraph CSS Class
 */
interface ParagraphCSS {
  /**
   * Editor.js CSS Class for block
   */
  block: string;
  /**
   * Paragraph CSS Class
   */
  wrapper: string;
}

export default class Paragraph_i18n {
  /**
   * Default placeholder for Paragraph Tool
   *
   * @returns {string}
   * @class
   */
  static get DEFAULT_PLACEHOLDER() {
    return '';
  }

  /**
   * The Editor.js API
   */
  api: API;

  /**
   * Is Paragraph Tool read-only
   */
  readOnly: boolean;

  activeLanguage: 'en' | 'fr' | 'es';

  autoTranslate: LanguageTranslator;

  /**
   * Paragraph Tool's CSS classes
   */
  private _CSS: ParagraphCSS;

  /**
   * Placeholder for Paragraph Tool
   */
  private _placeholder: string;

  /**
   * Paragraph's data
   */
  private _data: Paragraph_i18n_Data = { translations: {} };

  /**
   * Paragraph's main Element
   */
  private _element: HTMLDivElement | null;

  /**
   * Whether or not to keep blank paragraphs when saving editor data
   */
  private _preserveBlank: boolean;

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {Paragraph_i18n_Data} params.data - previously saved data
   * @param {Paragraph_i18n_Config} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({
    data,
    config,
    api,
    readOnly,
    activeLanguage,
    autoTranslate,
  }: Paragraph_i18n_Params) {
    this.api = api;
    this.readOnly = readOnly;
    this.activeLanguage = activeLanguage;
    this.autoTranslate = autoTranslate;

    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-paragraph',
    };

    if (!this.readOnly) {
      this.onKeyUp = this.onKeyUp.bind(this);
    }

    /**
     * Placeholder for paragraph if it is first Block
     *
     * @type {string}
     */
    this._placeholder = config.placeholder
      ? config.placeholder
      : Paragraph_i18n.DEFAULT_PLACEHOLDER;

    if (data) {
      // Upgrade non i18n data to i18n data
      if (data.translations === undefined) {
        this._data.translations[this.activeLanguage] =
          data as unknown as ParagraphData;
      } else {
        this._data = data;
      }
    }
    this._element = null;
    this._preserveBlank = config.preserveBlank ?? false;
  }

  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(e: KeyboardEvent): void {
    if (e.code !== 'Backspace' && e.code !== 'Delete') {
      return;
    }

    if (!this._element) {
      return;
    }

    const { textContent } = this._element;

    if (textContent === '') {
      this._element.innerHTML = '';
    }
  }

  /**
   * Create Tool's view
   *
   * @returns {HTMLDivElement}
   * @private
   */
  drawView(): HTMLDivElement {
    const div = document.createElement('DIV');

    div.classList.add(this._CSS.wrapper, this._CSS.block);
    div.contentEditable = 'false';
    div.dataset.placeholderActive = this.api.i18n.t(this._placeholder);

    if (
      this._data.translations[this.activeLanguage] &&
      this._data.translations[this.activeLanguage].text
    ) {
      div.innerHTML = this._data.translations[this.activeLanguage].text;
    }

    if (!this.readOnly) {
      div.contentEditable = 'true';
      div.addEventListener('keyup', this.onKeyUp);
    }

    /**
     * bypass property 'align' required in html div element
     */
    return div as HTMLDivElement;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render(): HTMLDivElement {
    this._element = this.drawView();

    return this._element;
  }

  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {Paragraph_i18n_Data} data
   * @public
   */
  merge(data: Paragraph_i18n_Data): void {
    if (!this._element) {
      return;
    }

    this._data.translations[this.activeLanguage].text +=
      data.translations[this.activeLanguage].text;

    /**
     * We use appendChild instead of innerHTML to keep the links of the existing nodes
     * (for example, shadow caret)
     */
    const fragment = makeFragment(data.translations[this.activeLanguage].text);

    this._element.appendChild(fragment);

    this._element.normalize();
  }

  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {Paragraph_i18n_Data} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(savedData: Paragraph_i18n_Data): boolean {
    if (
      savedData.translations[this.activeLanguage].text.trim() === '' &&
      !this._preserveBlank
    ) {
      return false;
    }

    return true;
  }

  async translate(targetLanguage: Language): Promise<boolean> {
    if (!this.autoTranslate) {
      return false;
    }

    const text = this._data.translations[this.activeLanguage].text;
    const translatedText = await this.autoTranslate(
      text,
      this.activeLanguage,
      targetLanguage
    );
    if (!this._data.translations[targetLanguage]) {
      this._data.translations[targetLanguage] = { text: '' };
    }
    this._data.translations[targetLanguage].text = translatedText;

    return true;
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {Paragraph_i18n_Data} - saved data
   * @public
   */
  save(toolsContent: HTMLDivElement): Paragraph_i18n_Data {
    return this._data;
    // return {
    //   text: toolsContent.innerHTML,
    // };
  }

  /**
   * On paste callback fired from Editor.
   *
   * @param {HTMLPasteEvent} event - event with pasted data
   */
  onPaste(event: HTMLPasteEvent): void {
    const data = {
      text: event.detail.data.innerHTML,
    };

    this._data.translations[this.activeLanguage] = data;

    /**
     * We use requestAnimationFrame for performance purposes
     */
    window.requestAnimationFrame(() => {
      if (!this._element) {
        return;
      }
      this._element.innerHTML =
        this._data.translations[this.activeLanguage].text || '';
    });
  }

  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   * @returns {ConversionConfig}
   */
  static get conversionConfig(): ConversionConfig {
    return {
      export: 'text', // to convert Paragraph to other block, use 'text' property of saved data
      import: 'text', // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }

  /**
   * Sanitizer rules
   * @returns {SanitizerConfig} - Edtior.js sanitizer config
   */
  static get sanitize(): SanitizerConfig {
    return {
      text: {
        br: true,
      },
    };
  }

  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported(): boolean {
    return true;
  }

  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {PasteConfig} - Paragraph Paste Setting
   */
  static get pasteConfig(): PasteConfig {
    return {
      tags: ['P'],
    };
  }

  /**
   * Icon and title for displaying at the Toolbox
   *
   * @returns {ToolboxConfig} - Paragraph Toolbox Setting
   */
  static get toolbox(): ToolboxConfig {
    return {
      icon: IconText,
      title: 'Text',
    };
  }
}
