import axiosInstance from '../../plugins/axios.js'

const state = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
    state.isLoggedIn = !!user;
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

const actions = {
  async login({ commit }, { username, password, apiUrl }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    try {
      const response = await axiosInstance.post(`${apiUrl}/auth/login`, {
        username,
        password
      });
      const user = response.data;
      localStorage.setItem('username', user.username);
      commit('SET_USER', user);
      return user;
    } catch (error) {
      commit('SET_ERROR', error.message || 'Login failed');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async register({ commit, rootGetters }, { username, password }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.post(`${apiUrl}/auth/register`, {
        username,
        password
      });
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || 'Registration failed');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async logout({ commit, rootGetters }) {
    commit('SET_LOADING', true);
    commit('CLEAR_ERROR');
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      await axiosInstance.post(`${apiUrl}/auth/logout`);
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      commit('SET_USER', null);
    } catch (error) {
      commit('SET_ERROR', error.message || 'Logout failed');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const getters = {
  user: state => state.user,
  isLoggedIn: state => state.isLoggedIn,
  isLoading: state => state.loading,
  error: state => state.error
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};