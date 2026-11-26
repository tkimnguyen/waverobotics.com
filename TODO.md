# To do

Open work on the site. Done items move to [CHANGELOG.md](CHANGELOG.md).

## Features

- **Users control panel: account dates and expiry**
  - Show when each user was created and when they last logged in.
  - Allow an optional expiry date on new (and existing) accounts, and show it
    in the control panel.
  - Decide what happens once an expiry date has passed. Don't necessarily lock
    the user out straight away, but warn someone (for example site admins,
    with a flag in the control panel and/or an email). Open questions: who is
    warned and how, a grace period, and whether accounts are disabled later
    and by whom.

## Content (editors)

Content edits, not code (the first item is from the 2026-11-11 axe accessibility
check, WCAG 2.2 A/AA):

- Give the banner image on `/en/news/wave-robotics-shop` alternative text.
- The shop post `/en/news/wave-robotics-shop` still says the store closes
  12/2/2025: update it with a current store, or retire it.
- The Blog page `/en/news` shows the description "Everything about Plone
  Conference and Python Cerrado", left over from the conference site: replace
  it with one about Wave Robotics news (Edit, then the Description field).
- Optional: the two YouTube videos on `/en/contact/reading-with-robots` and
  `/en/contact/training-video-tutorials` now get the general title "YouTube
  video" (#24); a `title="..."` on each `<iframe>` naming the video is better.

## Code

- **Volto bug [plone/volto#8528](https://github.com/plone/volto/issues/8528):**
  saving an edit page that was opened directly stored internal backend
  addresses in blocks. Worked around in
  `frontend/packages/volto-ploneconf/src/middleware/flattenInternalUrls.js`
  (#13). When a Volto release fixes it, upgrade and remove the workaround and
  its `storeExtenders` entry in `src/index.js`.
