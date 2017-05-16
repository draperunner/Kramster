import qs from 'qs';
import 'whatwg-fetch';

/*
 * Methods for communicating with API.
 */
const API = {

  // Gets an array and forwards it to callback function.
  get(url, params) {
    return fetch(`${url}?${qs.stringify(params)}`)
      .then(res => res.json());
  },

  // Gets n random questions
  getRandom(url, n) {
    const params = {
      random: 'true',
      limit: n,
    };

    // $rootScope.loading = true;
    return fetch(`${url}?${qs.stringify(params)}`).then(res =>
      // $rootScope.loading = false;
       res.json());
  },

  // Gets n hardest questions
  getHardest(url, n) {
    const params = {
      hardest: 'true',
      limit: n,
    };

    // $rootScope.loading = true;
    return fetch(`${url}?${qs.stringify(params)}`).then(res =>
      // $rootScope.loading = false;
       res.json());
  },

        // Gets the selected exam(s) and passes on to callback.
  getSelected(url, params) {
    // $rootScope.loading = true;
    return fetch(`${url}?${qs.stringify(params)}`).then(res =>
      // $rootScope.loading = false;
       res.json());
  },

  // Gets all questions of all exams of given url and passes to callback.
  getAll(url) {
    // $rootScope.loading = true;
    return fetch(url).then(res => res.json().then(data =>
      // $rootScope.loading = false;
       data.map(exam => exam.questions).reduce((a, b) => a.concat(b))));
  },

  // HTTP POST JSON body
  post(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(res => res.json());
  },
};

export default API;