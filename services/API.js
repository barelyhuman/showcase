import axios from 'axios';
const controller = {};

const API = axios.create({
  baseURL: 'https://hacker-news.firebaseio.com/v0',
});

controller.getShowStories = () => {
  return API.get('/showstories.json?print=pretty').then((data) => data.data);
};

controller.getItemDetails = (itemId) => {
  return API.get(`/item/${itemId}.json?print=pretty`).then((data) => data.data);
};

export default controller;
