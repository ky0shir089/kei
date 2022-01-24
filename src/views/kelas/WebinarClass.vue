<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-form ref="form" v-model="valid">
      <v-row align="center">
        <v-col cols="12" sm="10">
          <v-card
            height="250"
            color="grey"
            class="d-flex align-center justify-center"
            @click="uploadBanner"
            v-if="Object.keys($route.query).length === 0"
          >
            <div v-if="form.webinar_banner == null">
              <h2>Banner</h2>
            </div>

            <v-img :src="banner" contain height="250" v-if="banner != null"></v-img>
          </v-card>

          <v-card
            height="250"
            color="grey"
            class="d-flex align-center justify-center"
            @click="uploadBanner"
            v-else
          >
            <v-img :src="banner" contain height="250" v-if="banner != null"></v-img>
            <v-img
              :src="getImage(form.banner)"
              contain
              height="250"
              v-if="form.banner != null && banner == null"
            ></v-img>
          </v-card>

          <v-file-input
            id="fileid"
            label="File input"
            v-model="form.webinar_banner"
            accept="image/*"
            outlined
            dense
            class="d-none"
            @change="changeBanner"
          ></v-file-input>

          <div class="text-caption red--text">* This field is required.</div>
        </v-col>

        <v-col cols="12" sm="6">
          <h2>Kategori</h2>

          <v-btn-toggle
            v-model="form.category_id"
            tile
            color="primary"
            group
            v-for="item in categories"
            :key="item.id"
          >
            <v-btn :value="item.id" color="#107C42" class="rounded-lg">{{ item.webinar_category }}</v-btn>
          </v-btn-toggle>

          <div class="text-caption red--text">* This field is required.</div>
        </v-col>

        <v-col cols="12" sm="6">
          <h2>Tipe</h2>

          <v-btn-toggle
            v-model="form.webinar_type"
            tile
            color="primary"
            group
            v-for="item in types"
            :key="item"
          >
            <v-btn :value="item" color="#107C42" class="rounded-lg">{{ item }}</v-btn>
          </v-btn-toggle>

          <div class="text-caption red--text">* This field is required.</div>
        </v-col>

        <v-col cols="12" sm="10">
          <h2>Level</h2>

          <v-btn-toggle
            v-model="form.level_id"
            tile
            color="primary"
            group
            v-for="item in levels"
            :key="item.id"
          >
            <v-btn :value="item.id" color="#107C42" class="rounded-lg">{{ item.webinar_level }}</v-btn>
          </v-btn-toggle>

          <div class="text-caption red--text">* This field is required.</div>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>Nama Kelas</h4>

          <v-text-field
            v-model="form.webinar_name"
            placeholder="Nama Kelas"
            outlined
            dense
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="10" v-if="form.webinar_type == 'PRIVATE'">
          <h4>Kode Unik</h4>

          <v-text-field
            v-model="form.webinar_code"
            placeholder="Kode Unik"
            outlined
            dense
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>Tanggal & Waktu</h4>

          <v-row>
            <v-col cols="12" sm="4">
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
                    v-model="form.webinar_start_date"
                    placeholder="Tanggal Mulai"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    outlined
                    dense
                    :rules="[rules.required]"
                  ></v-text-field>
                </template>

                <v-date-picker v-model="form.webinar_start_date" @input="menu = false"></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="6" sm="4">
              <v-menu
                ref="menu3"
                v-model="menu3"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="form.webinar_start_time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.webinar_start_time"
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
                  v-model="form.webinar_start_time"
                  full-width
                  format="24hr"
                  @click:minute="$refs.menu3.save(form.webinar_start_time)"
                ></v-time-picker>
              </v-menu>
            </v-col>

            <v-col cols="6" sm="4">
              <v-menu
                ref="menu4"
                v-model="menu4"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="form.webinar_end_time"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.webinar_end_time"
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
                  v-model="form.webinar_end_time"
                  full-width
                  format="24hr"
                  :min="form.webinar_start_time"
                  @click:minute="$refs.menu4.save(form.webinar_end_time)"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>Harga</h4>

          <v-text-field
            ref="webinar_price"
            v-model.lazy="form.webinar_price"
            placeholder="Harga"
            outlined
            dense
            prefix="Rp"
            v-money="money"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>Mentor</h4>

          <v-autocomplete
            v-model="form.mentor_id"
            placeholder="Mentor"
            outlined
            dense
            :items="mentors"
            item-text="mentor_name"
            item-value="id"
            :rules="[rules.required]"
          >
            <template v-slot:item="data">
              <template>
                <v-list-item-avatar size="80">
                  <img
                    :src="getImage(data.item.mentor_avatar)"
                    v-if="data.item.mentor_avatar != null"
                  />
                  <v-icon large v-else>mdi-account-circle</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-html="data.item.mentor_name"></v-list-item-title>

                  <v-list-item-subtitle v-html="data.item.mentor_title"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>Kuota</h4>

          <v-text-field
            v-model.lazy="form.webinar_quota"
            placeholder="Kuota"
            outlined
            dense
            maxlength="3"
            v-mask="'###'"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>Sponsor</h4>

          <v-file-input
            v-model="form.webinar_sponsor"
            placeholder="Sponsor"
            outlined
            dense
            accept="image/*"
            :rules="[rules.required]"
            @change="onFileChange(form.webinar_sponsor)"
          ></v-file-input>

          <v-img :src="image" height="250" contain v-if="image != null"></v-img>

          <v-img
            :src="getImage(form.sponsor)"
            height="250"
            contain
            v-if="form.sponsor != null && image == null"
          ></v-img>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>List Materi</h4>

          <vue-editor
            v-model="form.webinar_detail"
            :editorToolbar="customToolbar"
            :rules="[rules.required]"
          ></vue-editor>

          <div class="text-caption red--text">* This field is required.</div>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>List Benefit</h4>

          <vue-editor
            v-model="form.webinar_benefit"
            :editorToolbar="customToolbar"
            :rules="[rules.required]"
          ></vue-editor>

          <div class="text-caption red--text">* This field is required.</div>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>Link Zoom</h4>

          <v-text-field v-model="form.webinar_link" placeholder="Link Zoom" outlined dense></v-text-field>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>File Materi</h4>

          <v-file-input
            v-model="form.webinar_subject"
            placeholder="Materi"
            outlined
            dense
            multiple
            accept=".xls, .xlsx"
          ></v-file-input>

          <ul v-if="form.subjects != null">
            <li v-for="(item, index) in form.subjects" :key="index">
              <a
                :href="getImage(item)"
              >{{ item.replace("file_materi/" + $route.query.id + "/", "") }}</a>
            </li>
          </ul>
        </v-col>

        <v-col cols="12" sm="10">
          <h4>File Modul</h4>

          <v-file-input
            v-model="form.webinar_module"
            placeholder="Modul"
            outlined
            dense
            accept=".pdf"
          ></v-file-input>

          <ul v-if="form.module != null">
            <li>
              <a :href="getImage(form.module)">
                {{
                  form.module.replace("file_modul/" + $route.query.id + "/", "")
                }}
              </a>
            </li>
          </ul>
        </v-col>

        <v-col cols="12" sm="10" v-if="$route.query.id">
          <h4>Link Record</h4>

          <v-text-field v-model="form.webinar_record" placeholder="Link Record" outlined dense></v-text-field>
        </v-col>

        <v-col cols="12" sm="10">
          <div v-if="$route.query.id">
            <v-btn
              block
              color="primary"
              :loading="loading"
              @click="updateAll"
              v-if="form.webinar_publish == 'NO'"
            >Update All</v-btn>

            <v-btn
              block
              color="primary"
              :loading="loading"
              @click="updateKelas"
              v-if="form.webinar_publish == 'YES'"
            >Update</v-btn>
          </div>

          <v-btn
            block
            color="primary"
            :disabled="
              !valid ||
              form.category_id == 0 ||
              form.webinar_type == '' ||
              form.webinar_level == 0 ||
              form.webinar_price == 0 ||
              form.webinar_detail == '' ||
              form.webinar_banner == null
            "
            :loading="loading"
            @click="tambahKelas"
            v-else
          >Simpan</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { VMoney } from "v-money";
