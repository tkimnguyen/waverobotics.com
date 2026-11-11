/**
 * Social network links for the footer, from the site's `social_actions`
 * portal actions (Site Setup > Actions).
 *
 * Adapted from FooterLinks in @plonegovbr/volto-network-block 0.2.0 (MIT),
 * which has no Volto 19 release. Same markup and class names, so the existing
 * footer styles still apply. Icons: Font Awesome Free (CC BY 4.0).
 */
import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { List } from 'semantic-ui-react';
import cx from 'classnames';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';
import facebookIcon from '../../icons/social/facebook.svg';
import githubIcon from '../../icons/social/github.svg';
import instagramIcon from '../../icons/social/instagram.svg';
import linkedinIcon from '../../icons/social/linkedin.svg';
import mastodonIcon from '../../icons/social/mastodon.svg';
import twitterIcon from '../../icons/social/twitter.svg';
import youtubeIcon from '../../icons/social/youtube.svg';

export const SOCIAL_ICONS = {
  facebook: facebookIcon,
  github: githubIcon,
  instagram: instagramIcon,
  linkedin: linkedinIcon,
  mastodon: mastodonIcon,
  twitter: twitterIcon,
  youtube: youtubeIcon,
};

const SocialLinks = ({ align = 'left' }) => {
  const networks = useSelector(
    (state) => state.actions?.actions?.social_actions || [],
    shallowEqual,
  );
  return (
    <div className={cx('footer_links', align)}>
      <List horizontal className={cx('social-networks', align)}>
        {networks
          .filter((network) => SOCIAL_ICONS[network.icon])
          .map((network) => (
            <List.Item key={network.id}>
              <UniversalLink
                href={network.url}
                openLinkInNewTab
                className={cx(
                  'social-network',
                  'item',
                  network.icon,
                  'animate',
                )}
                rel="me"
              >
                <Icon
                  name={SOCIAL_ICONS[network.icon]}
                  size="36px"
                  className={cx('social-network', network.icon, 'animate')}
                  title={network.title}
                />
              </UniversalLink>
            </List.Item>
          ))}
      </List>
    </div>
  );
};

export default SocialLinks;
