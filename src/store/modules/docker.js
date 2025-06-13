import axiosInstance from '../../plugins/axios.js';

const state = {
  images: [],
  containers: [],
  loading: false,
  error: null,
};

const getters = {
  allImages: (state) => state.images,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error !== null,
  errorMessage: (state) => state.error,
  isRunning: (state) => (containerId) => state.containers.includes(containerId),
};

const mutations = {
  SET_IMAGES(state, images) {
    state.images = images;
  },
  ADD_CONTAINER(state, containerId) {
    state.containers.push(containerId);
  },
  REMOVE_CONTAINER(state, containerId) {
    state.containers = state.containers.filter(id => id !== containerId);
  },
  SET_CONTAINERS(state, containers) {
    state.containers = containers;
  },
  SET_LOADING(state, isLoading) {
    state.loading = isLoading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
};

const actions = {
  async getImages({ commit, rootGetters }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.get(`${apiUrl}/docker/get_images`);
      const images = response.data.images.map(image => ({
        id: image.id,
        image_id: image.image_id,
        name: image.name,
        user_id: image.user_id,
        dockerfile: image.dockerfile
      }));
      commit('SET_IMAGES', images);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || error.message);
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async startContainer({ commit, rootGetters }, imageId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.post(`${apiUrl}/docker/start_container/${imageId}`);
      const containerId = response.data.id;
      commit('ADD_CONTAINER', containerId);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.msg || error.message);
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async stopContainer({ commit, rootGetters }, containerId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      await axiosInstance.post(`${apiUrl}/docker/stop_container/${containerId}`);
      commit('REMOVE_CONTAINER', containerId);
      return true;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.msg || error.message);
      return Promise.reject(error);
    } finally {
      commit('SET_LOADING', false);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};