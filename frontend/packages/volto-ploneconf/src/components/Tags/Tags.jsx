/**
 * Tags component.
 * @module components/theme/Tags/Tags
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from '@plone/components';
import { Icon } from '@plone/volto/components';
import tagSVG from '@plone/volto/icons/tag.svg';
import config from '@plone/registry';

/**
 * Tags component class.
 * @function Tags
 * @param {Object} content Content object; its subjects are the tags. Volto 18
 *   renders this from the belowContent slot, which passes `content`.
 * @param {array} tags Array of tags (older call style, still accepted).
 * @returns {string} Markup of the component.
 */
const Tags = ({ content, tags = content?.subjects }) =>
  config.settings.showTags !== false && tags && tags.length > 0 ? (
    <Container layout className="tags">
      <Icon name={tagSVG} />
      {tags.map((tag, i) => (
        <React.Fragment key={tag}>
          <Link className="ui tag" to={`/search?Subject=${tag}`}>
            {tag}
          </Link>
          {tags.length > i + 1 && <span className="divider">,</span>}
        </React.Fragment>
      ))}
    </Container>
  ) : (
    <span />
  );

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Tags.propTypes = {
  content: PropTypes.shape({
    subjects: PropTypes.arrayOf(PropTypes.string),
  }),
  tags: PropTypes.arrayOf(PropTypes.string),
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
Tags.defaultProps = {
  content: null,
};

export default Tags;
