<template>
    <v-card class="student-node">
      <v-card-actions>
        <v-btn color="primary" @click="openStudent">Open Student</v-btn>
      </v-card-actions>
    </v-card>
</template>
  
<script>
    export default {
        props: {
        student: {
            type: Object,
            required: true
        }
        },
    emits: ['open-student'],
    methods: {
      openStudent() {
        this.$emit('open-student', this.student.id);
      }
    }
  };
</script>
  
<style scoped>
    .student-node {
        margin-bottom: 16px;
    }
</style>