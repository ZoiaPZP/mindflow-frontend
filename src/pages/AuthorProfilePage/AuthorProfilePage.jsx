import ArticlesList from '../../components/ArticlesList/ArticlesList';
import css from './AuthorProfilePage.module.css';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Container from '../../components/Container/Container';
import { useLocation, useParams } from 'react-router-dom';
import clsx from 'clsx';
import LoadMore from '../../components/LoadMore/LoadMore';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAuthorById,
  fetchArticlesAuthorById,
} from '../../redux/user/operation.js';
import {
  selectAuthorData,
  selectAuthorArticles,
  selectAuthorArticlesPage,
  selectAuthorArticlesPages,
  selectAuthorArticlesTotal,
  selectAuthorArticlesLoading,
} from '../../redux/user/selectors.js';

import { selectIsLoggedIn, selectUser } from '../../redux/auth/selectors.js';
import UserAvatar from '../../components/UserAvatar/UserAvatar.jsx';

const AuthorProfilePage = () => {
  const location = useLocation();

  const buildLinkClass = ({ isActive }) => {
    return clsx(css.tabItem, isActive && css.active);
  };

  const dispatch = useDispatch();

  const authorData = useSelector(selectAuthorData);
  const authorArticlesLoading = useSelector(selectAuthorArticlesLoading);

  const authorArticles = useSelector(selectAuthorArticles);

  const currentPage = useSelector(selectAuthorArticlesPage);
  const totalPages = useSelector(selectAuthorArticlesPages);

  const totalArticles = useSelector(selectAuthorArticlesTotal);

  const OwnProfile = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  //console.log('isLoggedIn', isLoggedIn);

  const author = authorData?.data || {};
  const articles = authorArticles || [];

  const { id: ownerId } = useParams();
  const navigate = useNavigate();

  const isOwnProfile = isLoggedIn && OwnProfile?.id === ownerId;

  useEffect(() => {
    if (!ownerId) return;

    dispatch(fetchAuthorById({ ownerId }));
    dispatch(fetchArticlesAuthorById({ ownerId, page: currentPage }));
  }, [ownerId, currentPage, dispatch]);

  useEffect(() => {
    const isTryingToAccessPrivateTab =
      location.pathname.includes('my-articles') ||
      location.pathname.includes('saved-articles');

    if (isTryingToAccessPrivateTab && !isOwnProfile) {
      navigate('/', { replace: true }); // редирект на головну
    }
    if (isOwnProfile && location.pathname === `/authors/${ownerId}`) {
      navigate('my-articles', { replace: true });
    }
  }, [isOwnProfile, location.pathname, ownerId, navigate]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !authorArticlesLoading) {
      dispatch(fetchArticlesAuthorById({ ownerId, page: currentPage + 1 }));
    }
  };

  return (
    <section className={css.section_AuthorProfilePage}>
      <Container>
        <h1 className={css.profileTitle}>My Profile</h1>
        <ul className={css.profileList}>
          <li>
            {author?.avatarUrl && author.avatarUrl.trim() !== '' ? (
              <img
                src={author.avatarUrl}
                alt={author.name || 'Author avatar'}
                className={css.imgProfile}
              />
            ) : (
              <div className={css.avatarLetter}>
                {author?.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </li>
          <li>
            <p className={css.userName}>{author?.name}</p>
            <p className={css.countArticles}>
              {totalArticles ?? 0}
              {(totalArticles ?? 0) === 1 ? ' article' : ' articles'}
            </p>
          </li>
        </ul>
        {isOwnProfile && (
          <>
            <nav className={css.profileTabList}>
              <NavLink to="my-articles" className={buildLinkClass}>
                My Articles
              </NavLink>
              <NavLink to="saved-articles" className={buildLinkClass}>
                Saved Articles
              </NavLink>
            </nav>
            <Outlet />
          </>
        )}

        {!isOwnProfile && (
          <>
            <ArticlesList
              icon={'icon-favorite-article'}
              btnStyle={'FavoriteArticleNotSaved'}
              queryArticles={articles}
            />
            {totalPages > 1 &&
              currentPage < totalPages &&
              !authorArticlesLoading && (
                <LoadMore
                  page={currentPage}
                  pages={totalPages}
                  onLoadMore={handleLoadMore}
                />
              )}
          </>
        )}
      </Container>
    </section>
  );
};

export default AuthorProfilePage;
