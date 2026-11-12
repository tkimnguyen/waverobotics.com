// SemanticUI-free pre-@plone/components
import PropTypes from 'prop-types';
import { Container } from '@plone/components';
import MobileNavigation from '../MobileNavigation/MobileNavigation';
import Logo from '../Logo/Logo';
import LanguageSelector from './LanguageSelector';
import Navigation from '../Navigation/Navigation';
import SearchWidget from '@kitconcept/volto-light-theme/components/SearchWidget/SearchWidget';

const Header = (props) => {
  const { pathname } = props;

  return (
    <header className="header-wrapper">
      <Container layout>
        <div className="header">
          <div className="logo-nav-wrapper">
            <div className="logo">
              <Logo />
            </div>
            <Navigation pathname={pathname} />
            <MobileNavigation pathname={pathname} />
            <LanguageSelector />
            <div className="search-wrapper navigation-desktop">
              <div className="search">
                <SearchWidget />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

Header.propTypes = {
  token: PropTypes.string,
  pathname: PropTypes.string.isRequired,
};

Header.defaultProps = {
  token: null,
};

export default Header;
