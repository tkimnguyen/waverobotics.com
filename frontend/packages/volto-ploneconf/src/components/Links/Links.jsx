import React from 'react';
import { Icon, UniversalLink } from '@plone/volto/components';
import cx from 'classnames';
import { SOCIAL_ICONS } from '../SocialLinks/SocialLinks';
import siteIcon from '@plone/volto/icons/world.svg';

const categories = {
  remoteUrl: {
    title: 'Site',
    className: 'site',
    icon: siteIcon,
  },
  github: {
    title: 'GitHub',
    className: 'github',
    icon: SOCIAL_ICONS.github,
  },
  mastodon: {
    title: 'Mastodon',
    className: 'mastodon',
    icon: SOCIAL_ICONS.mastodon,
  },
  instagram: {
    title: 'Instagram',
    className: 'instagram',
    icon: SOCIAL_ICONS.instagram,
  },
  linkedin: {
    title: 'LinkedIn',
    className: 'linkedin',
    icon: SOCIAL_ICONS.linkedin,
  },
  twitter: {
    title: 'X',
    className: 'twitter',
    icon: SOCIAL_ICONS.twitter,
  },
  facebook: {
    title: 'Facebook',
    className: 'facebook',
    icon: SOCIAL_ICONS.facebook,
  },
  youtube: {
    title: 'YouTube',
    className: 'youtube',
    icon: SOCIAL_ICONS.youtube,
  },
};

const Link = ({ id, href }) => {
  const category = categories[id];
  const linkIcon = category.icon;
  const className = category.className;
  const title = category.title;
  return (
    <UniversalLink
      href={href}
      openLinkInNewTab
      className={cx('link', 'item', `${className}`)}
      title={title}
      rel={'me'}
    >
      <Icon
        name={linkIcon}
        className={cx('link-icon', `${className}`)}
        title={title}
      />
    </UniversalLink>
  );
};

const Links = ({ links }) => {
  const items = Array.from(Object.entries(links), (item) => ({
    id: item[0],
    href: item[1],
  }));
  return (
    <div className="links">
      <div className="links wrapper">
        {links &&
          items.map((item) => (
            <Link key={item.id} id={item.id} href={item.href} />
          ))}
      </div>
    </div>
  );
};

export default Links;
