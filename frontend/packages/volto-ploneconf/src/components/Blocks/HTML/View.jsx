/**
 * HTML block view: Volto's, with loading="lazy" added to embedded frames
 * (Google Calendar, YouTube, Google Forms) that don't set loading themselves,
 * so the browser fetches them only when they come near the screen.
 */
import VoltoHTMLView from '@plone/volto/components/manage/Blocks/HTML/View';

export const lazyLoadIframes = (html) =>
  typeof html === 'string'
    ? html.replace(
        /<iframe\b(?![^>]*\sloading\s*=)/gi,
        '<iframe loading="lazy"',
      )
    : html;

const View = (props) => (
  <VoltoHTMLView
    {...props}
    data={{ ...props.data, html: lazyLoadIframes(props.data?.html) }}
  />
);

export default View;
