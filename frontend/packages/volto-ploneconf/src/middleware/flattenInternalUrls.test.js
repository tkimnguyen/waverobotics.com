import config from '@plone/volto/registry';
import flattenInternalUrls, { flattenInternal } from './flattenInternalUrls';

const INTERNAL = 'http://backend:8080/Plone';

describe('flattenInternal', () => {
  it('turns internal addresses into site paths, at any depth', () => {
    const blocks = {
      a: {
        '@type': 'slider',
        slides: [
          {
            href: [
              {
                '@id': `${INTERNAL}/en/assets/photo.jpeg`,
                image_scales: {
                  image: [{ download: '@@images/image-1.jpeg' }],
                },
              },
            ],
          },
        ],
      },
      b: { url: INTERNAL, other: 'https://example.com/x', n: 3, ok: true },
    };
    expect(flattenInternal(blocks, INTERNAL)).toEqual({
      a: {
        '@type': 'slider',
        slides: [
          {
            href: [
              {
                '@id': '/en/assets/photo.jpeg',
                image_scales: {
                  image: [{ download: '@@images/image-1.jpeg' }],
                },
              },
            ],
          },
        ],
      },
      b: { url: '/', other: 'https://example.com/x', n: 3, ok: true },
    });
  });

  it('leaves look-alike addresses alone', () => {
    expect(flattenInternal(`${INTERNAL}2/en`, INTERNAL)).toBe(
      `${INTERNAL}2/en`,
    );
  });
});

describe('flattenInternalUrls middleware', () => {
  beforeEach(() => {
    global.__SERVER__ = true;
    config.settings.internalApiPath = INTERNAL;
  });
  afterEach(() => {
    global.__SERVER__ = false;
  });

  const run = (action) => {
    let passed;
    flattenInternalUrls()((a) => (passed = a))(action);
    return passed;
  };

  it('cleans blocks of loaded content on the server', () => {
    const action = {
      type: 'GET_CONTENT_SUCCESS',
      result: {
        '@id': `${INTERNAL}/en/page`,
        blocks: { a: { href: [{ '@id': `${INTERNAL}/en/x` }] } },
      },
    };
    const out = run(action);
    expect(out.result.blocks.a.href[0]['@id']).toBe('/en/x');
    expect(out.result['@id']).toBe(`${INTERNAL}/en/page`);
  });

  it('does nothing in the browser', () => {
    global.__SERVER__ = false;
    const action = {
      type: 'GET_CONTENT_SUCCESS',
      result: { blocks: { a: { url: `${INTERNAL}/en/x` } } },
    };
    expect(run(action)).toBe(action);
  });

  it('ignores other actions', () => {
    const action = { type: 'GET_NAVIGATION_SUCCESS', result: { blocks: {} } };
    expect(run(action)).toBe(action);
  });
});
