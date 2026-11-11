import TeaserDefaultTemplate from '@plone/volto/components/manage/Blocks/Teaser/DefaultBody';

// A teaser whose target the visitor can't see (e.g. a private page) gets an
// empty href from the API. volto-light-theme 8 still renders that card as a
// link, which points to the current page and opens it in a new tab. Render
// such teasers without a link, the same way they render while editing.
const TeaserDefault = (props) => {
  const hasTarget = !!props.data?.href?.[0]?.['@id'];
  return (
    <TeaserDefaultTemplate
      {...props}
      isEditMode={props.isEditMode || !hasTarget}
    />
  );
};

export default TeaserDefault;
