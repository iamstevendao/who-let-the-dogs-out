import { createLocalVue, mount } from '@vue/test-utils';
import Vuex from 'vuex';
import { VuexAltPlugin } from 'vuex-alt';
import App from '../../src/App.vue';

const localVue = createLocalVue();
localVue.use(Vuex);

const store = new Vuex.Store({
  actions: {
    getAllBreeds: jest.fn(),
    getNewBreed: jest.fn(),
    save: jest.fn(),
    unsave: jest.fn(),
  },
  getters: {
    savedBreeds: () => [],
  },
});
localVue.use(VuexAltPlugin, { store });

describe('App', () => {
  it('should render correct contents', () => {
    const wrapper = mount(App, {
      localVue,
      store,
    });

    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
