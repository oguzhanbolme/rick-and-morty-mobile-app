export declare type Parsed<V> = {
    start: number;
    end: number;
    value: V;
};
export declare type ARGB = number;
export declare type URL = string;
export declare type Angle = number;
export interface Unit<T> {
    value: number;
    unit: string;
}
export declare type Length = Unit<'px' | 'dip'>;
export declare type Percentage = Unit<'%'>;
export declare type LengthPercentage = Length | Percentage;
export declare type Keyword = string;
export interface ColorStop {
    argb: ARGB;
    offset?: LengthPercentage;
}
export interface LinearGradient {
    angle: number;
    colors: ColorStop[];
}
export interface Background {
    readonly color?: number;
    readonly image?: URL | LinearGradient;
    readonly repeat?: BackgroundRepeat;
    readonly position?: BackgroundPosition;
    readonly size?: BackgroundSize;
}
export declare type BackgroundRepeat = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
export declare type BackgroundSize = 'auto' | 'cover' | 'contain' | {
    x: LengthPercentage;
    y: 'auto' | LengthPercentage;
};
export declare type HorizontalAlign = 'left' | 'center' | 'right';
export declare type VerticalAlign = 'top' | 'center' | 'bottom';
export interface HorizontalAlignWithOffset {
    readonly align: 'left' | 'right';
    readonly offset: LengthPercentage;
}
export interface VerticalAlignWithOffset {
    readonly align: 'top' | 'bottom';
    readonly offset: LengthPercentage;
}
export interface BackgroundPosition {
    readonly x: HorizontalAlign | HorizontalAlignWithOffset;
    readonly y: VerticalAlign | VerticalAlignWithOffset;
    text?: string;
}
export declare function parseURL(text: string, start?: number): Parsed<URL>;
export declare function parseHexColor(text: string, start?: number): Parsed<ARGB>;
export declare function parseRGBColor(text: string, start?: number): Parsed<ARGB>;
export declare function parseRGBAColor(text: string, start?: number): Parsed<ARGB>;
export declare function convertHSLToRGBColor(hue: number, saturation: number, lightness: number): {
    r: number;
    g: number;
    b: number;
};
export declare function parseHSLColor(text: string, start?: number): Parsed<ARGB>;
export declare function parseHSLAColor(text: string, start?: number): Parsed<ARGB>;
export declare enum colors {
    transparent = 0,
    aliceblue = 4293982463,
    antiquewhite = 4294634455,
    aqua = 4278255615,
    aquamarine = 4286578644,
    azure = 4293984255,
    beige = 4294309340,
    bisque = 4294960324,
    black = 4278190080,
    blanchedalmond = 4294962125,
    blue = 4278190335,
    blueviolet = 4287245282,
    brown = 4289014314,
    burlywood = 4292786311,
    cadetblue = 4284456608,
    chartreuse = 4286578432,
    chocolate = 4291979550,
    coral = 4294934352,
    cornflowerblue = 4284782061,
    cornsilk = 4294965468,
    crimson = 4292613180,
    cyan = 4278255615,
    darkblue = 4278190219,
    darkcyan = 4278225803,
    darkgoldenrod = 4290283019,
    darkgray = 4289309097,
    darkgreen = 4278215680,
    darkgrey = 4289309097,
    darkkhaki = 4290623339,
    darkmagenta = 4287299723,
    darkolivegreen = 4283788079,
    darkorange = 4294937600,
    darkorchid = 4288230092,
    darkred = 4287299584,
    darksalmon = 4293498490,
    darkseagreen = 4287609999,
    darkslateblue = 4282924427,
    darkslategray = 4281290575,
    darkslategrey = 4281290575,
    darkturquoise = 4278243025,
    darkviolet = 4287889619,
    deeppink = 4294907027,
    deepskyblue = 4278239231,
    dimgray = 4285098345,
    dimgrey = 4285098345,
    dodgerblue = 4280193279,
    firebrick = 4289864226,
    floralwhite = 4294966000,
    forestgreen = 4280453922,
    fuchsia = 4294902015,
    gainsboro = 4292664540,
    ghostwhite = 4294506751,
    gold = 4294956800,
    goldenrod = 4292519200,
    gray = 4286611584,
    green = 4278222848,
    greenyellow = 4289593135,
    grey = 4286611584,
    honeydew = 4293984240,
    hotpink = 4294928820,
    indianred = 4291648604,
    indigo = 4283105410,
    ivory = 4294967280,
    khaki = 4293977740,
    lavender = 4293322490,
    lavenderblush = 4294963445,
    lawngreen = 4286381056,
    lemonchiffon = 4294965965,
    lightblue = 4289583334,
    lightcoral = 4293951616,
    lightcyan = 4292935679,
    lightgoldenrodyellow = 4294638290,
    lightgray = 4292072403,
    lightgreen = 4287688336,
    lightgrey = 4292072403,
    lightpink = 4294948545,
    lightsalmon = 4294942842,
    lightseagreen = 4280332970,
    lightskyblue = 4287090426,
    lightslategray = 4286023833,
    lightslategrey = 4286023833,
    lightsteelblue = 4289774814,
    lightyellow = 4294967264,
    lime = 4278255360,
    limegreen = 4281519410,
    linen = 4294635750,
    magenta = 4294902015,
    maroon = 4286578688,
    mediumaquamarine = 4284927402,
    mediumblue = 4278190285,
    mediumorchid = 4290401747,
    mediumpurple = 4287852763,
    mediumseagreen = 4282168177,
    mediumslateblue = 4286277870,
    mediumspringgreen = 4278254234,
    mediumturquoise = 4282962380,
    mediumvioletred = 4291237253,
    midnightblue = 4279834992,
    mintcream = 4294311930,
    mistyrose = 4294960353,
    moccasin = 4294960309,
    navajowhite = 4294958765,
    navy = 4278190208,
    oldlace = 4294833638,
    olive = 4286611456,
    olivedrab = 4285238819,
    orange = 4294944000,
    orangered = 4294919424,
    orchid = 4292505814,
    palegoldenrod = 4293847210,
    palegreen = 4288215960,
    paleturquoise = 4289720046,
    palevioletred = 4292571283,
    papayawhip = 4294963157,
    peachpuff = 4294957753,
    peru = 4291659071,
    pink = 4294951115,
    plum = 4292714717,
    powderblue = 4289781990,
    purple = 4286578816,
    rebeccapurple = 4284887961,
    red = 4294901760,
    rosybrown = 4290547599,
    royalblue = 4282477025,
    saddlebrown = 4287317267,
    salmon = 4294606962,
    sandybrown = 4294222944,
    seagreen = 4281240407,
    seashell = 4294964718,
    sienna = 4288696877,
    silver = 4290822336,
    skyblue = 4287090411,
    slateblue = 4285160141,
    slategray = 4285563024,
    slategrey = 4285563024,
    snow = 4294966010,
    springgreen = 4278255487,
    steelblue = 4282811060,
    tan = 4291998860,
    teal = 4278222976,
    thistle = 4292394968,
    tomato = 4294927175,
    turquoise = 4282441936,
    violet = 4293821166,
    wheat = 4294303411,
    white = 4294967295,
    whitesmoke = 4294309365,
    yellow = 4294967040,
    yellowgreen = 4288335154
}
export declare function parseColorKeyword(value: any, start: number, keyword?: Parsed<string>): Parsed<ARGB>;
export declare function parseColor(value: string, start?: number, keyword?: Parsed<string>): Parsed<ARGB>;
export declare function parseRepeat(value: string, start?: number, keyword?: Parsed<string>): Parsed<BackgroundRepeat>;
export declare function parseUnit(text: string, start?: number): Parsed<Unit<string>>;
export declare function parsePercentageOrLength(text: string, start?: number): Parsed<LengthPercentage>;
export declare function parseAngle(value: string, start?: number): Parsed<Angle>;
export declare function parseBackgroundSize(value: string, start?: number, keyword?: Parsed<string>): Parsed<BackgroundSize>;
export declare function parseBackgroundPosition(text: string, start?: number, keyword?: Parsed<string>): Parsed<BackgroundPosition>;
export declare function parseColorStop(text: string, start?: number): Parsed<ColorStop>;
export declare function parseLinearGradient(text: string, start?: number): Parsed<LinearGradient>;
export declare function parseBackground(text: string, start?: number): Parsed<Background>;
export declare type Combinator = '+' | '~' | '>' | ' ';
export interface UniversalSelector {
    type: '*';
}
export interface TypeSelector {
    type: '';
    identifier: string;
}
export interface ClassSelector {
    type: '.';
    identifier: string;
}
export interface IdSelector {
    type: '#';
    identifier: string;
}
export interface PseudoClassSelector {
    type: ':';
    identifier: string;
}
export declare type AttributeSelectorTest = '=' | '^=' | '$=' | '*=' | '=' | '~=' | '|=';
export interface AttributeSelector {
    type: '[]';
    property: string;
    test?: AttributeSelectorTest;
    value?: string;
}
export declare type SimpleSelector = UniversalSelector | TypeSelector | ClassSelector | IdSelector | PseudoClassSelector | AttributeSelector;
export declare type SimpleSelectorSequence = SimpleSelector[];
export declare type SelectorCombinatorPair = [SimpleSelectorSequence, Combinator];
export declare type Selector = SelectorCombinatorPair[];
export declare function parseUniversalSelector(text: string, start?: number): Parsed<UniversalSelector>;
export declare function parseSimpleIdentifierSelector(text: string, start?: number): Parsed<TypeSelector | ClassSelector | IdSelector | PseudoClassSelector>;
export declare function parseAttributeSelector(text: string, start: number): Parsed<AttributeSelector>;
export declare function parseSimpleSelector(text: string, start?: number): Parsed<SimpleSelector>;
export declare function parseSimpleSelectorSequence(text: string, start: number): Parsed<SimpleSelector[]>;
export declare function parseCombinator(text: string, start?: number): Parsed<Combinator>;
export declare function parseSelector(text: string, start?: number): Parsed<Selector>;
export interface Stylesheet {
    rules: Rule[];
}
export declare type Rule = QualifiedRule | AtRule;
export interface AtRule {
    type: 'at-rule';
    name: string;
    prelude: InputToken[];
    block: SimpleBlock;
}
export interface QualifiedRule {
    type: 'qualified-rule';
    prelude: InputToken[];
    block: SimpleBlock;
}
declare type InputToken = '(' | ')' | '{' | '}' | '[' | ']' | ':' | ';' | ',' | ' ' | '^=' | '|=' | '$=' | '*=' | '~=' | '<!--' | '-->' | undefined | /* <EOF-token> */ InputTokenObject | FunctionInputToken | FunctionToken | SimpleBlock | AtKeywordToken;
export declare const enum TokenObjectType {
    /**
     * <string-token>
     */
    string = 1,
    /**
     * <delim-token>
     */
    delim = 2,
    /**
     * <number-token>
     */
    number = 3,
    /**
     * <percentage-token>
     */
    percentage = 4,
    /**
     * <dimension-token>
     */
    dimension = 5,
    /**
     * <ident-token>
     */
    ident = 6,
    /**
     * <url-token>
     */
    url = 7,
    /**
     * <function-token>
     * This is a token indicating a function's leading: <ident-token>(
     */
    functionToken = 8,
    /**
     * <simple-block>
     */
    simpleBlock = 9,
    /**
     * <comment-token>
     */
    comment = 10,
    /**
     * <at-keyword-token>
     */
    atKeyword = 11,
    /**
     * <hash-token>
     */
    hash = 12,
    /**
     * <function>
     * This is a complete consumed function: <function-token>([<component-value> [, <component-value>]*])")"
     */
    function = 14
}
interface InputTokenObject {
    type: TokenObjectType;
    text: string;
}
/**
 * This is a "<ident>(" token.
 */
