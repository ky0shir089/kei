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
          <v-toolbar-title>Setup Informasi</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn color="green accent-4" dark @click="dialog1 = true">
            <v-icon left>mdi-plus</v-icon>New
          </v-btn>

          <v-text-field
            v-model="search"
            label="Search"
            outlined
            dense
            append-icon="mdi-magnify"
            single-line
            hide-details
            slot="extension"
          ></v-text-field>
        </v-toolbar>
      </template>

      <template v-slot:item.action="{ item }">
        <v-icon small @click="edit1(item)">mdi-pencil</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog1" persistent width="300">
      <v-card>
        <v-card-title>{{ formTitle }}</v-card-title>

        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-form ref="form" v-model="valid1">
                <v-text-field
                  v-model="form1.information"
                  label="Information"
                  outlined
                  dense
                  :rules="required"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary" @click="close1">
            <v-icon left>mdi-close-circle</v-icon>Cancel
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!valid1"
            :loading="loading"
            @click="saveMaster"
            v-if="editedIndex == -1"
          >
            <v-icon left>mdi-content-save</v-icon>Save
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!valid1"
            :loading="loading"
            @click="updateMaster"
            v-else
          >
            <v-icon left>mdi-content-save</v-icon>Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "webinar",
  data: () => ({
    headers: [
      { text: "ID", value: "id" },
      { text: "Informasi", value: "information" },
      { text: "Action", value: "action", sortable: false },
    ],
    masters: [],
    search: "",
    dialog1: false,
    editedIndex: -1,
    form1: {},
    required: [(v) => !!v || "Field is required"],
    valid1: true,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Tambah Informasi" : "Edit Informasi";
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async initialize() {
      this.loading = true;

      await this.axios
        .get("/setup-webinar/v1/info", {
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
    close1() {
      this.dialog1 = false;
      setTimeout(() => {
        this.form1 = {};
        this.editedIndex = -1;
      }, 300);
    },
    edit1(item) {
      this.editedIndex = this.masters.indexOf(item);
      this.form1 = Object.assign({}, item);
      this.dialog1 = true;
    },
    async saveMaster() {
      this.loading = true;

      let formData = new FormData();
      formData.set("information", this.form1.information.toUpperCase());
      formData.set("created_by", this.user.id);

      await this.axios
        .post("/setup-webinar/v1/info", formData, {
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
          this.initialize();
          this.loading = false;
          this.close1();
        })
    },
    async updateMaster() {
      this.loading = true;

      await this.axios
        .put(
          "/setup-webinar/v1/info",
          {
            id: this.form1.id,
            information: this.form1.information.toUpperCase(),
            updated_by: this.user.id,
          },
          {
            headers: {
              Authorization: "Bearer " + this.user.api_token,
            },
          }
        )
        .then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
          this.initialize();
          this.loading = false;
          this.close1();
        })
    },
  },
  async created() {
    await this.initialize();
  },
}
</script>

<style>
</style>