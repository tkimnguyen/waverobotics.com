# Changes

## 2026-11-26

- The header logo's text (read out by screen readers and shown when images
  don't load) says "Wave Robotics home" instead of "Plone Conference", left
  over from the conference site; the "Plone Conference" tooltip on it is gone.
  TODO lists two more content leftovers: the expired shop post and the Blog
  page description. (#26)

## 2026-11-25

- The backend writes its access log and event log to files in the instance's
  `var/log` again (`backend/docker/zope.ini`), kept for 4 weeks by logrotate,
  in addition to the container log, which only holds a few days. (#25)
- Embedded frames in HTML blocks get a title when the editor didn't give them
  one, named after where they come from ("Google Calendar", "YouTube video",
  "Google Form", ...), so screen readers can say what they are. A title the
  editor writes is kept. Fixes the untitled calendar on the home page and the
  videos on two contact pages. (#24)
- The slide deck is on GitHub Pages:
  https://tkimnguyen.github.io/waverobotics.com/slides/waverobotics-site.html (#23)
- Email alerts from the production server are in the repo
  (`devops/production/alerts/`): mail when a service fails (with its log) and
  when a disk is over 85% full. The nightly backup emails when it fails, and a
  new daily check emails when no backup has succeeded for 30 hours. (#21)
- `docs/slides/`: a short slide deck for the team about the site, what it does
  for Wave Robotics and what changed in November 2026, as Marp Markdown and
  rendered HTML. (#22)

## 2026-11-19

- The first slide of a full-width slider loads right away and with high
  priority (it was lazy-loaded, which delayed the main photo of the home page),
  and embedded frames in HTML blocks (calendar, videos, forms) load only when
  they come near the screen. (#20)

## 2026-11-17

- Smaller downloads on every first visit: the header logo is a 534x300 copy
  (34 KB instead of the 2853x1603, 275 KB original), and the text font is the
  theme's Inter as woff2 files with Latin characters, arrows and shapes (about
  50 KB per weight instead of about 160 KB for the theme's .ttf files).
  Characters Inter doesn't have, such as emoji, come from the system font
  without first downloading a full .ttf. `devops/perf/loadtime.js` measures
  page load times. (#19)

## 2026-11-12

- Search results page on phones: the same side margins as other pages, and the
  sort row wraps instead of making the page scroll sideways. (#17)
- Removed the language selector from the header and phone menu: it held an
  invisible, empty link to the Portuguese section (which no longer exists)
  that screen readers announced. (#16)
- TODO.md lists open work (features, content fixes, code follow-ups). (#15)
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
