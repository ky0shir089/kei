<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-data-table
      :headers="headers"
      :items="masters"
      :items-per-page="20"
      :search="search"
      :footer-props="{
        itemsPerPageOptions: [20, -1],
      }"
      class="elevation-1"
      dense
      :loading="loading"
    >
      <template v-slot:top>
        <v-toolbar flat dense color="grey lighten-2">
          <v-toolbar-title>Inbox</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-text-field
            v-model="search"
            label="Search"
            outlined
            dense
            append-icon="mdi-magnify"
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item.temas="{ item }">
        <ul>
          <li
            v-for="sub in item.temas"
            :key="sub.webinar_name"
          >{{ sub.webinar_name }} [{{ moment(sub.webinar_start_date).format("DD MMM YYYY") }}, {{ sub.webinar_start_time.substr(0, 5) }} - {{ sub.webinar_end_time.substr(0, 5) }} WIB]</li>
        </ul>
      </template>

      <template
        v-slot:item.invhdr_amount="{ item }"
      >Rp {{ item.invhdr_amount.toLocaleString("id-ID") }}</template>

      <template
        v-slot:item.invhdr_status="{ item }"
      >{{ item.invhdr_status == "NEW" ? "Belum Dibayar" : item.invhdr_status }}</template>

      <template v-slot:item.action="{ item }">
        <v-btn icon @click="viewInvoice(item)">
          <v-icon small>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "inbox",
  data: () => ({
    headers: [
      { text: "ID", value: "id" },
      { text: "Nomor Invoice", value: "inv_id" },
      { text: "Tema", value: "temas" },
      { text: "Total Tagihan", value: "invhdr_amount" },
      { text: "Status", value: "invhdr_status" },
      { text: "Action", value: "action", sortable: false },
    ],
    masters: [],
    search: "",
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
    async initialize() {
      this.loading = true;

      await this.axios
        .get("/peserta/v1/inbox", {
          params: {
            created_by: this.user.id
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data;
          this.loading = false;
        })
    },
    viewInvoice(item) {
      this.$router.push('/peserta/invoice/' + item.inv_id)
    }
  },
  async created() {
    await this.initialize()
  }
}
</script>

<style>
</style>