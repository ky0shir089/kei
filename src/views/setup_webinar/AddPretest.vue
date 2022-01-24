<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-form v-model="valid">
        <v-row>
          <v-col cols="12">
            <h4>Kelas</h4>

            <v-autocomplete
              v-model="form.webinar"
              placeholder="Kelas"
              outlined
              dense
              :items="webinars"
              item-text="webinar_name"
              item-value="id"
              return-object
              :rules="[rules.required]"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-data-table
              :headers="headers"
              :items="questions"
              :items-per-page="10"
              hide-default-footer
              class="elevation-1"
              dense
              :loading="loading"
            >
              <template v-slot:item.question="{ item }">
                <div v-html="item.question"></div>
              </template>
              -
              <template v-slot:item.option="{ item }">
                <ul>
                  <li>A. {{ item.option_a }}</li>
                  <li>B. {{ item.option_b }}</li>
                  <li>C. {{ item.option_c }}</li>
                  <li>D. {{ item.option_d }}</li>
                </ul>
              </template>

              <template v-slot:item.answer="{ item }">
                <b>{{ item.answer }}</b>
              </template>

              <template v-slot:item.action="{ item }">
                <v-checkbox v-model="form.question_id" :value="item.id" :rules="[rules.required]"></v-checkbox>
              </template>
            </v-data-table>

            <br />

            <v-pagination
              v-model="page"
              :length="pageCount"
              :total-visible="7"
              @input="getQuestion"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-form>

      <br />

      <v-btn
        block
        color="primary"
        :disabled="!valid || form.question_id == 0"
        :loading="loading"
        @click="simpan"
      >Simpan</v-btn>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "pre-test",
  data: () => ({
    valid: true,
    form: {
      webinar: [],
      question_id: [],
    },
    rules: {
      required: (value) => !!value || "This field is required.",
    },
    webinars: [],
    headers: [
      { text: "ID", value: "id" },
      { text: "Title", value: "title" },
      { text: "Soal", value: "question" },
      { text: "Opsi", value: "option" },
      { text: "Jawaban", value: "answer" },
      { text: "Action", value: "action", sortable: false },
    ],
    questions: [],
    options: "",
    page: 1,
    pageCount: 0,
    loading: false,
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
    async getWebinar() {
      await this.axios
        .get("/setup-webinar/v1/jadwal-webinar", {
          params:{
            webinar_class: "SESI"
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data.data
        });
    },
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
          this.loading = false;
        });
    },
    async simpan() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true

        let formData = new FormData();
        formData.set("webinar_id", this.form.webinar.id);
        formData.set("question_id", JSON.stringify(this.form.question_id));
        formData.set("created_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/add-pretest", formData, {
            headers: {
              Authorization: "Bearer " + this.user.api_token,
            },
          })
          .then((response) => {
            let { data } = response;
            this.setAlert({
              status: true,
              color: "success",
              text: data.message,
            });
            this.loading = false;
            if (this.form.webinar.webinar_class == "SESI") {
              this.$router.push("/kelas/webinar-list")
            } else {
              this.$router.push("/paket/package-list")
            }
          })
          .catch((error) => {
            let responses = error.response.data;
            this.setAlert({
              status: true,
              color: "error",
              text: responses.message,
            });
            this.loading = false;
          });
      }
    },
  },
  async created() {
    await this.getWebinar()
    await this.getQuestion();
  },
};
</script>

<style>
</style>
