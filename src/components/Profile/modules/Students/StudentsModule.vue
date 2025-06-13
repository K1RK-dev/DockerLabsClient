<template>
  <v-card class="students-container">
    <v-card-title class="headline">Студенты</v-card-title>
    <v-card-text>
      <v-text-field
          v-model="searchQuery"
          label="Поиск студентов"
          outlined
          dense
          class="search-field"
      ></v-text-field>

      <div class="sort-buttons">
        <v-btn @click="toggleGroupSort" :color="groupSortOrder ? 'primary' : ''">
          Сортировать по группе: {{ sortButtonText }}
        </v-btn>
      </div>

      <div v-if="groupedAndSortedStudents.length === 0">Нет студентов для отображения.</div>
      <div v-else>
        <div v-for="(group, index) in groupedAndSortedStudents" :key="index" class="group-container">
          <h3 v-if="group.groupName">Группа: {{ group.groupName }}</h3>
          <h3 v-else>Без группы</h3>
          <v-expansion-panels>
            <v-expansion-panel v-for="student in group.students" :key="student.id">
              <v-expansion-panel-title class="student-title">
                {{ student.last_name }} {{ student.first_name.charAt(0) }}.{{ student.middle_name.charAt(0) }}.
                <span v-if="student.is_active" class="online-indicator">
                  (online)
                </span>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <Student :student="student" />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Student from './Student.vue';

export default {
  components: {
    Student,
  },
  setup() {
    const store = useStore();
    const searchQuery = ref('');
    const groupSortOrder = ref(null);

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
      return studentsStore.students.value.map((student) => {
        const group = groups.value.find((group) => group.id === student.group_id);
        return {
          ...student,
          group: group || null,
        };
      });
    });

    const groupedAndSortedStudents = computed(() => {
      const query = searchQuery.value.toLowerCase().trim();
      let filteredStudents = students.value.filter((student) => {
        const fullName = `${student.last_name} ${student.first_name.charAt(0)}.${student.middle_name.charAt(0)}.`;
        return fullName.toLowerCase().includes(query);
      });

      const grouped = {};
      filteredStudents.forEach((student) => {
        const groupId = student.group ? student.group.id : null;
        if (!grouped[groupId]) {
          grouped[groupId] = {
            groupId: groupId,
            groupName: student.group ? student.group.name : null,
            students: [],
          };
        }
        grouped[groupId].students.push(student);
      });

      let groupedArray = Object.values(grouped);

      if (groupSortOrder.value === 'asc') {
        groupedArray.sort((a, b) => {
          if (a.groupName === null && b.groupName === null) return 0;
          if (a.groupName === null) return 1;
          if (b.groupName === null) return -1;
          return a.groupName.localeCompare(b.groupName, 'ru', { sensitivity: 'base' });
        });
      } else if (groupSortOrder.value === 'desc') {
        groupedArray.sort((a, b) => {
          if (a.groupName === null && b.groupName === null) return 0;
          if (a.groupName === null) return 1;
          if (b.groupName === null) return -1;
          return b.groupName.localeCompare(a.groupName, 'ru', { sensitivity: 'base' });
        });
      }

      groupedArray.forEach((group) => {
        group.students.sort((a, b) => {
          if (a.is_active && !b.is_active) return -1;
          if (!a.is_active && b.is_active) return 1;
          return 0;
        });
      });

      return groupedArray;
    });

    const sortButtonText = computed(() => {
      if (groupSortOrder.value === 'asc') {
        return 'По возрастанию';
      } else if (groupSortOrder.value === 'desc') {
        return 'По убыванию';
      } else {
        return 'Не сортировать';
      }
    });

    const toggleGroupSort = () => {
      if (groupSortOrder.value === null) {
        groupSortOrder.value = 'asc';
      } else if (groupSortOrder.value === 'asc') {
        groupSortOrder.value = 'desc';
      } else {
        groupSortOrder.value = null;
      }
    };

    return {
      searchQuery,
      groupedAndSortedStudents,
      toggleGroupSort,
      groupSortOrder,
      sortButtonText,
    };
  },
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
  color: #2196f3;
  padding: 16px;
  font-weight: bold;
}

.sort-buttons {
  margin-bottom: 16px;
}

.search-field {
  margin-bottom: 16px;
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

.group-container {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #eee;
}
</style>
