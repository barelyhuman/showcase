import Head from 'next/head';
import { useState, useEffect } from 'react';
import ms from 'ms';
import { Loader } from 'react-feather';

import API from '../services/API';

export default function Home() {
  const [showcaseData, setShowcaseData] = useState([]);
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    let listData = [...list];
    API.getShowStories(index, limit)
      .then((response) => {
        listData = [...listData, ...response.devTo];
        const promises = response.hnews.map((item) => {
          return API.getItemDetails(item);
        });
        setShowcaseData(response);
        return Promise.all(promises);
      })
      .then((response) => {
        const mappedSource = response.map((item) => {
          item.showcaseSource = 'HACKERNEWS';
          return item;
        });
        listData = [...listData, ...mappedSource];
        setList(listData);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      });
  }, [index]);

  const paginate = () => {
    setIndex(index + 1);
  };

  const getTime = (listItem) => {
    let time;
    if (listItem.published_at) {
      time = new Date(listItem.published_at);
    }
    if (listItem.time) {
      time = new Date(listItem.time * 1000);
    }
    if (!time) {
      return;
    }
    const timeInMills = new Date(time).getTime();
    const timeNow = Date.now();
    return ms(timeNow - timeInMills);
  };

  const getSource = (listItem) => {
    return listItem.showcaseSource || '-';
  };

  return (
    <div className="container-boundaries container">
      <Head>
        <title>ShowCase</title>
        <link rel="shortcut-icon" href="/favicon.ico" />
      </Head>

      <div className="pt-2 pb-2 mt-2 mb-2 ">
        <h2 className="p-0 m-0">
          <a href="/">ShowCase</a>
        </h2>
        <p className="p-0 m-0">
          <small>Simple feed curator</small>
        </p>
      </div>

      <main className="mt-2">
        <div className="mt-2">
          {list.map((listItem) => (
            <>
              <a target="_blank" href={listItem.url}>
                <h3>{listItem.title}</h3>
              </a>
              <p dangerouslySetInnerHTML={{ __html: listItem.text }}></p>
              <small>Posted: {getTime(listItem)}</small>
              <div className="spacer"></div>
              <small>Source: {getSource(listItem)}</small>
            </>
          ))}
        </div>
        <div className="flex flex-center mt-2">
          {loading ? (
            <>
              <div className="page-loader">
                <Loader />
                <p className="ml-1">Loading...</p>
              </div>
            </>
          ) : null}
          {!loading ? (
            <button className="button" onClick={paginate}>
              Load More
            </button>
          ) : null}
        </div>
      </main>
    </div>
  );
}
