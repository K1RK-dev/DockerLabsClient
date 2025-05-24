<template>
  <v-card class="edit-student-card">
    <v-card-title class="headline">Редактирование</v-card-title>
    <v-card-text>
      <v-text-field
        label="Имя"
        v-model="editedStudent.first_name"
        class="input-field"
      ></v-text-field>
      <v-text-field
        label="Фамилия"
        v-model="editedStudent.last_name"
        class="input-field"
      ></v-text-field>
      <v-text-field
        label="Отчество"
        v-model="editedStudent.middle_name"
        class="input-field"
      ></v-text-field>
      <v-text-field
        label="Пользователь"
        v-model="editedStudent.username"
        class="input-field"
      ></v-text-field>
      <v-select
        label="Группа"
        :items="groups"
        item-title="name"
        item-value="id"
        v-model="editedStudent.group_id"
        class="input-field"
      ></v-select>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveStudent" class="save-button">Сохранить</v-btn>
      <v-btn @click="cancelEdit" class="cancel-button">Отмена</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useStore } from 'vuex';
import { ref, watch, computed } from 'vue';

export default {
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const editedStudent = ref({ ...props.student });

    const groups = computed(() => store.getters['groups/allGroups']);

    watch(
      () => props.student,
      (newStudent) => {
        editedStudent.value = { ...newStudent };
      },
      { deep: true }
    );

    const saveStudent = () => {
      store.dispatch('users/updateStudent', editedStudent.value);
    };

    const cancelEdit = () => {
      editedStudent.value = { ...props.student };
    };

    return {
      editedStudent,
      groups,
      saveStudent,
      cancelEdit
    };
  }
};
</script>

<style scoped>
.edit-student-card {
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.headline {
  text-align: center;
  color: #2196F3;
  padding: 16px;
  font-weight: bold;
}

.input-field {
  margin-bottom: 15px;
}

.save-button {
  color: white;
  margin-right: 10px;
}

.cancel-button {
  color: #333;
}
</style>