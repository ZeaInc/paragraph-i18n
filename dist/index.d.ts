import { API, ConversionConfig, HTMLPasteEvent, PasteConfig, SanitizerConfig, ToolConfig, ToolboxConfig } from '@editorjs/editorjs';

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
type LanguageTranslator = (q: string, source: Language, target: Language) => Promise<string>;
/**
 * @typedef {object} Paragraph_i18n_Data
 * @description Tool's input and output data format
 * @property {string} text — Paragraph's content. Can include HTML tags: <a><b><i>
 */
export interface Paragraph_i18n_Data {
    /**
     * Paragraph's content
     */
    translations: Record<string, string>;
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
export default class Paragraph_i18n {
    /**
     * Default placeholder for Paragraph Tool
     *
     * @returns {string}
     * @class
     */
    static get DEFAULT_PLACEHOLDER(): string;
    /**
     * The Editor.js API
     */
    api: API;
    /**
     * Is Paragraph Tool read-only
     */
    readOnly: boolean;
    activeLanguage: Language;
    autoTranslate: LanguageTranslator | null;
    /**
     * Paragraph Tool's CSS classes
     */
    private _CSS;
    /**
     * Placeholder for Paragraph Tool
     */
    private _placeholder;
    /**
     * Paragraph's data
     */
    private _data;
    /**
     * Paragraph's main Element
     */
    private _element;
    /**
     * Whether or not to keep blank paragraphs when saving editor data
     */
    private _preserveBlank;
    /**
     * Render plugin`s main Element and fill it with saved data
     *
     * @param {object} params - constructor params
     * @param {Paragraph_i18n_Data} params.data - previously saved data
     * @param {Paragraph_i18n_Config} params.config - user config for Tool
     * @param {object} params.api - editor.js api
     * @param {boolean} readOnly - read only mode flag
     */
    constructor({ data, config, api, readOnly }: Paragraph_i18n_Params);
    /**
     * Check if text content is empty and set empty string to inner html.
     * We need this because some browsers (e.g. Safari) insert <br> into empty contenteditanle elements
     *
     * @param {KeyboardEvent} e - key up event
     */
    onKeyUp(e: KeyboardEvent): void;
    /**
     * Create Tool's view
     *
     * @returns {HTMLDivElement}
     * @private
     */
    drawView(): HTMLDivElement;
    /**
     * Return Tool's view
     *
     * @returns {HTMLDivElement}
     */
    render(): HTMLDivElement;
    /**
     * Method that specified how to merge two Text blocks.
     * Called by Editor.js by backspace at the beginning of the Block
     *
     * @param {Paragraph_i18n_Data} data
     * @public
     */
    merge(data: Paragraph_i18n_Data): void;
    /**
     * Validate Paragraph block data:
     * - check for emptiness
     *
     * @param {Paragraph_i18n_Data} savedData — data received after saving
     * @returns {boolean} false if saved data is not correct, otherwise true
     * @public
     */
    validate(savedData: Paragraph_i18n_Data): boolean;
    translate(targetLanguage: Language): Promise<boolean>;
    /**
     * Extract Tool's data from the view
     *
     * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
     * @returns {Paragraph_i18n_Data} - saved data
     * @public
     */
    save(toolsContent: HTMLDivElement): Paragraph_i18n_Data;
    /**
     * On paste callback fired from Editor.
     *
     * @param {HTMLPasteEvent} event - event with pasted data
     */
    onPaste(event: HTMLPasteEvent): void;
    /**
     * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
     * @returns {ConversionConfig}
     */
    static get conversionConfig(): ConversionConfig;
    /**
     * Sanitizer rules
     * @returns {SanitizerConfig} - Edtior.js sanitizer config
     */
    static get sanitize(): SanitizerConfig;
    /**
     * Returns true to notify the core that read-only mode is supported
     *
     * @returns {boolean}
     */
    static get isReadOnlySupported(): boolean;
    /**
     * Used by Editor paste handling API.
     * Provides configuration to handle P tags.
     *
     * @returns {PasteConfig} - Paragraph Paste Setting
     */
    static get pasteConfig(): PasteConfig;
    /**
     * Icon and title for displaying at the Toolbox
     *
     * @returns {ToolboxConfig} - Paragraph Toolbox Setting
     */
    static get toolbox(): ToolboxConfig;
    static getActiveLanguage(): Language;
    static setActiveLanguage(value: string): void;
}
export {};
