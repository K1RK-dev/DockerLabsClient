import axiosInstance from '../../plugins/axios.js';

const state = {
  containers: [],
  loading: false,
  error: null,
  runningContainers: {}
};

const getters = {
  allContainers: (state) => state.containers,
  isLoading: (state) => state.loading,
  getError: (state) => state.error,
  isRunning: (state) => (containerId) => !!state.runningContainers[containerId]
};

const actions = {
  async createContainer({ commit, rootGetters }, labId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.post(`${apiUrl}/containers/create_container`, labId);

      if (response.data && response.data.container_id) {
        const containerId = response.data.container_id;
        commit('ADD_CONTAINER', containerId);
        commit('SET_RUNNING', containerId);
        return response.data;
      } else {
        const errorMessage = 'Server did not return container_id';
        commit('SET_ERROR', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.msg || error.message);
      throw error;
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

      commit('SET_STOPPED', containerId);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.msg || error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deleteContainer({ commit, rootGetters }, containerId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const apiUrl = rootGetters['app/apiUrl'];
      await axiosInstance.delete(`${apiUrl}/containers/delete_container/${containerId}`);

      commit('REMOVE_CONTAINER', containerId);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.msg || error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async getContainers({ commit, rootGetters }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.get(`${apiUrl}/containers`);

      commit('SET_CONTAINERS', response.data);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.msg || error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const mutations = {
  SET_CONTAINERS(state, containers) {
    state.containers = containers;
  },
  ADD_CONTAINER(state, containerId) {
    state.containers.push(containerId);
  },
  REMOVE_CONTAINER(state, containerId) {
    state.containers = state.containers.filter(container => container !== containerId);
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  CLEAR_ERROR(state) {
    state.error = null;
  },
  SET_RUNNING(state, containerId) {
    state.runningContainers = { ...state.runningContainers, [containerId]: true };
  },
  SET_STOPPED(state, containerId) {
    const { [containerId]: removed, ...rest } = state.runningContainers;
    state.runningContainers = rest;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};