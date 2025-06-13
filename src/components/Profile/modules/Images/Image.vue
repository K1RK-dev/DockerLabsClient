<template>
  <v-card>
    <v-card-title>{{ image.name }}</v-card-title>
    <v-card-text>
      <p>Dockerfile: {{ image.dockerfile.filename }}</p>
    </v-card-text>
    <v-card-actions>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useStore } from 'vuex';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  props: {
    image: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const loading = ref(false);

    onMounted(() => {
    });

    onBeforeUnmount(() => {

    });

    return {
      loading,
    };
  }
};
</script>

<style scoped>

</style>