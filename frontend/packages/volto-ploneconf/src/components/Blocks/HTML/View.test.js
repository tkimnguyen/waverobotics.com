import { embedTitle, fixIframes } from './View';

describe('fixIframes', () => {
  it('adds loading="lazy" and a title to iframes', () => {
    expect(
      fixIframes(
        '<p>x</p><iframe src="https://www.youtube.com/embed/abc" width="1"></iframe><IFRAME src="https://calendar.google.com/calendar/embed?src=x">',
      ),
    ).toBe(
      '<p>x</p><iframe loading="lazy" title="YouTube video" src="https://www.youtube.com/embed/abc" width="1"></iframe><iframe loading="lazy" title="Google Calendar" src="https://calendar.google.com/calendar/embed?src=x">',
    );
  });
  it('keeps what the editor set', () => {
    const html =
      '<iframe src="https://www.youtube.com/embed/abc" loading="eager" title="Robot reveal 2025"></iframe>';
    expect(fixIframes(html)).toBe(html);
  });
  it('replaces an empty title', () => {
    expect(
      fixIframes(
        "<iframe loading='lazy' title=' ' src='https://docs.google.com/forms/d/e/x/viewform'>",
      ),
    ).toBe(
      "<iframe title=\"Google Form\" loading='lazy' src='https://docs.google.com/forms/d/e/x/viewform'>",
    );
  });
  it('leaves other HTML and empty values alone', () => {
    expect(fixIframes('<iframes-are-not-here>')).toBe('<iframes-are-not-here>');
    expect(fixIframes(undefined)).toBe(undefined);
  });
});

describe('embedTitle', () => {
  it.each([
    ['https://calendar.google.com/calendar/embed?src=a', 'Google Calendar'],
    ['https://www.youtube-nocookie.com/embed/x', 'YouTube video'],
    ['https://youtu.be/x', 'YouTube video'],
    ['https://docs.google.com/forms/d/e/x/viewform', 'Google Form'],
    ['https://forms.gle/abc', 'Google Form'],
    ['https://docs.google.com/document/d/x/pub', 'Google document'],
    ['https://www.google.com/maps/embed?pb=x', 'Google Map'],
    ['https://player.vimeo.com/video/1', 'Vimeo video'],
    ['https://www.example.org/widget', 'Embedded content from example.org'],
    ['', 'Embedded content'],
    ['/relative/page', 'Embedded content from waverobotics.com'],
  ])('%s -> %s', (src, title) => {
    expect(embedTitle(src)).toBe(title);
  });
});
