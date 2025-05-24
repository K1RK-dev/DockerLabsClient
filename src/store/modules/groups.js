import axiosInstance from '../../plugins/axios.js';

const state = {
  groups: [],
  loading: false,
  error: null,
};

const getters = {
  allGroups: (state) => state.groups,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error !== null,
  errorMessage: (state) => state.error,
};

const mutations = {
  SET_GROUPS(state, groups) {
    state.groups = groups;
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
};

const actions = {
  async getGroups({ commit, rootGetters }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.get(`${apiUrl}/groups/get_groups`);
      const groups = response.data.groups.map(group => ({
        id: group.id,
        name: decodeURIComponent(group.name)
      }));
      commit('SET_GROUPS', groups);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || error.message);
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