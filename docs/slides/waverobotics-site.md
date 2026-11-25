---
marp: true
title: waverobotics.com
description: The Wave Robotics website, what it does for the team, and what changed in November 2026
paginate: true
size: 16:9
style: |
  section {
    font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
    color: #001522;
    background: #ffffff;
    padding: 56px 72px;
    font-size: 28px;
  }
  h1, h2 { color: #0070a2; letter-spacing: -0.01em; }
  h1 { font-size: 56px; }
  h2 { font-size: 42px; margin-bottom: 0.4em; }
  strong { color: #001522; }
  a { color: #0070a2; }
  section::after { color: #5a6b75; font-size: 18px; }
  section.lead { background: #001522; color: #ffffff; justify-content: center; }
  section.lead h1, section.lead h2 { color: #ffffff; }
  section.lead strong { color: #8fd14f; }
  section.lead a { color: #8fd14f; }
  .big { font-size: 64px; font-weight: 700; color: #0070a2; line-height: 1.1; }
  .small { font-size: 20px; color: #5a6b75; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
  .cols3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
  .card { background: #f2f4f5; border-radius: 12px; padding: 20px 24px; font-size: 22px; }
  .card h3 { margin: 0 0 8px; color: #0070a2; font-size: 26px; }
  img[alt~="shot"] { border: 1px solid #d5dbdf; border-radius: 8px; }
  .shots { display: flex; flex-direction: column; gap: 24px; margin-bottom: 24px; }
  .shots p { margin: 0; }
  .shots p:first-child img { width: 100%; }
  .shots p:last-child img { width: 420px; }
  section.lead img { border-radius: 12px; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

![w:360](images/logo.jpg)

# waverobotics.com

The website of **Wave Robotics, FIRST team 2826**:
what it does for the team, and what changed in November 2026.

---

## What the site does for the team

<div class="cols3">
<div class="card">

### Recruit

Pages for each program (FIRST LEGO League Explore, LEGO League Challenge, FRC), recruitment videos and open-house news.

</div>
<div class="card">

### Thank sponsors

Sponsor levels from Supporter to Game Changer, with each sponsor's logo and page, and how to become one.

</div>
<div class="card">

### Tell our story

72 news posts: competitions, robot reveals, awards, outreach, fundraisers and interviews.

</div>
<div class="card">

### Run the team

Member resources for FLL and FRC families: forms, reimbursement, event paperwork.

</div>
<div class="card">

### Stay in touch

Contact page, team calendar, training videos, social links.

</div>
<div class="card">

### Raise money

The Wave Robotics shop and fundraiser announcements.

</div>
</div>

---

## Same site, any screen

<div class="shots">

![shot](images/header-desktop.png)

![shot](images/header-phone.png)

</div>

- **Laptop**: menu across the top, search button at the right
- **Phone**: the menu folds into the ☰ button, with a search field inside

<span class="small">The site header on a laptop and on a phone, November 2026.</span>

---

## Who uses it

<div class="cols">
<div>

### Visitors

- Families looking for a program
- Schools and community partners
- Sponsors, current and future
- Team members and parents looking for a form or a date

</div>
<div>

### Team editors

- Mentors and students write news and update pages **in the browser**
- No coding: pages are built from blocks (text, photos, sliders, videos, grids)
- Changes are live right away for editors, and for visitors within 5 minutes

</div>
</div>

---

## How it's built

- **Plone**: the content system editors log in to. Open source, used for over 20 years by universities, governments and nonprofits.
- **Volto**: the fast, modern pages visitors see, built on React.
- **One small cloud server** runs both, in Docker containers.
- **Cloudflare** sits in front: it keeps copies of pages and photos close to visitors.
- **GitHub** holds the code. Every change is a reviewed pull request, built and checked automatically before it goes live.

<span class="small">The site's code started from the Plone Conference 2024 website, also built with Plone and Volto.</span>

---

<!-- _class: lead -->

## November 2026

A full upgrade, then a month of fixes, all live with no lost content.

**Plone 6.0 → 6.2.3 · Volto 18 → 19.7**

All 209 public pages were checked before and after every change.

---

## Faster

<div class="cols">
<div>

<div class="big">14.9 s → 4.6 s</div>

Time until the home page's main photo shows, on a phone with a slow 4G connection.

</div>
<div>

- **About 500 KB less** to download on a first visit: smaller logo, lighter fonts
- The first slider photo loads **first**; others wait their turn
- Videos and calendars load only when you scroll to them
- Pages come from Cloudflare's cache in **about 0.1 s**
- Photos are cached for a year

</div>
</div>

---

## Easier to use, for everyone

- **Search**: a search button in the header, and a search field in the phone menu
- **Accessibility**: every page checked against WCAG 2.2 (the web accessibility standard); fixed missing image descriptions, low-contrast menus and links that screen readers read out but nobody could see
- **Phones**: the menu, buttons, search page and slider work properly on small screens
- **Fewer surprises for editors**: saving a page no longer breaks slider photos

---

## Safer

- **Nightly backups** of all pages, photos and files, 7 days kept, plus daily backups of the whole server by the hosting company. A restore was tested.
- **Email alerts** when a backup fails or stops running, or the disk fills up
- **Security updates** install automatically every day
- **Up-to-date software**: the Plone and Volto versions still getting fixes

---

## For editors: three habits that help

1. **Describe your photos.** Fill in *Alt text* on image blocks, and the *Description* of photos used in sliders: screen readers read it aloud, and search engines use it.
2. **Give embedded videos and calendars a title.** In an HTML block, add `title="…"` to the `<iframe>`, for example `title="Team calendar"`.
3. **Expect up to 5 minutes.** Visitors may see the old version of a page for a few minutes after you save. You always see the new one.

---

## What's next

- **Content fixes** (no coding): titles for the home-page calendar and two YouTube videos, alt text for the shop banner
- **User accounts**: show when each account was created and last used, and let accounts expire, with a warning first
- **Keep up with Plone and Volto** releases, and keep checking every page after each change

Open work is listed in `TODO.md`, finished work in `CHANGELOG.md`.

---

<!-- _class: lead -->
<!-- _paginate: false -->

# Thank you

**waverobotics.com**

Code and history: [github.com/tkimnguyen/waverobotics.com](https://github.com/tkimnguyen/waverobotics.com)