interface FunctionInputToken extends InputTokenObject {
    name: string;
}
/**
 * This is a completely parsed function like "<ident>([component [, component]*])".
 */
interface FunctionToken extends FunctionInputToken {
    components: any[];
}
interface SimpleBlock extends InputTokenObject {
    associatedToken: InputToken;
    values: InputToken[];
}
interface AtKeywordToken extends InputTokenObject {
}
/**
 * CSS parser following relatively close:
 * CSS Syntax Module Level 3
 * https://www.w3.org/TR/css-syntax-3/
 */
export declare class CSS3Parser {
    private text;
    private nextInputCodePointIndex;
    private reconsumedInputToken;
    private topLevelFlag;
    constructor(text: string);
    /**
     * For testing purposes.
     * This method allows us to run and assert the proper working of the tokenizer.
     */
    tokenize(): InputToken[];
    /**
     * 4.3.1. Consume a token
     * https://www.w3.org/TR/css-syntax-3/#consume-a-token
     */
    private consumeAToken;
    private consumeADelimToken;
    private consumeAWhitespace;
    private consumeAHashToken;
    private consumeCDO;
    private consumeCDC;
    private consumeAMatchToken;
    /**
     * 4.3.2. Consume a numeric token
     * https://www.w3.org/TR/css-syntax-3/#consume-a-numeric-token
     */
    private consumeANumericToken;
    /**
     * 4.3.3. Consume an ident-like token
     * https://www.w3.org/TR/css-syntax-3/#consume-an-ident-like-token
     */
    private consumeAnIdentLikeToken;
    /**
     * 4.3.4. Consume a string token
     * https://www.w3.org/TR/css-syntax-3/#consume-a-string-token
     */
    private consumeAStringToken;
    /**
     * 4.3.5. Consume a url token
     * https://www.w3.org/TR/css-syntax-3/#consume-a-url-token
     */
    private consumeAURLToken;
    /**
     * 4.3.11. Consume a name
     * https://www.w3.org/TR/css-syntax-3/#consume-a-name
     */
    private consumeAName;
    private consumeAtKeyword;
    private consumeAComment;
    private reconsumeTheCurrentInputToken;
    /**
     * 5.3.1. Parse a stylesheet
     * https://www.w3.org/TR/css-syntax-3/#parse-a-stylesheet
     */
    parseAStylesheet(): Stylesheet;
    /**
     * 5.4.1. Consume a list of rules
     * https://www.w3.org/TR/css-syntax-3/#consume-a-list-of-rules
     */
    consumeAListOfRules(): Rule[];
    /**
     * 5.4.2. Consume an at-rule
     * https://www.w3.org/TR/css-syntax-3/#consume-an-at-rule
     */
    consumeAnAtRule(): AtRule;
    /**
     * 5.4.3. Consume a qualified rule
     * https://www.w3.org/TR/css-syntax-3/#consume-a-qualified-rule
     */
    consumeAQualifiedRule(): QualifiedRule;
    /**
     * 5.4.6. Consume a component value
     * https://www.w3.org/TR/css-syntax-3/#consume-a-component-value
     */
    private consumeAComponentValue;
    /**
     * 5.4.7. Consume a simple block
     * https://www.w3.org/TR/css-syntax-3/#consume-a-simple-block
     */
    private consumeASimpleBlock;
    /**
     * 5.4.8. Consume a function
     * https://www.w3.org/TR/css-syntax-3/#consume-a-function
     */
    private consumeAFunction;
}
/**
 * Consume a CSS3 parsed stylesheet and convert the rules and selectors to the
 * NativeScript internal JSON representation.
 */
export declare class CSSNativeScript {
    parseStylesheet(stylesheet: Stylesheet): any;
    private parseRules;
    private parseRule;
    private parseAtRule;
    private parseQualifiedRule;
    private ruleBlockToDeclarations;
    private preludeToSelectorsStringArray;
}
export {};
