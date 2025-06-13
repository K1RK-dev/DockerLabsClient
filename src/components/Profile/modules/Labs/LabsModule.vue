<template>
  <v-card class="labs-container">
    <v-card-title class="headline">
      Лабораторные работы
      <v-btn v-if="isAdminOrTeacher" color="primary" @click="openCreateDialog">
        <v-icon left>mdi-plus</v-icon>
        Добавить
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel v-for="lab in labs" :key="lab.id">
          <v-expansion-panel-title>
            {{ lab.title }}
            <v-spacer></v-spacer>
            <v-btn
              v-if="isAdminOrTeacher"
              icon
              small
              class="mr-2"
              @click.stop="openEditDialog(lab)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="isAdminOrTeacher"
              icon
              small
              class="mr-2"
              @click.stop="deleteLab(lab.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <Lab :lab="lab" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          {{ editingLab ? 'Редактировать' : 'Добавить' }} лабораторную работу
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="labForm.title" label="Название"></v-text-field>
          <v-textarea v-model="labForm.description" label="Описание"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="primary" @click="saveLab">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import Lab from './Lab.vue';

export default {
  components: {
    Lab,
  },
  setup() {
    const store = useStore();
    const dialog = ref(false);
    const editingLab = ref(null);
    const labForm = ref({
      title: '',
      description: '',
    });

    onMounted(() => {
      store.dispatch('labs/getLabs');
    });

    const labsStore = {
      labs: computed(() => store.getters['labs/allLabs']),
      isLoading: computed(() => store.getters['labs/isLoading']),
      hasError: computed(() => store.getters['labs/hasError']),
      errorMessage: computed(() => store.getters['errorMessage']),
    };

    const labs = computed(() => labsStore.labs.value);

    const userRole = computed(() => store.getters['auth/userRole']);
    console.log(userRole)

    const isAdminOrTeacher = computed(() => {
      return userRole.value === 'ADMIN' || userRole.value === 'TEACHER';
    });

    const openCreateDialog = () => {
      editingLab.value = null;
      labForm.value = { title: '', description: '' };
      dialog.value = true;
    };

    const openEditDialog = (lab) => {
      editingLab.value = lab;
      labForm.value = { ...lab };
      dialog.value = true;
    };

    const closeDialog = () => {
      dialog.value = false;
    };

    const saveLab = () => {
      if (editingLab.value) {
        store.dispatch('labs/updateLab', labForm.value);
      } else {
        store.dispatch('labs/createLab', labForm.value);
      }
      closeDialog();
    };

    const deleteLab = (labId) => {
      if (confirm('Вы уверены, что хотите удалить эту лабораторную работу?')) {
        store.dispatch('labs/deleteLab', labId);
      }
    };

    return {
      dialog,
      editingLab,
      labForm,
      labsStore,
      labs,
      openCreateDialog,
      openEditDialog,
      closeDialog,
      saveLab,
      deleteLab,
      isAdminOrTeacher,
    };
  },
};
</script>

<style scoped>
.labs-container {
  margin: 20px auto;
}

.headline {
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>