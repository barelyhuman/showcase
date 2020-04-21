import axios from 'axios';
const controller = {};

const HackerNewsAPI = axios.create({
  baseURL: 'https://hacker-news.firebaseio.com/v0',
});

const DevToApi = axios.create({
  baseURL: 'https://dev.to/api',
});

controller.getShowStories = (offset, limit) => {
  const DevToData = DevToApi.get(
    `/articles?tag=showdev&page=${offset + 1}&${limit}`
  ).then((data) => data.data);
  const HNData = HackerNewsAPI.get(
    '/showstories.json?print=pretty'
  ).then((data) => data.data.slice(offset, limit));

  return Promise.all([DevToData, HNData]).then((response) => {
    return {
      devTo: response[0].map((item) => {
        item.showcaseSource = 'DEV.TO';
        return item;
      }),
      hnews: response[1],
    };
  });
};

controller.getItemDetails = (itemId) => {
  return HackerNewsAPI.get(`/item/${itemId}.json?print=pretty`).then(
    (data) => data.data
  );
};

export default controller;
