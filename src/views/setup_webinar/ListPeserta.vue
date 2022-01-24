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
          <v-toolbar-title>List Peserta</v-toolbar-title>

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
          <li v-for="sub in item.temas" :key="sub.webinar_name">{{ sub.webinar_name }}</li>
        </ul>
      </template>

      <template
        v-slot:item.invhdr_amount="{ item }"
      >Rp {{ item.invhdr_amount.toLocaleString("id-ID") }}</template>

      <template v-slot:item.action="{ item }">
        <v-btn icon @click="view(item)">
          <v-icon small>mdi-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" width="400">
      <v-card>
        <v-card-title>Bukti Transfer</v-card-title>

        <v-container>
          <v-img :src="getImage(image)"></v-img>
        </v-container>

        <div v-if="select.invhdr_status == 'ON PROCESS'">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="reject = true" v-if="!reject">Reject</v-btn>
            <v-btn color="primary" :loading="loading" @click="invoice('APPROVE')">Approve</v-btn>
          </v-card-actions>

          <v-container fluid v-if="reject">
            <v-text-field v-model="reason" label="alasan" outlined dense></v-text-field>
            <v-btn color="error" :loading="loading" @click="invoice('REJECT')">Reject</v-btn>
          </v-container>
        </div>

        <v-container fluid v-if="select.invhdr_status == 'REJECT'">
          <h3>Alasan Reject</h3>
          <div>{{ select.reason }}</div>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "list-peserta",
  data: () => ({
    headers: [
      { text: "Nama", value: "name" },
      { text: "Nomor Invoice", value: "inv_id" },
      { text: "Tema", value: "temas" },
      { text: "Total Tagihan", value: "invhdr_amount" },
      { text: "Status", value: "invhdr_status" },
      { text: "Bukti Transfer", value: "action", sortable: false },
    ],
    masters: [],
    search: "",
    loading: false,
    dialog: false,
    image: null,
    select: [],
    reason: "",
    reject: false,
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
    view(item) {
      if (item.invhdr_status == "NEW") {
        alert("Tidak ada bukti transfer")
      } else {
        this.image = item.bukti_transfer
        this.select = item
        this.dialog = true
      }
    },
    async invoice(status) {
      let r = confirm("Apakah anda yakin?");

      if (r) {
        this.loading = true

        let formData = new FormData();
        formData.set("id", this.select.id);
        formData.set("invhdr_status", status);
        if (status == "REJECT") {
          formData.set("reason", this.reason.toUpperCase());
        }
        formData.set("updated_by", this.user.id);

        await this.axios
          .post("/peserta/v1/invoice", formData, {
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
            this.loading = false;
            this.dialog = false
          })
          .catch((error) => {
            let responses = error.response.data;
            this.setAlert({
              status: true,
              color: "error",
              text: responses.message,
            });
            this.loading = false;
            this.dialog = false
          });
      }
    },
  },
  async created() {
    await this.initialize()
  }
}
</script>

<style>
</style>