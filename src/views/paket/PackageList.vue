<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <h2>List Paket Webinar</h2>

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
            type="month"
            @change="doSearch"
            @input="menu = false"
          ></v-date-picker>
        </v-menu>
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
    >
      <template v-slot:item.webinar_start_date="{ item }">
        <div>{{ moment(item.webinar_start_date).format("MMMM") }}</div>
      </template>

      <template v-slot:item.webinar_session="{ item }">{{ item.webinar_session | count }}</template>

      <template v-slot:item.webinar_status="{ item }">
        <div class="red--text" v-if="item.webinar_status == 'NOT READY'">{{ item.webinar_status }}</div>

        <div class="green--text" v-if="item.webinar_status == 'READY'">{{ item.webinar_status }}</div>

        <div v-if="item.webinar_status == 'DONE'">{{ item.webinar_status }}</div>
      </template>
      -
      <template v-slot:item.webinar_price="{ item }">
        <v-chip color="primary">{{ item.webinar_price.toLocaleString("id-ID") }}</v-chip>
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

      <template v-slot:item.action="{ item }">
        <v-icon small @click="edit(item)" v-if="item.webinar_publish == 'NO'">mdi-pencil</v-icon>
      </template>

      <!-- <template v-slot:expanded-item="{ headers, item }">
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
      </template>-->
    </v-data-table>

    <br />

    <v-pagination v-model="page" :length="pageCount" :total-visible="7" @input="doSearch"></v-pagination>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "package-list",
  data: () => ({
    headers: [
      { text: "ID", value: "id" },
      { text: "Periode", value: "webinar_start_date" },
      { text: "Nama Paket", value: "webinar_name" },
      { text: "Sesi", value: "webinar_session" },
      { text: "Harga", value: "webinar_price", align: "right" },
      { text: "Peserta", value: "peserta" },
      { text: "Kuota", value: "webinar_quota" },
      { text: "Status", value: "webinar_status" },
      { text: "Publish", value: "webinar_publish" },
      { text: "Action", value: "action", sortable: false },
      // { text: "", value: "data-table-expand" },
    ],
    webinars: [],
    menu: false,
    search: {
      webinar_start_date: null,
      category_id: 0,
      level_id: 0,
      webinar_status: "",
    },
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
            webinar_class: "PAKET",
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
    async doSearch() {
      await this.axios
        .get("/setup-webinar/v1/jadwal-webinar?page=" + this.page, {
          params: {
            webinar_class: "PAKET",
            webinar_start_date: this.search.webinar_start_date,
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
      this.$router.push("/paket/add-package?id=" + item.id);
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
  },
  filters: {
    count(value) {
      if (!value) return "";
      value = JSON.parse(value);
      return value.length;
    },
  },
};
</script>

<style>
</style>
