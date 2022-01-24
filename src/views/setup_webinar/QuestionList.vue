<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-text-field
      v-model="search"
      label="Search"
      outlined
      dense
      append-icon="mdi-magnify"
      single-line
      hide-details
      @keyup.enter="doSearch"
    ></v-text-field>

    <v-card v-for="item in questions" :key="item.id" class="my-4">
      <v-card-title class="d-flex justify-space-between">
        {{ item.title }}
        <div>
          <v-btn icon @click="edit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-container fluid>
        <div v-html="item.question"></div>

        <div>
          <b>A.</b>
          {{ item.option_a }}
        </div>

        <div>
          <b>B.</b>
          {{ item.option_b }}
        </div>

        <div>
          <b>C.</b>
          {{ item.option_c }}
        </div>

        <div>
          <b>D.</b>
          {{ item.option_d }}
        </div>

        <br />

        <div>
          Jawaban:
          <b>{{ item.answer }}</b>
        </div>
      </v-container>
    </v-card>

    <v-pagination v-model="page" :length="pageCount" :total-visible="7" @input="getQuestion"></v-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "question-list",
  data: () => ({
    search: "",
    questions: [],
    options: "",
    page: 1,
    pageCount: 0,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async getQuestion() {
      await this.axios
        .get("/setup-webinar/v1/question?page=" + this.page, {
          params: {
            title: this.search
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.questions = data.data;
          this.page = data.current_page;
          this.pageCount = data.last_page;
          this.$vuetify.goTo(0, {
            duration: 300,
            offset: 0
          })
        });
    },
    async doSearch() {
      this.page = 1

      await this.axios
        .get("/setup-webinar/v1/question", {
          params: {
            page: this.page,
            title: this.search
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.questions = data.data;
          this.page = data.current_page;
          this.pageCount = data.last_page;
        });
    },
    edit(item) {
      this.$router.push("/setup-webinar/question?id=" + item.id);
    },
  },
  async created() {
    await this.getQuestion();
  },
};
</script>

<style>
</style>
