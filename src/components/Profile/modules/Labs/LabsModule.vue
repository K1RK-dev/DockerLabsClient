<template>
  <div>
    <h1>Labs</h1>
    <div v-if="labsStore.isLoading">Loading...</div>
    <div v-if="labsStore.hasError" style="color: red;">Error: {{ labsStore.errorMessage }}</div>

    <ul>
      <li v-for="lab in labs" :key="lab.id">
        {{ lab.title }} - {{ lab.description }}
      </li>
    </ul>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed, onMounted } from 'vue';

export default {
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch('labs/getLabs');
    });

    const labsStore = {
      labs: computed(() => store.getters['labs/allLabs']),
      isLoading: computed(() => store.getters['labs/isLoading']),
      hasError: computed(() => store.getters['labs/hasError']),
      errorMessage: computed(() => store.getters['labs/errorMessage']),
    };

    return {
      labsStore,
      labs: computed(() => labsStore.labs.value),
    };
  }
};
</script>