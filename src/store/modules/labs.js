import axiosInstance from '../../plugins/axios.js';

const state = {
  labs: [],
  loading: false,
  error: null,
  selectedLab: null
};

const getters = {
  allLabs: (state) => state.labs,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error !== null,
  errorMessage: (state) => state.error,
  selectedLab: (state) => state.selectedLab
};

const mutations = {
  SET_LABS(state, labs) {
    state.labs = labs;
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
  SET_SELECTED_LAB(state, lab) {
    state.selectedLab = lab;
  }
};

const actions = {
  async getLabs({ commit, rootGetters }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.get(`${apiUrl}/labs/get_labs`);
      commit('SET_LABS', response.data.labs);
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async createLab({ commit, rootGetters }, labData) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.post(`${apiUrl}/labs/create_lab`, labData);
      await commit('CLEAR_ERROR');
      await this.dispatch('labs/getLabs');
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.msg || error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deleteLab({ commit, rootGetters }, labId) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.delete(`${apiUrl}/labs/delete_lab/${labId}`);
      await this.dispatch('labs/getLabs');
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.msg || error.message);
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  setSelectedLab({ commit }, lab) {
    commit('SET_SELECTED_LAB', lab);
  },

  clearSelectedLab({ commit }) {
    commit('SET_SELECTED_LAB', null);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};