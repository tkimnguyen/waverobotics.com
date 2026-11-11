// SemanticUI-free pre-@plone/components
import React from 'react';

import { FormattedMessage, injectIntl } from 'react-intl';
import { UniversalLink } from '@plone/volto/components';
import { Container } from '@plone/components';
import { flattenToAppURL } from '@plone/volto/helpers';
import SocialLinks from '../SocialLinks/SocialLinks';

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = ({ intl }) => {
  const siteActions = [];
  return (
    <footer id="footer">
      <div className="footerDecoration"></div>
      <Container layout className="footer">
        <SocialLinks />
        <ul>
          {/* wrap in div for a11y reasons: listitem role cannot be on the <a> element directly */}
          {siteActions?.length
            ? siteActions.map((item) => (
                <li className="item" key={item.id}>
                  <UniversalLink
                    className="item"
                    href={flattenToAppURL(item.url)}
                  >
                    {item?.title}
                  </UniversalLink>
                </li>
              ))
            : null}
        </ul>
      </Container>
      <Container layout className="signature">
        <a className="item powered-by" href="https://plone.org">
          <FormattedMessage
            id="This site is built using Python and Plone."
            defaultMessage="This site is built using Python and Plone"
          />
        </a>
      </Container>
    </footer>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default injectIntl(Footer);
