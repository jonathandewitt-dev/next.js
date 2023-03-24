export const adoptedStylesSupported: boolean = !!(
  typeof window !== 'undefined' &&
  window.ShadowRoot?.prototype.hasOwnProperty('adoptedStyleSheets') &&
  window.CSSStyleSheet?.prototype.hasOwnProperty('replace')
);

// This should be a string if constructible stylesheets are not supported
export type AdaptedStyleSheet = CSSStyleSheet | string;

/**
 * A tagged template function that returns the provided CSS as a constructed stylesheet, or a plain string in case of no support.
 *
 * @example
 * ```ts
 * css`
 *   .content {
 *      color: green;
 *    }
 * `
 * ```
 */
export const css = (
  strArr: TemplateStringsArray,
  ...interpolated: unknown[]
): AdaptedStyleSheet => {
  const styles = strArr.reduce((styles, str, i) => {
    return styles + str + (interpolated[i] ?? '');
  }, '');
  if (adoptedStylesSupported) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    return sheet;
  }
  return styles;
};
