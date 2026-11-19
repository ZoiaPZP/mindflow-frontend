import { Link } from 'react-router-dom';
import Container from '../Container/Container';
import css from './Footer.module.css'; // Import the CSS module for this component
import { selectUser } from '../../redux/auth/selectors.js';
import { useSelector } from 'react-redux';

const Footer = () => {
  const user = useSelector(selectUser);

  return (
    <footer className={css.footer}>
      <Container noVerticalPadding>
        <div className={css.inner}>
          <div className={css.logo}>
            <svg className={css.logoIcon}>
              <use href="/img/icons.svg#icon-logo-min"></use>
            </svg>
          </div>
          <p className={css.copyright}>© 2025 Harmoniq. All rights reserved.</p>
          <nav className={css.links}>
            <ul className={css.linkList}>
              <li>
                <Link to="/articles" className={css.link}>
                  Articles
                </Link>
              </li>
              {user?.id && (
                <li>
                  <Link to={`/authors/${user.id}`} className={css.link}>
                    Account
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
        <p className={css.credit}>
          Team educational project based on a GoIT design. Images belong to their
          respective owners.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
