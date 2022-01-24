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
          <v-toolbar-title>Setup Mentor</v-toolbar-title>

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
                  v-model="form1.mentor_name"
                  label="Nama Mentor"
                  outlined
                  dense
                  :rules="required"
                ></v-text-field>

                <v-text-field v-model="form1.mentor_title" label="Title Mentor" outlined dense></v-text-field>

                <v-file-input
                  v-model="form1.mentor_avatar"
                  label="Avatar"
                  outlined
                  dense
                  accept="image/*"
                  @change="onFileChange1(form1.mentor_avatar)"
                ></v-file-input>

                <v-img :src="image1" contain class="mb-4" v-if="image1 != null"></v-img>
                <v-img :src="getImage(preview1)" contain class="mb-4" v-if="preview1 != null"></v-img>

                <v-file-input
                  v-model="form1.mentor_sign"
                  label="Tanda Tangan"
                  outlined
                  dense
                  accept="image/*"
                  @change="onFileChange2(form1.mentor_sign)"
                ></v-file-input>

                <v-img :src="image2" contain class="mb-4" v-if="image2 != null"></v-img>
                <v-img :src="getImage(preview2)" contain class="mb-4" v-if="preview2 != null"></v-img>
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
  name: "mentor",
  data: () => ({
    headers: [
      { text: "ID", value: "id" },
      { text: "Nama", value: "mentor_name" },
      { text: "Title", value: "mentor_title" },
      { text: "Avatar", value: "mentor_avatar" },
      { text: "Sign", value: "mentor_sign" },
      { text: "Action", value: "action", sortable: false },
    ],
    masters: [],
    search: "",
    dialog1: false,
    editedIndex: -1,
    form1: {
      mentor_name: "",
      mentor_title: "",
      mentor_avatar: null,
      mentor_sign: null,
    },
    required: [(v) => !!v || "Field is required"],
    valid1: true,
    image1: null,
    image2: null,
    preview1: null,
    preview2: null,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Tambah Mentor" : "Edit Mentor";
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async initialize() {
      this.loading = true;

      await this.axios
        .get("/setup-webinar/v1/mentor", {
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
        this.image1 = null
        this.image2 = null
      }, 300);
    },
    edit1(item) {
      this.editedIndex = this.masters.indexOf(item);
      this.form1 = {
        id: item.id,
        mentor_name: item.mentor_name,
        mentor_title: item.mentor_title,
      };
      this.preview1 = item.mentor_avatar
      this.preview2 = item.mentor_sign
      this.dialog1 = true;
    },
    onFileChange1(file) {
      this.image1 = URL.createObjectURL(file);
      this.preview1 = null
    },
    onFileChange2(file) {
      this.image2 = URL.createObjectURL(file);
      this.preview2 = null
    },
    async saveMaster() {
      this.loading = true;

      let formData = new FormData();
      formData.set("mentor_name", this.form1.mentor_name.toUpperCase());
      formData.set("mentor_title", this.form1.mentor_title.toUpperCase());
      if (this.form1.mentor_avatar != null) {
        formData.set("mentor_avatar", this.form1.mentor_avatar);
      }
      if (this.form1.mentor_sign != null) {
        formData.set("mentor_sign", this.form1.mentor_sign);
      }
      formData.set("created_by", this.user.id);

      await this.axios
        .post("/setup-webinar/v1/mentor", formData, {
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
      formData.set("mentor_name", this.form1.mentor_name.toUpperCase());
      formData.set("mentor_title", this.form1.mentor_title.toUpperCase());
      if (this.form1.mentor_avatar != null) {
        formData.set("mentor_avatar", this.form1.mentor_avatar);
      }
      if (this.form1.mentor_sign != null) {
        formData.set("mentor_sign", this.form1.mentor_sign);
      }
      formData.set("updated_by", this.user.id);

      await this.axios
        .post("/setup-webinar/v1/update-mentor", formData, {
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