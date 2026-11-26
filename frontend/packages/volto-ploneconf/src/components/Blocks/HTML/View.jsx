/**
 * HTML block view: Volto's, with two additions to embedded frames (Google
 * Calendar, YouTube, Google Forms) that editors paste in:
 * - loading="lazy" when the frame doesn't set loading itself, so the browser
 *   fetches it only when it comes near the screen;
 * - a title when the frame has none (or an empty one), named after the site
 *   it comes from, so screen readers can announce what it is. A title the
 *   editor wrote always wins.
 */
import VoltoHTMLView from '@plone/volto/components/manage/Blocks/HTML/View';

const EMBED_TITLES = [
  [/(^|\.)calendar\.google\.com$/, () => 'Google Calendar'],
  [
    /(^|\.)google\.com$/,
    (url) =>
      url.pathname.startsWith('/maps')
        ? 'Google Map'
        : url.pathname.startsWith('/forms')
          ? 'Google Form'
          : null,
  ],
  [
    /^docs\.google\.com$/,
    (url) =>
      url.pathname.startsWith('/forms') ? 'Google Form' : 'Google document',
  ],
  [/^forms\.gle$/, () => 'Google Form'],
  [
    /(^|\.)(youtube\.com|youtube-nocookie\.com|youtu\.be)$/,
    () => 'YouTube video',
  ],
  [/(^|\.)vimeo\.com$/, () => 'Vimeo video'],
];

export const embedTitle = (src) => {
  if (!src || !src.trim()) return 'Embedded content';
  let url;
  try {
    url = new URL(src, 'https://waverobotics.com');
  } catch {
    return 'Embedded content';
  }
  for (const [host, title] of EMBED_TITLES) {
    if (host.test(url.hostname)) {
      const t = title(url);
      if (t) return t;
    }
  }
  return `Embedded content from ${url.hostname.replace(/^www\./, '')}`;
};

const attr = (tag, name) =>
  tag.match(
    new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'),
  );

export const fixIframes = (html) =>
  typeof html === 'string'
    ? html.replace(/<iframe\b([^>]*)>/gi, (tag, rest) => {
        let added = '';
        if (!attr(tag, 'loading')) added += ' loading="lazy"';
        const title = attr(tag, 'title');
        const hasTitle = title && (title[2] ?? title[3] ?? title[4]).trim();
        if (!hasTitle) {
          const src = attr(tag, 'src');
          const t = embedTitle(src ? src[2] ?? src[3] ?? src[4] : '');
          if (title) rest = rest.replace(title[0], '');
          added += ` title="${t.replace(/[&"<>]/g, (c) => `&#${c.charCodeAt(0)};`)}"`;
        }
        return `<iframe${added}${rest}>`;
      })
    : html;

const View = (props) => (
  <VoltoHTMLView
    {...props}
    data={{ ...props.data, html: fixIframes(props.data?.html) }}
  />
);

export default View;
