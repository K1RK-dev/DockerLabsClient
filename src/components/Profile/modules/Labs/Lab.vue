<template>
  <v-card>
    <v-card-title>{{ lab.title }}</v-card-title>
    <v-card-text>
      <p>{{ lab.description }}</p>
      <div id="terminal"></div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="secondary"
        :disabled="loading"
        @click="createInstance"
      >
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
        ></v-progress-circular>
        <span v-else>Create instance</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import io from 'socket.io-client';
import { useStore } from 'vuex';
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  props: {
    lab: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const terminal = ref(null);
    const socket = ref(null);
    const containerId = ref(null);
    const loading = ref(false);

    onMounted(() => {
      terminal.value = new Terminal();
      const fitAddon = new FitAddon();
      terminal.value.loadAddon(fitAddon);
      terminal.value.open(document.getElementById('terminal'));
      fitAddon.fit();

      // socket.value = io('http://localhost:5000');

      // socket.value.on('connect', () => {
      //   console.log('Connected to server');
      // });

      // socket.value.on('terminal_output', (data) => {
      //   terminal.value.write(data.output);
      // });

      // terminal.value.onData((data) => {
      //   socket.value.emit('terminal_input', { container_id: containerId.value, input: data });
      // });
    });

    onBeforeUnmount(() => {
      // if (socket.value) {
      //   socket.value.disconnect();
      // }
      // if (terminal.value) {
      //   terminal.value.dispose();
      // }
    });

    const createInstance = async () => {
      loading.value = true;
      try {
        const labData = { lab_id: lab.id };
        const response = await store.dispatch('containers/create_container', labData);
        containerId.value = response.container_id;

        socket.value.emit('start_shell', containerId.value);
      } catch (error) {
        console.error('Error creating instance:', error);
      } finally {
        loading.value = false;
      }
    };

    const closeLab = () => {
    };

    return {
      terminal,
      socket,
      containerId,
      loading,
      createInstance,
      closeLab
    };
  }
};
</script>

<style scoped>
#terminal {
  height: 400px;
  width: 100%;
}
</style>