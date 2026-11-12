# Changes

## 2026-11-12

- Site search: a magnifying-glass button at the right of the desktop header
  opens a search field (as on demo.plone.org), and the phone menu has a search
  field at the top. The desktop menu no longer breaks words between about 990
  and 1150 px wide (an empty language-selector box was taking its room). (#14)

## 2026-11-11

- Saving a page from an edit page opened directly (reload or bookmark) no
  longer stores the backend's internal address in slide and teaser links,
  which made the FLL Explore slider photos disappear. (#13)
- Photo-only slides are shown without the dark panel meant for slide text
  (it made the FLL slider photos dark blue on phones). (#12)
- Photo-only slides: the photo's description is read out by screen readers;
  slides without one are skipped instead of announced as unnamed links. (#11)
- Accessibility fixes from an axe check (WCAG 2.2 A/AA): alternative text for
  image gallery images and sponsor logos, a screen-reader heading on sponsor
  pages, labelled gallery buttons, darker form field borders, a wider dark
  panel behind the home slider text, keyboard-usable phone menu entries, and a
  single focus outline in the desktop drop-down. (#9)
- Nightly content backup (repozo for the database, rsync for blobs, 7 nights)
  with its systemd units in `devops/production/backup/`. (#8)
- Desktop drop-down menu text is black on the theme's grey background
  (contrast 17.65:1, was 1.19:1). (#7)
- Teasers whose target the visitor can't see (e.g. a private page) are no
  longer links to the current page. (#6)
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
