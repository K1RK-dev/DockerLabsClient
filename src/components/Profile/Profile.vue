<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Welcome</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="logout">Logout</v-btn>
          </v-toolbar>
          <v-card-text>
            <p class="text-gray-700 text-base">Hello, {{ username }}!</p>
            <v-text-field v-model="containerId" label="Container ID"></v-text-field>
            <v-btn @click="startTerminal" :disabled="!containerId">Start Terminal</v-btn>
            <div id="terminal" ref="terminal"></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default {
  name: 'Profile',
  setup() {
    const store = useStore();
    const router = useRouter();

    const username = computed(() => store.getters['auth/user'] ? store.getters['auth/user'].username : '');
    const containerId = ref('');
    const terminal = ref(null);
    const terminalElement = ref(null);
    const socket = ref(null);

    const startTerminal = () => {
      if (!containerId.value) {
        alert('Please enter a container ID.');
        return;
      }

      terminal.value = new Terminal();
      const fitAddon = new FitAddon();
      terminal.value.loadAddon(fitAddon);

      socket.value = io('http://localhost:5000');

      socket.value.on('connect', () => {
        console.log('Connected to WebSocket');
        socket.value.emit('start_shell', containerId.value);
      });

      socket.value.on('terminal_output', (data) => {
        terminal.value.write(data.output);
      });

      terminal.value.onData((data) => {
        socket.value.emit('terminal_input', { container_id: containerId.value, input: data });
      });

      socket.value.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
        terminal.value.write('\r\n***Disconnected from server***\r\n');
      });
    };

    onMounted(() => {
      if (terminal.value && terminalElement.value) {
        terminal.value.open(terminalElement.value);
        const fitAddon = new FitAddon();
        terminal.value.loadAddon(fitAddon);
        fitAddon.fit();
      }
    });

    const logout = async () => {
      try {
        await store.dispatch('auth/logout');
        router.push('/login');
      } catch (error) {
        console.error('Logout failed', error);
      }
    };

    onUnmounted(() => {
      if (socket.value) {
        socket.value.disconnect();
      }
      if (terminal.value) {
        terminal.value.dispose();
      }
    });

    return {
      username,
      logout,
      containerId,
      terminal,
      terminalElement,
      startTerminal,
    };
  }
};
</script>

<style scoped>
#terminal {
  background-color: black;
  color: white;
  font-family: monospace;
  font-size: 14px;
  padding: 10px;
}
</style>