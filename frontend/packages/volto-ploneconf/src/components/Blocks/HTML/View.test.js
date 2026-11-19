import { lazyLoadIframes } from './View';

describe('lazyLoadIframes', () => {
  it('adds loading="lazy" to iframes', () => {
    expect(
      lazyLoadIframes(
        '<p>x</p><iframe src="a" width="1"></iframe><IFRAME src="b">',
      ),
    ).toBe(
      '<p>x</p><iframe loading="lazy" src="a" width="1"></iframe><iframe loading="lazy" src="b">',
    );
  });
  it('keeps an iframe that sets loading itself', () => {
    const html = '<iframe src="a" loading="eager"></iframe>';
    expect(lazyLoadIframes(html)).toBe(html);
  });
  it('leaves other HTML and empty values alone', () => {
    expect(lazyLoadIframes('<iframes-are-not-here>')).toBe(
      '<iframes-are-not-here>',
    );
    expect(lazyLoadIframes(undefined)).toBe(undefined);
  });
});
