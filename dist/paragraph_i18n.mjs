(function(){"use strict";try{if(typeof document<"u"){var e=document.createElement("style");e.appendChild(document.createTextNode(".ce-paragraph{line-height:1.6em;outline:none}.ce-block:only-of-type .ce-paragraph[data-placeholder-active]:empty:before,.ce-block:only-of-type .ce-paragraph[data-placeholder-active][data-empty=true]:before{content:attr(data-placeholder-active)}.ce-paragraph p:first-of-type{margin-top:0}.ce-paragraph p:last-of-type{margin-bottom:0}")),document.head.appendChild(e)}}catch(a){console.error("vite-plugin-css-injected-by-js",a)}})();
const o = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 9V7.2C8 7.08954 8.08954 7 8.2 7L12 7M16 9V7.2C16 7.08954 15.9105 7 15.8 7L12 7M12 7L12 17M12 17H10M12 17H14"/></svg>';
function h(r) {
  const t = document.createElement("div");
  t.innerHTML = r.trim();
  const e = document.createDocumentFragment();
  return e.append(...Array.from(t.childNodes)), e;
}
/**
 * Base Paragraph Block for the Editor.js.
 * Represents a regular text block
 *
 * @author CodeX (team@codex.so)
 * @copyright CodeX 2018
 * @license The MIT License (MIT)
 */
let i = "en";
const n = [];
class s {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} params - constructor params
   * @param {Paragraph_i18n_Data} params.data - previously saved data
   * @param {Paragraph_i18n_Config} params.config - user config for Tool
   * @param {object} params.api - editor.js api
   * @param {boolean} readOnly - read only mode flag
   */
  constructor({ data: t, config: e, api: a, readOnly: l }) {
    this.activeLanguage = "en", this.autoTranslate = null, this._data = { translations: {} }, this.api = a, this.readOnly = l, this._CSS = {
      block: this.api.styles.block,
      wrapper: "ce-paragraph"
    }, this.readOnly || (this.onKeyUp = this.onKeyUp.bind(this)), this._placeholder = e.placeholder ? e.placeholder : s.DEFAULT_PLACEHOLDER, t ? t.translations === void 0 ? this._data.translations[this.activeLanguage] = t.text ?? "" : this._data.translations = t.translations : this._data.translations[this.activeLanguage] = "", this._data.translations[this.activeLanguage] == null && (this._data.translations[this.activeLanguage] = ""), this._element = null, this._preserveBlank = e.preserveBlank ?? !1, n.push(() => {
      this.activeLanguage = i, window.requestAnimationFrame(() => {
        this._element && (this._element.innerHTML = this._data.translations[this.activeLanguage] || "");
      });
    });
  }
  /**
   * Default placeholder for Paragraph Tool
   *
   * @returns {string}
   * @class
   */
  static get DEFAULT_PLACEHOLDER() {
    return "";
  }
  /**
   * Check if text content is empty and set empty string to inner html.
   * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
   *
   * @param {KeyboardEvent} e - key up event
   */
  onKeyUp(t) {
    if (t.code !== "Backspace" && t.code !== "Delete" || !this._element)
      return;
    const { textContent: e } = this._element;
    e === "" && (this._element.innerHTML = "");
  }
  /**
   * Create Tool's view
   *
   * @returns {HTMLDivElement}
   * @private
   */
  drawView() {
    const t = document.createElement("DIV");
    return t.classList.add(this._CSS.wrapper, this._CSS.block), t.contentEditable = "false", t.dataset.placeholderActive = this.api.i18n.t(this._placeholder), this._data.translations[this.activeLanguage] && (t.innerHTML = this._data.translations[this.activeLanguage]), this.readOnly || (t.contentEditable = "true", t.addEventListener("keyup", this.onKeyUp)), t;
  }
  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement}
   */
  render() {
    return this._element = this.drawView(), this._element;
  }
  /**
   * Method that specified how to merge two Text blocks.
   * Called by Editor.js by backspace at the beginning of the Block
   *
   * @param {Paragraph_i18n_Data} data
   * @public
   */
  merge(t) {
    if (!this._element)
      return;
    this._data.translations[this.activeLanguage] += t.translations[this.activeLanguage];
    const e = h(t.translations[this.activeLanguage]);
    this._element.appendChild(e), this._element.normalize();
  }
  /**
   * Validate Paragraph block data:
   * - check for emptiness
   *
   * @param {Paragraph_i18n_Data} savedData — data received after saving
   * @returns {boolean} false if saved data is not correct, otherwise true
   * @public
   */
  validate(t) {
    return console.log("validate"), !(t.translations[this.activeLanguage].trim() === "" && !this._preserveBlank);
  }
  async translate(t) {
    if (!this.autoTranslate)
      return !1;
    const e = this._data.translations[this.activeLanguage], a = await this.autoTranslate(
      e,
      this.activeLanguage,
      t
    );
    return this._data.translations[t] || (this._data.translations[t] = ""), this._data.translations[t] = a, !0;
  }
  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
   * @returns {Paragraph_i18n_Data} - saved data
   * @public
   */
  save(t) {
    return this._data.translations[this.activeLanguage] = t.innerHTML, this._data;
  }
  /**
   * On paste callback fired from Editor.
   *
   * @param {HTMLPasteEvent} event - event with pasted data
   */
  onPaste(t) {
    const e = {
      text: t.detail.data.innerHTML
    };
    this._data.translations[this.activeLanguage] = e.text, window.requestAnimationFrame(() => {
      this._element && (this._element.innerHTML = this._data.translations[this.activeLanguage] || "");
    });
  }
  /**
   * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
   * @returns {ConversionConfig}
   */
  static get conversionConfig() {
    return {
      export: "text",
      // to convert Paragraph to other block, use 'text' property of saved data
      import: "text"
      // to covert other block's exported string to Paragraph, fill 'text' property of tool data
    };
  }
  /**
   * Sanitizer rules
   * @returns {SanitizerConfig} - Edtior.js sanitizer config
   */
  static get sanitize() {
    return {
      text: {
        br: !0
      }
    };
  }
  /**
   * Returns true to notify the core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return !0;
  }
  /**
   * Used by Editor paste handling API.
   * Provides configuration to handle P tags.
   *
   * @returns {PasteConfig} - Paragraph Paste Setting
   */
  static get pasteConfig() {
    return {
      tags: ["P"]
    };
  }
  /**
   * Icon and title for displaying at the Toolbox
   *
   * @returns {ToolboxConfig} - Paragraph Toolbox Setting
   */
  static get toolbox() {
    return {
      icon: o,
      title: "Text"
    };
  }
  static getActiveLanguage() {
    return i;
  }
  static setActiveLanguage(t) {
    i = t, n.forEach((e) => {
      e();
    });
  }
}
export {
  s as default
};
