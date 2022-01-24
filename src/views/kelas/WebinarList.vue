<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <h2>List Webinar</h2>

    <v-row>
      <v-col cols="6" sm="3">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="search.webinar_start_date"
              placeholder="Tanggal"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              outlined
              dense
            ></v-text-field>
          </template>

          <v-date-picker
            v-model="search.webinar_start_date"
            @change="doSearch"
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="6" sm="3">
        <v-autocomplete
          v-model="search.category_id"
          label="Category"
          outlined
          dense
          :items="categories"
          item-text="webinar_category"
          item-value="id"
          @change="doSearch"
          clearable
        ></v-autocomplete>
      </v-col>

      <v-col cols="6" sm="3">
        <v-autocomplete
          v-model="search.level_id"
          label="Level"
          outlined
          dense
          :items="levels"
          item-text="webinar_level"
          item-value="id"
          @change="doSearch"
          clearable
        ></v-autocomplete>
      </v-col>

      <v-col cols="6" sm="3">
        <v-autocomplete
          v-model="search.webinar_status"
          label="Status"
          outlined
          dense
          :items="status"
          @change="doSearch"
          clearable
        ></v-autocomplete>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="webinars"
      :items-per-page="20"
      hide-default-footer
      class="elevation-1"
      dense
      :loading="loading"
      show-expand
    >
      <template v-slot:item.webinar_start_date="{ item }">
        <div>{{ moment(item.webinar_start_date).format("DD/MM/YYYY") }}</div>
        <div>{{ item.webinar_start_time.substr(0, 5) }} WIB</div>
      </template>

      <template v-slot:item.webinar_status="{ item }">
        <div class="red--text" v-if="item.webinar_status == 'NOT READY'">{{ item.webinar_status }}</div>

        <div class="green--text" v-if="item.webinar_status == 'READY'">{{ item.webinar_status }}</div>

        <div v-if="item.webinar_status == 'DONE'">{{ item.webinar_status }}</div>
      </template>

      <template v-slot:item.webinar_price="{ item }">
        <v-chip color="primary">{{ item.webinar_price.toLocaleString("id-ID") }}</v-chip>
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn icon @click="edit(item)">
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>

        <v-btn icon @click="view(item)">
          <v-icon small>mdi-eye</v-icon>
        </v-btn>
      </template>

      <template v-slot:item.webinar_publish="{ item }">
        <v-btn
          small
          color="blue"
          dark
          @click="publish(item)"
          v-if="item.webinar_publish == 'NO'"
        >PUBLISH</v-btn>

        <div v-else>YES</div>
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-data-table
            :headers="headers2"
            :items="item.question"
            :items-per-page="10"
            class="elevation-1"
            dense
          >
            <template v-slot:top>
              <v-toolbar flat dense>
                <v-toolbar-title>List Soal</v-toolbar-title>
              </v-toolbar>
            </template>

            <template v-slot:item.question="{ item }">
              <div v-html="item.question"></div>
            </template>

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
          </v-data-table>
        </td>
      </template>
    </v-data-table>

    <br />

    <v-pagination v-model="page" :length="pageCount" :total-visible="7" @input="doSearch"></v-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "webinar-list",
  data: () => ({
    headers: [
      { text: "ID", value: "id" },
      { text: "Tanggal", value: "webinar_start_date" },
      { text: "Kategori", value: "webinar_category" },
      { text: "Nama Kelas", value: "webinar_name" },
      { text: "Mentor", value: "mentor_name" },
      { text: "Level", value: "webinar_level" },
      { text: "Peserta", value: "peserta" },
      { text: "Kuota", value: "webinar_quota" },
      { text: "Status", value: "webinar_status" },
      { text: "Harga", value: "webinar_price", align: "right" },
      { text: "Publish", value: "webinar_publish" },
      { text: "Action", value: "action", sortable: false },
      { text: "", value: "data-table-expand" },
    ],
    webinars: [],
    menu: false,
    search: {
      webinar_start_date: null,
      category_id: "",
      level_id: "",
      webinar_status: "",
    },
    categories: [],
    levels: [],
    status: ["NOT READY", "READY", "DONE"],
    loading: false,
    page: 1,
    pageCount: 0,
    expanded: [],
    headers2: [
      { text: "ID", value: "question_id" },
      { text: "Title", value: "title" },
      { text: "Soal", value: "question" },
      { text: "Opsi", value: "option" },
      { text: "Jawaban", value: "answer" },
    ],
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
    async initialize() {
      await this.axios
        .get("/setup-webinar/v1/jadwal-webinar?page=" + this.page, {
          params: {
            webinar_class: "SESI",
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data.data;
          this.page = data.current_page;
          this.pageCount = data.last_page;
        });
    },
    async getCategory() {
      await this.axios
        .get("/setup-webinar/v1/webinar_category", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.categories = data;
        });
    },
    async getLevel() {
      await this.axios
        .get("/setup-webinar/v1/webinar_level", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.levels = data;
        });
    },
    async doSearch() {
      await this.axios
        .get("/setup-webinar/v1/jadwal-webinar?page=" + this.page, {
          params: {
            webinar_class: "SESI",
            webinar_start_date: this.search.webinar_start_date,
            category_id: this.search.category_id,
            level_id: this.search.level_id,
            webinar_status: this.search.webinar_status,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data.data;
          this.page = data.current_page;
          this.pageCount = data.last_page;
        });
    },
    edit(item) {
      this.$router.push("/kelas/add-webinar?id=" + item.id);
    },
    view(item) {
      this.$router.push("/kelas/webinar-detail/" + item.id);
    },
    async publish(item) {
      let r = confirm("Apakah anda yakin akan mempublish data berikut?");

      if (r) {
        let formData = new FormData();
        formData.set("id", item.id);
        formData.set("webinar_publish", "YES");
        formData.set("updated_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/publish", formData, {
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
            this.initialize()
          })
      }
    },
  },
  async created() {
    await this.initialize();
    await this.getCategory();
    await this.getLevel();
  },
};
</script>

<style>
</style>