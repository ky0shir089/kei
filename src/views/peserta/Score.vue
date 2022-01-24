<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-card width="400" class="mx-auto my-16" align="center">
      <v-container fluid>
        <h1>Score Anda</h1>
        <h2>{{ score }}</h2>
      </v-container>

      <v-card-actions>
        <v-btn block color="primary" @click="$router.push('/peserta/my-learning')">Kembali</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "post-test-score",
  data: () => ({
    score: 0,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      posttest: "posttest/posttest",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setPretest: "pretest/set",
    }),
  },
  created() {
    this.score = this.posttest.length * 10
    this.setPretest({})
  }
}
</script>

<style>
</style>