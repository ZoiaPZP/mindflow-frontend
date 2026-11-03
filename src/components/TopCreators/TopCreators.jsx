import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './TopCreators.module.css';
import CreatorCard from '../CreatorCard/CreatorCard';
import Container from '../Container/Container.jsx';
import { API_BASE_URL } from '../../services/api.js';

function TopCreators() {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/users?perPage=20&page=1`
        );
        if (!res.ok) throw new Error('Failed to load page 1');
        const firstData = await res.json();
        const users = firstData.data?.users || [];
        const totalPages = firstData.data?.pages || 1;

        const promises = [];

        for (let page = 2; page <= totalPages; page++) {
          promises.push(
            fetch(
              `${API_BASE_URL}/users?perPage=20&page=${page}`
            )
              .then((res) => {
                if (!res.ok) throw new Error(`Failed to load page ${page}`);
                return res.json();
              })
              .then((data) => data.data?.users || [])
          );
        }

        const restPages = await Promise.all(promises);
        const allUsers = [...users, ...restPages.flat()];

        const top6 = allUsers
          .filter((user) => typeof user.articlesAmount === 'number')
          .sort((a, b) => b.articlesAmount - a.articlesAmount)
          .slice(0, 6);

        setCreators(top6);
      } catch (error) {
        console.error(' Failed to load all users:', error);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <section className={styles.TopCreators}>
      <Container noVerticalPadding>
        <div className={styles.content}>
          <div className={styles.firstpart}>
            <h2 className={styles.title}>Top Creators</h2>
            <Link to="/authors" className={styles.link}>
              <span className={styles.linkText}>Go to all Creators</span>
              <svg className={`${styles.icon} icon-Icon-2`}>
                <use xlinkHref="/symbol-defs.svg#icon-Icon-2" />
              </svg>
            </Link>
          </div>
          <ul className={styles.creatorsGrid}>
            {creators.map((creator) => (
              <li key={creator.id || creator.name}>
                <CreatorCard creator={creator} page="home" />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export default TopCreators;
