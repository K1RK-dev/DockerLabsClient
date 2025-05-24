import axiosInstance from '@/utils/axios';

const state = {
  containers: [],
  loading: false,
  error: null
};

const getters = {
  allContainers: (state) => state.containers,
  isLoading: (state) => state.loading,
  getError: (state) => state.error
};

const actions = {
  async createContainer({ commit, rootGetters }, labId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);

    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.post(`${apiUrl}/containers/create_container`, { lab_id: labId });

      commit('SET_CONTAINER', response.data.container_id);
      return response.data;
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
      const response = await axiosInstance.get(`${apiUrl}/containers`); // Замените на ваш эндпоинт для получения списка контейнеров

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
  SET_CONTAINER(state, containerId) {
    state.containers.push(containerId);
  },
  REMOVE_CONTAINER(state, containerId) {
    state.containers = state.containers.filter(container => container.container_id !== containerId);
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  CLEAR_ERROR(state) {
    state.error = null;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};