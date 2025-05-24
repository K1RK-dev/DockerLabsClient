import axiosInstance from '../../plugins/axios.js';

const state = {
  students: [],
  loading: false,
  error: null,
};

const getters = {
  allStudents: (state) => state.students,
  isLoading: (state) => state.loading,
  hasError: (state) => state.error !== null,
  errorMessage: (state) => state.error,
};

const mutations = {
  SET_STUDENTS(state, students) {
    state.students = students;
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
  async getStudents({ commit, rootGetters }) {
    commit('SET_LOADING', true);
    commit('SET_ERROR', null);
    try {
      const apiUrl = rootGetters['app/apiUrl'];
      const response = await axiosInstance.get(`${apiUrl}/users/get_students`);
      const students = response.data.students.map(student => ({
        id: student.id,
        username: student.username,
        group_id: student.group_id,
        is_active: student.is_active,
        role_id: student.role_id,
        first_name: student.first_name,
        last_name: student.last_name,
        middle_name: student.middle_name
      }));
      console.log(students);
      commit('SET_STUDENTS', students);
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