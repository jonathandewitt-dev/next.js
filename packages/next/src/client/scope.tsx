import React from 'react';
import { AdaptedStyleSheet, adoptedStylesSupported } from './css-utils';
import Template from './template';

export type ScopeProps = React.PropsWithChildren<{
  /**
   * The stylesheet to encapsulate. Should be created by the exported `css` tagged template function.
   */
  stylesheet?: AdaptedStyleSheet;
  /**
   * Multiple stylesheets to encapsulate. Each should be created by the exported `css` tagged template function.
   *
   * @defaultValue `[]`
   */
  stylesheets?: AdaptedStyleSheet[];
}>;

type ExtractedStyleSheets = {
  cssStrings: string[];
  cssStyleSheets: CSSStyleSheet[];
};

const extractStyleSheets = (
  stylesheets: AdaptedStyleSheet[],
): ExtractedStyleSheets => {
  const cssStrings = [];
  const cssStyleSheets = [];
  for (const stylesheet of stylesheets) {
    if (typeof stylesheet === 'string') {
      cssStrings.push(stylesheet);
    } else if (adoptedStylesSupported && stylesheet instanceof CSSStyleSheet) {
      cssStyleSheets.push(stylesheet);
    } else {
      console.warn(
        'An invalid stylesheet was passed to `<Scope>`, skipping...',
      );
    }
  }
  return { cssStrings, cssStyleSheets };
};

const Scope = React.forwardRef<HTMLDivElement, ScopeProps>(
  (props, forwardedRef) => {
    const { children, stylesheet, stylesheets = [], ...forwardedProps } = props;

    const allStyleSheets = stylesheet
      ? [stylesheet, ...stylesheets]
      : stylesheets;

    const { cssStrings, cssStyleSheets } = extractStyleSheets(allStyleSheets);

    return (
      <div ref={forwardedRef} {...forwardedProps}>
        <Template shadowrootmode="open" adoptedStyleSheets={cssStyleSheets}>
          {cssStrings.map((styles) => (
            <style key={styles}>{styles}</style>
          ))}
          {children}
        </Template>
      </div>
    );
  },
);

export default Scope;
