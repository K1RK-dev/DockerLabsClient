<template>
  <v-card>
    <v-card-title>{{ lab.title }}</v-card-title>
    <v-card-text>
      <p>{{ lab.description }}</p>
      <div ref="terminalContainer" v-if="terminalVisible"></div>
    </v-card-text>
    <v-card-actions>
      <v-btn
          color="secondary"
          :disabled="loading"
          @click="toggleInstance"
      >
        <v-progress-circular
            v-if="loading"
            indeterminate
            color="white"
        ></v-progress-circular>
        <span v-else>{{ buttonText }}</span>
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
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'; // Добавляем импорты watch и nextTick

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
    const terminalInitialized = ref(false);
    const terminalVisible = ref(false);
    const terminalContainer = ref(null);
    const currentCommand = ref('');

    const isContainerRunning = computed(() => {
      return containerId.value ? store.getters['containers/isRunning'](containerId.value) : false;
    });

    const buttonText = computed(() => {
      return isContainerRunning.value ? 'Остановить контейнер' : 'Запустить контейнер';
    });

    onBeforeUnmount(() => {
      if (socket.value) {
        socket.value.disconnect();
      }
      if (terminal.value) {
        terminal.value.dispose();
      }
    });

    const initializeTerminal = () => {
      if (terminalInitialized.value) return;

      terminal.value = new Terminal();
      const fitAddon = new FitAddon();
      terminal.value.loadAddon(fitAddon);
      terminal.value.open(terminalContainer.value);
      fitAddon.fit();

      socket.value = io('http://localhost:5000');

      socket.value.on('connect', () => {
        console.log('Connected to server');
        socket.value.emit('get_terminal_info', { container_id: containerId.value });
      });

      socket.value.on('terminal_info', (data) => {
        terminal.value.write(`${data.user}@${
            data.host
        }$ `);
      });

      socket.value.on('terminal_output', (data) => {
        terminal.value.write(data.output);
      });

      terminal.value.onData((data) => {
        if (data === '\r') {
          socket.value.emit('terminal_input', { container_id: containerId.value, input: currentCommand.value + '\n' });
          terminal.value.write('\r\n');
          currentCommand.value = '';
        } else if (data === '\x7f') {
          if (currentCommand.value.length > 0) {
            currentCommand.value = currentCommand.value.slice(0, -1);
            terminal.value.write('\x08 \x08');
          }
        } else if (data === '\x03') {
          socket.value.emit('terminal_input', { container_id: containerId.value, input: '\x03' });
          terminal.value.write('^C');
          currentCommand.value = '';
        } else {
          currentCommand.value += data;
          terminal.value.write(data);
        }
      });
    };

    const createInstance = async () => {
      loading.value = true;
      try {
        const labData = { lab_id: props.lab.id };
        const response = await store.dispatch('containers/createContainer', labData);

        if (response && response.container_id) {
          terminalVisible.value = true;
          containerId.value = response.container_id;
          const startContainerResponse = await store.dispatch('docker/startContainer', containerId.value);
          if (startContainerResponse) {
            socket.value.emit('start_shell', containerId.value);
          }
          else {
            console.log("Failed to start container", startContainerResponse);
            terminalVisible.value = false;
          }
        } else {
          console.error('Failed to create container:', response);
          terminalVisible.value = false;
        }
      } catch (error) {
        terminalVisible.value = false;
      } finally {
        loading.value = false;
      }
    };

    const toggleInstance = () => {
      if (isContainerRunning.value) {

      } else {
        createInstance();
      }
    };

    watch(terminalVisible, (newValue) => {
      if (newValue) {
        nextTick(() => {
          initializeTerminal();
        });
      } else {
        if (terminal.value) {
          terminal.value.dispose();
          terminalInitialized.value = false;
        }
      }
    });

    return {
      terminal,
      socket,
      containerId,
      loading,
      terminalInitialized,
      terminalVisible,
      isContainerRunning,
      buttonText,
      toggleInstance,
      terminalContainer,
      currentCommand,
    };
  }
}
</script>

<style scoped>
#terminal {
  height: 400px;
  width: 100%;
}
</style>