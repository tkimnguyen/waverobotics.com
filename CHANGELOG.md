# Changes

## 2026-11-11

- Frontend upgraded to Volto 19.7.0 and volto-light-theme 8.1.4. The site's
  header, footer, navigation, mobile menu and tags plug into the theme's
  component registry instead of overriding its files. Unused add-ons removed;
  the footer's social icons are now part of the site add-on. (#4)
- Production compose file accepts separate `BACKEND_TAG` and `FRONTEND_TAG`. (#3)
- Backend upgraded to Plone 6.2.3 on Python 3.13. The conference demo content
  and collective.exportimport were removed. (#2)

## 2026-11-10

- Upgraded to Plone 6.0.16 and Volto 18.36.0. Production moved to Docker
  images built by GitHub Actions; deployment documented in the README. (#1)

## 1.0.0 (2023-11-28)

- Initial version [plone]
