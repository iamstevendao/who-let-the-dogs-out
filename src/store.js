import Vue from 'vue';
import Vuex from 'vuex';
import createPersist from 'vuex-localstorage';
import axios from 'axios';
import { getValue } from './helpers';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersist({
      namespace: 'who-let-the-dog-out',
      initialState: {
        viewed: [],
        saved: [],
        all: [],
      },
      // 1 WEEK
      expires: 7 * 24 * 60 * 60 * 1e3,
    }),
  ],
  getters: {
    savedBreeds: state => state.saved,
  },
  state: {
    viewed: [],
    saved: [],
    all: [],
  },
  mutations: {
    SET_ALL: (state, data = []) => {
      state.all = data;
    },
    VIEW: (state, data) => {
      if (!state.viewed) {
        state.viewed = [];
      }
      state.viewed.push(data);
    },
    SAVE: (state, data) => {
      if (!state.saved) {
        state.saved = [];
      }
      state.saved.push(data);
    },
    UNSAVE: (state, data) => {
      if (!state.saved) {
        state.saved = [];
        return;
      }
      const index = state.saved.findIndex(({ name }) => name === data);
      if (index >= 0) {
        state.saved.splice(index, 1);
      }
    },
  },
  actions: {
    save({ commit }, obj) {
      return new Promise((resolve, reject) => {
        if (!getValue(obj, 'name') || !getValue(obj, 'image')) {
          return reject(new Error('Unable to save this image'));
        }
        commit('SAVE', obj);
        return resolve(true);
      });
    },
    unsave({ commit }, breed) {
      commit('UNSAVE', breed);
    },
    getAllBreeds({ state, commit }) {
      return new Promise((resolve, reject) => {
        // Check in the cache first
        if (getValue(state, 'all.length')) {
          resolve(state.all);
          return;
        }
        // If there is no cache, send a request to get all breeds
        axios.get(process.env.VUE_APP_LIST_ALL_BREEDS, { crossdomain: true })
          .then(({ data = {} }) => {
            if (data.status !== 'success' || !Object.keys(data.message || {}).length) {
              return reject(new Error('Unable to find any breeds'));
            }
            commit('SET_ALL', Object.keys(data.message));
            return resolve(Object.keys(data.message));
          })
          .catch(error => reject(error));
      });
    },
    getNewBreed({ state, commit }) {
      // Get all unseenBreeds
      const unseenBreeds = getValue(state, 'all', [])
        .filter(breed => !(state.viewed || []).includes(breed));

      let url = process.env.VUE_APP_IMAGE_BY_BREED;
      if (!unseenBreeds.length) {
        // If all breeds are seen, well, we random a new one
        url = url.replace('/BREED_NAME', '');
      } else {
        // Random one among new breeds
        const randomBreed = unseenBreeds[Math.floor(Math.random() * unseenBreeds.length)];
        url = url.replace('BREED_NAME', randomBreed);
      }

      return new Promise((resolve, reject) => {
        axios.get(url, { crossdomain: true })
          .then(({ data = {} }) => {
            if (data.status !== 'success' || !getValue(data, 'message')) {
              return reject(new Error('Unable to find any images'));
            }
            // Try to get the breed name from the URL
            const image = data.message;
            const splitByBreed = image.split('breeds/')[1];
            let name = '';
            if (splitByBreed) {
              ([name] = splitByBreed.split('/'));
            }
            commit('VIEW', { name, image });
            return resolve({ name, image });
          }).catch(error => reject(error));
      });
    },
  },
});
