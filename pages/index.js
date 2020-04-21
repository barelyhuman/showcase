import Head from 'next/head';
import { useState, useEffect } from 'react';
import ms from 'ms';

import API from '../services/API';

export default function Home() {
  const [showcaseIds, setShowcaseIds] = useState([]);
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    API.getShowStories()
      .then((dataList) => {
        const promises = dataList.slice(0, 10).map((item) => {
          return API.getItemDetails(item);
        });
        setShowcaseIds(dataList);
        return Promise.all(promises);
      })
      .then((data) => {
        setList(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (list.length === showcaseIds.length) {
      return setLoadMore(false);
    }
    return setLoadMore(true);
  }, [list, showcaseIds]);

  const paginate = () => {
    const nextIndex = index + 1;
    setLoading(true);
    const offset = nextIndex * limit;
    const promises = showcaseIds.slice(offset, offset + limit).map((item) => {
      return API.getItemDetails(item);
    });

    return Promise.all(promises).then((data) => {
      setIndex(nextIndex);
      setList([...list, ...data]);
      setLoading(false);
    });
  };

  const getTime = (time) => {
    if (isNaN(time) || !time) {
      return '-';
    }
    const timeAsDate = new Date(time * 1000).getTime();
    const timeNow = Date.now();
    return ms(timeNow - timeAsDate);
  };

  return (
    <div className="container">
      <Head>
        <title>ShowCase</title>
        <link rel="shortcut-icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">
          Welcome to <a href="https://showcase.barelyhuman.dev">ShowCase</a>
        </h1>

        <div className="grid">
          {list.map((listItem) => (
            <a target="_blank" href={listItem.url} className="card">
              <h3>{listItem.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: listItem.text }}></p>
              <small>{getTime(listItem.time)}</small>
            </a>
          ))}
        </div>
        <div className="grid">
          {loading ? <p>loading...</p> : null}
          {!loading && loadMore ? (
            <button className="button" onClick={paginate}>
              Load More
            </button>
          ) : null}
          {list.length === showcaseIds.length ? (
            <h3>That's all folks</h3>
          ) : null}
        </div>
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title a {
          color: #0070f3;
          text-decoration: none;
        }

        .title a:hover,
        .title a:focus,
        .title a:active {
          text-decoration: underline;
        }

        .title {
          margin: 0;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .description {
          line-height: 1.5;
          font-size: 1.5rem;
        }

        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 1000px;
          margin-top: 3rem;
        }

        .card {
          min-width: 100%;
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        .button {
          -webkit-appearance: none;
          position: relative;
          display: inline-block;
          vertical-align: middle;
          text-transform: uppercase;
          text-align: center;
          line-height: 28px;
          white-space: nowrap;
          min-width: 135px;
          height: 28px;
          font-weight: 500;
          font-size: 12px;
          flex-shrink: 0;
          color: rgb(255, 255, 255);
          background-color: rgb(37, 41, 46);
          user-select: none;
          cursor: pointer;
          text-decoration: none;
          padding: 0px 25px;
          border-radius: 5px;
          border-width: 1px;
          border-style: solid;
          border-color: rgb(37, 41, 46);
          border-image: initial;
          transition: all 0.2s ease 0s;
          overflow: hidden;
          outline: none;
        }
        .button:hover {
          background: white;
          border: 1px solid black;
          color: black;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
