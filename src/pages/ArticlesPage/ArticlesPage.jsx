import Container from '../../components/Container/Container';
import css from './ArticlesPage.module.css';
import ArticlesDropdown from '../../components/ArticlesDropdown/ArticlesDropdown';
import ArticlesList from '../../components/ArticlesList/ArticlesList';
import LoadMore from '../../components/LoadMore/LoadMore';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllArticles } from '../../redux/articles/operation';
import {
  selectAllArticles,
  selectLoadingArticles,
  selectPage,
  selectPages,
  selectTotalArticles,
} from '../../redux/articles/selectors';
import Loader from '../../components/Loader/Loader';
import ArticlesEmpty from '../../components/ArticlesEmpty/ArticlesEmpty';

const ArticlesPage = () => {
  const articles = useSelector(selectAllArticles);

  //console.log('ARTICLES:', articles);
  const loading = useSelector(selectLoadingArticles);
  const totalArticles = useSelector(selectTotalArticles);
  const currentPage = useSelector(selectPage);
  const totalPages = useSelector(selectPages);
  const [filter, setFilter] = useState('all'); // локальний фільтр
  const lastArticleRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllArticles({ page: 1, filter }));
  }, [dispatch, filter]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handleLoadMore = () => {
    //console.log('Load more clicked. Current page:', currentPage);
    if (currentPage < totalPages && !loading) {
      //  scroll-орієнтир
      if (lastArticleRef.current) {
        lastArticleRef.current.scrollIntoView({ behavior: 'auto' });
      }

      dispatch(fetchAllArticles({ page: currentPage + 1, filter }));
    }
  };

  return (
    <section>
      <Container>
        <h1 className={css.profileTitle}>Articles</h1>
        <div className={css.boxSelect}>
          <div>
            <p className={css.countArticles}>
              {totalArticles} {totalArticles === 1 ? 'article' : 'articles'}
            </p>
          </div>
          <div className={css.formSelect}>
            <ArticlesDropdown onChangeFilter={handleFilterChange} />
          </div>
        </div>

        <>
          {!loading && articles.length === 0 && <ArticlesEmpty />}

          <ArticlesList
            icon={'icon-favorite-article'}
            btnStyle={'FavoriteArticleNotSaved'}
            queryArticles={articles}
            lastArticleRef={lastArticleRef}
          />
          {loading && (
            <div>
              <p>Чекайте! Статті зараз завантажуються ....</p>
            </div>
          )}
          {totalPages > 1 && currentPage < totalPages && !loading && (
            <LoadMore
              page={currentPage}
              pages={totalPages}
              onLoadMore={handleLoadMore}
            />
          )}
        </>
      </Container>
    </section>
  );
};

export default ArticlesPage;
