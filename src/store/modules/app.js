const state = {
    apiUrl: '',
  };
  
  const mutations = {
    setApiUrl(state, apiUrl) {
      state.apiUrl = apiUrl;
    },
  };
  
  const getters = {
    apiUrl: (state) => state.apiUrl,
  };
  
  export default {
    namespaced: true,
    state,
    mutations,
    getters,
  };