import { mask } from "vue-the-mask";
import { VueEditor } from "vue2-editor";

export default {
  name: "webinar-class",
  directives: { mask, money: VMoney },
  components: {
    VueEditor,
  },
  data: () => ({
    newPrice: 0,
    valid: true,
    form: {
      banner: null,
      webinar_banner: null,
      category_id: 0,
      webinar_type: "",
      level_id: 0,
      webinar_name: "",
      webinar_code: "",
      webinar_start_date: null,
      webinar_start_time: null,
      webinar_end_time: null,
      webinar_price: "",
      mentor_id: 0,
      webinar_quota: "",
      webinar_sponsor: null,
      webinar_detail: "",
      webinar_benefit: "",
      webinar_link: "",
      webinar_subject: null,
      webinar_module: null,
      webinar_record: null,
      webinar_publish: "NO",
    },
    banner: null,
    categories: [],
    types: ["PUBLIC", "PRIVATE"],
    levels: [],
    menu: false,
    menu2: false,
    menu3: false,
    menu4: false,
    money: {
      precision: 0,
      masked: false,
    },
    mentors: [],
    image: null,
    rules: {
      required: (value) => !!value || "This field is required.",
    },
    customToolbar: [
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
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
    uploadBanner() {
      document.getElementById('fileid').click()
    },
    changeBanner(file) {
      this.banner = URL.createObjectURL(file);
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
    async getMentor() {
      await this.axios
        .get("/setup-webinar/v1/mentor", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.mentors = data;
        });
    },
    onFileChange(file) {
      this.image = URL.createObjectURL(file);
    },
    async tambahKelas() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("webinar_banner", this.form.webinar_banner);
        formData.set("category_id", this.form.category_id);
        formData.set("webinar_type", this.form.webinar_type);
        formData.set("webinar_class", "SESI");
        formData.set("level_id", this.form.level_id);
        formData.set("webinar_name", this.form.webinar_name.toUpperCase());
        formData.set("webinar_code", this.form.webinar_code.toUpperCase());
        formData.set("webinar_start_date", this.form.webinar_start_date);
        formData.set("webinar_end_date", this.form.webinar_start_date);
        formData.set("webinar_start_time", this.form.webinar_start_time);
        formData.set("webinar_end_time", this.form.webinar_end_time);
        formData.set(
          "webinar_price",
          this.form.webinar_price.replaceAll(",", "")
        );
        formData.set("mentor_id", this.form.mentor_id);
        formData.set("webinar_quota", this.form.webinar_quota);
        formData.set("webinar_sponsor", this.form.webinar_sponsor);
        formData.set("webinar_detail", this.form.webinar_detail);
        formData.set("webinar_benefit", this.form.webinar_benefit);
        formData.set("webinar_link", this.form.webinar_link);
        if (this.form.webinar_subject != null) {
          for (
            let index = 0;
            index < this.form.webinar_subject.length;
            index++
          ) {
            formData.append(
              "webinar_subject[" + index + "]",
              this.form.webinar_subject[index]
            );
          }
        }
        if (this.form.webinar_module != null) {
          formData.set("webinar_module", this.form.webinar_module);
        }
        formData.set("created_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/tambah-kelas", formData, {
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
            this.$router.push("/kelas/webinar-list");
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
    async initialize() {
      await this.axios
        .get("/setup-webinar/v1/jadwal-webinar", {
          params: {
            id: this.$route.query.id,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          let result = data.data[0];
          this.$refs.webinar_price.$el.getElementsByTagName("input")[0].value = result.webinar_price;
          this.form = {
            webinar_banner: null,
            banner: result.webinar_banner,
            category_id: result.category_id,
            webinar_class: result.webinar_class,
            level_id: result.level_id,
            webinar_type: result.webinar_type,
            webinar_code: result.webinar_code,
            webinar_name: result.webinar_name,
            webinar_price: result.webinar_price,
            webinar_start_date: result.webinar_start_date,
            webinar_start_time: result.webinar_start_time,
            webinar_end_time: result.webinar_end_time,
            webinar_quota: result.webinar_quota,
            mentor_id: result.mentor_id,
            webinar_sponsor: null,
            sponsor: result.webinar_sponsor,
            webinar_status: result.webinar_status,
            webinar_detail: result.webinar_detail,
            webinar_benefit: result.webinar_benefit,
            webinar_link: result.webinar_link,
            webinar_subject: null,
            subjects: JSON.parse(result.webinar_subject),
            webinar_module: null,
            module: result.webinar_module,
            webinar_record: result.webinar_record,
            webinar_publish: result.webinar_publish,
          };
          this.getCategory();
          this.getLevel();
          this.getMentor();
        });
    },
    async updateAll() {
      let r = confirm("Apakah anda yakin akan mengupdate data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("id", this.$route.query.id);
        formData.set("webinar_banner", this.form.webinar_banner);
        formData.set("category_id", this.form.category_id);
        formData.set("webinar_type", this.form.webinar_type);
        formData.set("webinar_class", "SESI");
        formData.set("level_id", this.form.level_id);
        formData.set("webinar_name", this.form.webinar_name.toUpperCase());
        if (this.form.webinar_code != null) {
          formData.set("webinar_code", this.form.webinar_code.toUpperCase());
        }
        formData.set("webinar_start_date", this.form.webinar_start_date);
        formData.set("webinar_end_date", this.form.webinar_start_date);
        formData.set("webinar_start_time", this.form.webinar_start_time);
        formData.set("webinar_end_time", this.form.webinar_end_time);
        formData.set(
          "webinar_price",
          this.form.webinar_price.replaceAll(",", "")
        );
        formData.set("mentor_id", this.form.mentor_id);
        formData.set("webinar_quota", this.form.webinar_quota);
        formData.set("webinar_sponsor", this.form.webinar_sponsor);
        formData.set("webinar_detail", this.form.webinar_detail);
        formData.set("webinar_benefit", this.form.webinar_benefit);
        if (this.form.webinar_link != null) {
          formData.set("webinar_link", this.form.webinar_link);
        }
        if (this.form.webinar_record != null) {
          formData.set("webinar_record", this.form.webinar_record);
        }
        if (this.form.webinar_subject != null) {
          for (
            let index = 0;
            index < this.form.webinar_subject.length;
            index++
          ) {
            formData.append(
              "webinar_subject[" + index + "]",
              this.form.webinar_subject[index]
            );
          }
        }
        if (this.form.webinar_module != null) {
          formData.set("webinar_module", this.form.webinar_module);
        }
        formData.set("updated_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/update-all", formData, {
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
            this.$router.push("/kelas/webinar-list");
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
    async updateKelas() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("id", this.$route.query.id);
        if (this.form.webinar_link != null) {
          formData.set("webinar_link", this.form.webinar_link);
        }
        if (this.form.webinar_subject != null) {
          for (
            let index = 0;
            index < this.form.webinar_subject.length;
            index++
          ) {
            formData.append(
              "webinar_subject[" + index + "]",
              this.form.webinar_subject[index]
            );
          }
        }
        if (this.form.webinar_module != null) {
          formData.set("webinar_module", this.form.webinar_module);
        }
        if (this.form.webinar_record != null) {
          formData.set("webinar_record", this.form.webinar_record);
        }
        formData.set("updated_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/update-kelas", formData, {
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
            this.$router.push("/kelas/webinar-list");
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
    await this.getCategory();
    await this.getLevel();
    await this.getMentor();
    if (this.$route.query.id) {
      await this.initialize();
    }
    if (!this.$route.query.id) {
      this.$refs.form.validate()
    }
  },
};
</script>

<style>
</style>
