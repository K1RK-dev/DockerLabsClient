<template>
  <v-card class="students-container">
    <v-card-title class="headline">Студенты</v-card-title>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="student in sortedStudents"
          :key="student.id"
        >
          <v-expansion-panel-title class="student-title">
            {{ student.last_name }}
            <br>
            <span v-if="student.group">
              ({{ student.group.name }})
            </span>
            <span v-if="student.is_active" class="online-indicator">
              (online)
            </span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <Student :student="student" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import { useStore } from 'vuex';
import { computed, onMounted, ref } from 'vue';
import StudentNode from './StudentNode.vue';
import Student from './Student.vue';

export default {
  components: {
    StudentNode,
    Student
  },
  setup() {
    const store = useStore();
    const selectedStudentId = ref(null);

    onMounted(() => {
      store.dispatch('users/getStudents');
      store.dispatch('groups/getGroups');
    });

    const studentsStore = {
      students: computed(() => store.getters['users/allStudents']),
      isLoading: computed(() => store.getters['users/isLoading']),
      hasError: computed(() => store.getters['users/hasError']),
      errorMessage: computed(() => store.getters['errorMessage']),
    };

    const groups = computed(() => store.getters['groups/allGroups']);

    const students = computed(() => {
      return studentsStore.students.value.map(student => {
        const group = groups.value.find(group => group.id === student.group_id);
        return {
          ...student,
          group: group || null
        };
      });
    });

    const sortedStudents = computed(() => {
      return [...students.value].sort((a, b) => {
        if (a.is_active && !b.is_active) {
          return -1;
        } else if (!a.is_active && b.is_active) {
          return 1;
        } else {
          return 0;
        }
      });
    });

    const selectedStudent = computed(() => {
      if (selectedStudentId.value) {
        return sortedStudents.value.find(student => student.id === selectedStudentId.value);
      }
      return null;
    });

    const openStudent = (studentId) => {
      selectedStudentId.value = studentId;
    };

    return {
      studentsStore,
      students,
      sortedStudents,
      selectedStudent,
      openStudent,
    };
  }
};
</script>

<style scoped>
.students-container {
  margin: 20px auto;
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.headline {
  text-align: center;
  color: #2196F3;
  padding: 16px;
  font-weight: bold;
}

.student-title {
  font-weight: 500;
  color: #333;
}

.online-indicator {
  color: green;
  font-size: 0.8em;
  margin-left: 5px;
}
</style>