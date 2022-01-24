<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-card>
      <v-card-title>Pembuatan Sesi Webinar</v-card-title>

      <v-form v-model="valid">
        <v-row>
          <v-col cols="12" sm="6">
            <v-container>
              <v-autocomplete
                v-model="form.category_id"
                label="Category"
                outlined
                dense
                :items="categories"
                item-text="webinar_category"
                item-value="id"
                :rules="[rules.required]"
              ></v-autocomplete>

              <v-autocomplete
                v-model="form.level_id"
                label="Level"
                outlined
                dense
                :items="levels"
                item-text="webinar_level"
                item-value="id"
              ></v-autocomplete>

              <v-text-field
                v-model="form.session_name"
                label="Nama Sesi"
                outlined
                dense
                :rules="[rules.required]"
              ></v-text-field>

              <v-text-field
                v-model.lazy="form.session_price"
                label="Harga"
                outlined
                dense
                prefix="Rp"
                v-money="money"
                :rules="[rules.required]"
              ></v-text-field>

              <v-text-field
                v-model="form.session_mentor"
                label="Mentor"
                outlined
                dense
                :rules="[rules.required]"
              ></v-text-field>

              <v-text-field
                v-model.lazy="form.session_quota"
                label="Kuota"
                outlined
                dense
                maxlength="3"
                v-money="money"
                :rules="[rules.required]"
              ></v-text-field>

              <v-file-input
                v-model="form.session_sponsor"
                label="Sponsor"
                outlined
                dense
                accept="image/*"
                :rules="[rules.required]"
                @change="onFileChange(form.session_sponsor)"
              ></v-file-input>

              <v-img :src="image" contain class="mb-3" v-if="image != null"></v-img>

              <div>List Materi:</div>
              <vue-editor v-model="form.session_detail" :editorToolbar="customToolbar"></vue-editor>
            </v-container>
          </v-col>

          <v-col cols="12" sm="6">
            <v-container>
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
                    v-model="form.session_start_date"
                    label="Tanggal Mulai"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>

                <v-date-picker v-model="form.session_start_date" @input="menu = false"></v-date-picker>
              </v-menu>

              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.session_end_date"
                    label="Tanggal Selesai"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                  ></v-text-field>
                </template>

                <v-date-picker v-model="form.session_end_date" @input="menu2 = false"></v-date-picker>
              </v-menu>

              <v-menu
                ref="menu3"
                v-model="menu3"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="form.session_start_time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.session_start_time"
                    label="Jam Mulai"
                    prepend-inner-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                    suffix="WIB"
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>

                <v-time-picker
                  v-if="menu3"
                  v-model="form.session_start_time"
                  full-width
                  format="24hr"
                  @click:minute="$refs.menu3.save(form.session_start_time)"
                ></v-time-picker>
              </v-menu>

              <v-menu
                ref="menu4"
                v-model="menu4"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="form.session_end_time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.session_end_time"
                    label="Jam Selesai"
                    prepend-inner-icon="mdi-clock-time-four-outline"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                    suffix="WIB"
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>

                <v-time-picker
                  v-if="menu4"
                  v-model="form.session_end_time"
                  full-width
                  format="24hr"
                  :min="form.session_start_time"
                  @click:minute="$refs.menu4.save(form.session_end_time)"
                ></v-time-picker>
              </v-menu>

              <v-autocomplete
                v-model="form.session_status"
                label="Status"
                outlined
                dense
                :items="status"
                :rules="[rules.required]"
              ></v-autocomplete>

              <v-text-field v-model="form.session_zoom_link" label="Link Zoom" outlined dense></v-text-field>

              <v-file-input
                v-model="form.session_subject"
                label="Materi"
                outlined
                dense
                multiple
                accept=".xls, .xlsx"
              >
                <template v-slot:selection="{ text }">
                  <v-chip small label color="primary">{{ text }}</v-chip>
                </template>
              </v-file-input>

              <v-file-input
                v-model="form.session_module"
                label="Modul"
                outlined
                dense
                accept=".pdf"
              ></v-file-input>
            </v-container>
          </v-col>

          <v-col cols="12">
            <v-container fluid>
              <v-btn
                block
                color="primary"
                :disabled="!valid && form.session_detail == '' ? true : false"
                :loading="loading"
                @click="addSession"
              >Simpan</v-btn>
            </v-container>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { VMoney } from 'v-money'
import { VueEditor } from "vue2-editor";

export default {
  name: "add-session",
  directives: { money: VMoney },
  components: {
    VueEditor
  },
  data: () => ({
    valid: true,
    form: {
      category_id: 0,
      level_id: null,
      session_name: "",
      session_price: 0,
      session_mentor: "",
      session_quota: 0,
      session_sponsor: null,
      session_detail: "",
      session_start_date: null,
      session_end_date: "",
      session_start_time: null,
      session_end_time: null,
      session_status: "",
      session_zoom_link: "",
      session_subject: null,
      session_module: null,
    },
    categories: [],
    levels: [],
    rules: {
      required: value => !!value || 'This field is required.',
    },
    money: {
      precision: 0,
    },
    menu: false,
    menu2: false,
    menu3: false,
    menu4: false,
    customToolbar: [
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
    image: null,
    status: ["BUKA", "TUTUP"],
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
        })
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
        })
    },
    onFileChange(file) {
      this.image = URL.createObjectURL(file);
    },
    async addSession() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("category_id", this.form.category_id);
        formData.set("level_id", this.form.level_id);
        formData.set("session_name", this.form.session_name.toUpperCase());
        formData.set("session_price", this.form.session_price.replaceAll(",", ""));
        formData.set("session_mentor", this.form.session_mentor.toUpperCase());
        formData.set("session_quota", this.form.session_quota);
        formData.set("session_sponsor", this.form.session_sponsor);
        formData.set("session_detail", this.form.session_detail);
        formData.set("session_start_date", this.form.session_start_date);
        formData.set("session_end_date", this.form.session_end_date);
        formData.set("session_start_time", this.form.session_start_time);
        formData.set("session_end_time", this.form.session_end_time);
        formData.set("session_status", this.form.session_status);
        formData.set("session_zoom_link", this.form.session_zoom_link);
        if (this.form.session_subject != null) {
          for (let index = 0; index < this.form.session_subject.length; index++) {
            formData.append("session_subject[" + index + "]", this.form.session_subject[index]);
          }
        }
        if (this.form.session_module != null) {
          formData.set("session_module", this.form.session_module);
        }
        formData.set("created_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/add-session", formData, {
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
            this.$router.push("/setup-webinar/session-list")
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

        this.loading = false;
      }
    },
  },
  async created() {
    await this.getCategory()
    await this.getLevel()
  }
}
</script>

<style>
</style>

