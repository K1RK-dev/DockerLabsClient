<template>
  <v-card class="labs-container">
    <v-card-title class="headline">
      Лабораторные работы
    </v-card-title>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="lab in labs"
          :key="lab.id"
        >
          <v-expansion-panel-title>
            {{ lab.title }}
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <Lab :lab="lab" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import LabNode from './LabNode.vue';
import Lab from './Lab.vue';

export default {
  components: {
    LabNode,
    Lab
  },
  setup() {
    const store = useStore();
    const selectedLabId = ref(null);

    onMounted(() => {
      store.dispatch('labs/getLabs');
    });

    const labsStore = {
      labs: computed(() => store.getters['labs/allLabs']),
      isLoading: computed(() => store.getters['labs/isLoading']),
      hasError: computed(() => store.getters['labs/hasError']),
      errorMessage: computed(() => store.getters['labs/errorMessage']),
    };

    const labs = computed(() => labsStore.labs.value);
    const selectedLab = computed(() => {
      if (selectedLabId.value) {
        return labs.value.find(lab => lab.id === selectedLabId.value);
      }
      return null;
    });

    const openLab = (labId) => {
      selectedLabId.value = labId;
    };

    return {
      labsStore,
      labs,
      selectedLab,
      openLab,
    };
  }
};
</script>

<style scoped>
.labs-container {
  margin: 20px auto;
}

.headline {
  text-align: center;
}
</style>