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
          <v-toolbar-title>Setup Banner</v-toolbar-title>

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

      <template v-slot:item.banner_dtl="{ item }">
        <div v-html="item.banner_dtl"></div>
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
                  v-model="form1.banner_name"
                  label="Nama Banner"
                  outlined
                  dense
                  :rules="required"
                ></v-text-field>

                <v-file-input
                  v-model="form1.banner_img"
                  placeholder="Gambar"
                  outlined
                  dense
                  accept="image/*"
                  @change="onFileChange(form1.banner_img)"
                ></v-file-input>

                <v-img :src="image" height="250" contain v-if="image != null"></v-img>

                <v-img :src="getImage(form1.banner)" contain v-else></v-img>

                <v-text-field
                  v-model="form1.banner_seq"
                  label="Urutan"
                  outlined
                  dense
                  maxlength="1"
                  v-mask="'#'"
                  :rules="required"
                  class="mt-4"
                ></v-text-field>

                <vue-editor
                  v-model="form1.banner_dtl"
                  :editorToolbar="customToolbar"
                  :rules="required"
                  class="mb-4"
                ></vue-editor>

                <v-autocomplete
                  v-model="form1.banner_status"
                  label="Status"
                  :items="status"
                  outlined
                  dense
                  :rules="required"
                ></v-autocomplete>
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
import { mask } from "vue-the-mask";
import { VueEditor } from "vue2-editor";

export default {
  name: "banner",
  directives: { mask },
  components: { VueEditor, },
  data: () => ({
    headers: [
      { text: "ID", value: "id" },
      { text: "Nama Banner", value: "banner_name" },
      { text: "Urutan", value: "banner_seq" },
      { text: "Detail", value: "banner_dtl" },
      { text: "Status", value: "banner_status" },
      { text: "Action", value: "action", sortable: false },
    ],
    masters: [],
    search: "",
    dialog1: false,
    editedIndex: -1,
    form1: {
      banner_name: "",
      banner_img: null,
      banner_seq: "",
      banner_status: ""
    },
    image: null,
    customToolbar: [
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
    status: ["ACTIVE", "INACTIVE"],
    required: [(v) => !!v || "Field is required"],
    valid1: true,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Tambah Banner" : "Edit Banner";
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async initialize() {
      this.loading = true;

      await this.axios
        .get("/setup-webinar/v1/banner", {
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
        this.image = null;
        this.editedIndex = -1;
      }, 300);
    },
    edit1(item) {
      let form = {
        id: item.id,
        banner_name: item.banner_name,
        banner_img: null,
        banner: item.banner_img,
        banner_seq: item.banner_seq,
        banner_dtl: item.banner_dtl,
        banner_status: item.banner_status
      }

      this.editedIndex = this.masters.indexOf(item);
      this.form1 = Object.assign({}, form);
      this.dialog1 = true;
    },
    onFileChange(file) {
      this.image = URL.createObjectURL(file);
    },
    async saveMaster() {
      this.loading = true;

      let formData = new FormData();
      formData.set("banner_name", this.form1.banner_name.toUpperCase());
      formData.set("banner_img", this.form1.banner_img);
      formData.set("banner_seq", this.form1.banner_seq);
      formData.set("banner_dtl", this.form1.banner_dtl);
      formData.set("banner_status", this.form1.banner_status);
      formData.set("created_by", this.user.id);

      await this.axios
        .post("/setup-webinar/v1/banner", formData, {
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

      let formData = new FormData();
      formData.set("id", this.form1.id);
      formData.set("banner_name", this.form1.banner_name.toUpperCase());
      if (this.form1.banner_img != null) {
        formData.set("banner_img", this.form1.banner_img);
      }
      formData.set("banner_seq", this.form1.banner_seq);
      formData.set("banner_dtl", this.form1.banner_dtl);
      formData.set("banner_status", this.form1.banner_status);
      formData.set("updated_by", this.user.id);

      await this.axios
        .post(
          "/setup-webinar/v1/update-banner", formData, {
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
  },
  async created() {
    await this.initialize();
  },
}
</script>

<style>
</style>