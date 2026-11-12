/**
 * When a page is rendered on the server, Volto fetches content through
 * RAZZLE_INTERNAL_API_PATH (e.g. http://backend:8080/Plone), so links inside
 * blocks (slide and teaser targets, images) come back with that internal
 * address. Volto only cleans up the top-level URLs. If an editor opens an edit
 * page directly (reload, bookmark) and saves, those internal addresses are
 * stored as they are: the backend can't turn them back into links to the
 * target, and they lose their image data, so slider photos disappear.
 *
 * This middleware rewrites internal addresses inside `blocks` to site paths
 * (/en/...), the same form the object browser stores, while still on the
 * server, before the content reaches the store sent to the browser.
 */
import config from '@plone/volto/registry';
import { GET_CONTENT } from '@plone/volto/constants/ActionTypes';

const SUCCESS = `${GET_CONTENT}_SUCCESS`;

export function flattenInternal(value, internal) {
  if (typeof value === 'string') {
    if (value === internal) return '/';
    return value.startsWith(`${internal}/`)
      ? value.slice(internal.length)
      : value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => flattenInternal(v, internal));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, flattenInternal(v, internal)]),
    );
  }
  return value;
}

const flattenInternalUrls = () => (next) => (action) => {
  const internal = config.settings.internalApiPath?.replace(/\/+$/, '');
  if (
    __SERVER__ &&
    internal &&
    action.type === SUCCESS &&
    action.result?.blocks
  ) {
    return next({
      ...action,
      result: {
        ...action.result,
        blocks: flattenInternal(action.result.blocks, internal),
      },
    });
  }
  return next(action);
};

export default flattenInternalUrls;
