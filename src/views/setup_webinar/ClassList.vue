<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row>
      <v-col cols="12" sm="4">
        <v-date-picker
          v-model="date"
          full-width
          :events="events"
          event-color="green lighten-1"
          @input="eventFilter"
        ></v-date-picker>
      </v-col>

      <v-col cols="12" sm="8">
        <div class="text-h6">Jadwal Webinar ({{ moment(date).format("dddd, MM MMMM YYYY") }})</div>

        <div v-if="notes.length > 0">
          <v-card v-for="item in notes" :key="item.id" rounded class="my-4">
            <v-list>
              <v-list-item>
                <v-list-item-avatar size="80">
                  <v-img
                    :src="getImage(item.webinar_sponsor)"
                    contain
                    v-if="item.webinar_sponsor != null"
                  ></v-img>
                  <v-icon v-else>mdi-cog</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ item.webinar_name }}</v-list-item-title>
                  <v-list-item-subtitle>Pukul: {{ item.webinar_start_time.substring(0, 5) }} WIB - {{ item.webinar_end_time.substring(0, 5) }} WIB</v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-chip x-small color="primary">{{ item.webinar_class }}</v-chip>
                    <v-chip x-small color="secondary">{{ item.webinar_category }}</v-chip>
                    <v-chip x-small color="tertiary" v-if="item.webinar_level != null">{{ item.webinar_level }}</v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon :to="'/setup-webinar/webinar-detail/' + item.id">
                    <v-icon small color="grey lighten-1">mdi-pencil</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </div>

        <v-container v-else>
          <h1 class="text-center">Tidak ada data</h1>
        </v-container>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" persistent width="400">
      <v-card>
        <v-card-title>Edit Kelas</v-card-title>

        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model="form.webinar_mentor"
                  label="Mentor"
                  outlined
                  dense
                  :rules="[rules.required]"
                ></v-text-field>

                <v-file-input
                  v-model="form.sponsor"
                  label="Sponsor"
                  outlined
                  dense
                  accept="image/*"
                  class="mt-4"
                  @change="onFileChange(form.sponsor)"
                ></v-file-input>

                <v-img :src="getImage(image1)" contain class="mb-4" v-if="form.sponsor == null"></v-img>

                <v-img :src="image2" contain class="mb-4" v-else></v-img>

                <v-text-field v-model="form.webinar_link" label="Link Zoom" outlined dense></v-text-field>

                <v-file-input
                  v-model="form.subject"
                  label="Materi"
                  outlined
                  dense
                  accept=".pdf"
                  hide-details
                ></v-file-input>

                <div v-if="form.webinar_subject != null">
                  <a :href="getImage(form.webinar_subject)">Download</a>
                </div>

                <v-file-input
                  v-model="form.module"
                  label="Modul"
                  outlined
                  dense
                  accept=".pdf"
                  hide-details
                  class="mt-4"
                ></v-file-input>

                <div v-if="form.webinar_module != null">
                  <a :href="getImage(form.webinar_module)">Download</a>
                </div>

                <v-text-field
                  v-model="form.webinar_record"
                  label="Link Record"
                  outlined
                  dense
                  class="mt-4"
                ></v-text-field>
              </v-form>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary" @click="dialog = false">
            <v-icon left>mdi-close-circle</v-icon>Cancel
          </v-btn>

          <v-btn color="primary" :disabled="!valid" :loading="loading" @click="updateKelas">
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
  name: "class-list",
  data: () => ({
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    webinars: [],
    events: [],
    notes: [],
    selectedItem: [],
    dialog: false,
    valid: false,
    form: {
      sponsor: null,
      webinar_link: "",
      webinar_subject: null,
      webinar_module: null,
      webinar_record: "",
    },
    rules: {
      required: value => !!value || 'This field is required.',
    },
    image1: "",
    image2: "",
    materi: "",
    modul: "",
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
      await this.axios
        .get("/setup-webinar/v1/jadwal-webinar", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data;
          this.events = this.webinars.map((item) => {
            return item.webinar_start_date
          })
          this.eventFilter()
        })
    },
    eventFilter() {
      this.notes = this.webinars.filter(item => item.webinar_start_date.includes(this.date))
    },
    onFileChange(file) {
      this.image2 = URL.createObjectURL(file);
    },
    editClass(item) {
      this.dialog = true
      this.form = item
      this.image1 = item.webinar_sponsor
      this.materi = item.webinar_subject
      this.modul = item.webinar_module
    },
    async downloadItem(url, label) {
      await this.axios
        .post(url, { responseType: 'blob' }, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'application/pdf' })
          const link = document.createElement('a')
          link.href = URL.createObjectURL(blob)
          link.download = label
          link.click()
          URL.revokeObjectURL(link.href)
        }).catch(console.error)
    },
    async updateKelas() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true;

        let formData = new FormData();
        formData.set("id", this.form.id);
        formData.set("webinar_mentor", this.form.webinar_mentor.toUpperCase());
        if (this.form.sponsor != null) {
          formData.set("webinar_sponsor", this.form.sponsor);
        }
        formData.set("webinar_link", this.form.webinar_link == null ? "" : this.form.webinar_link);

        if (this.form.subject != null) {
          formData.set("webinar_subject", this.form.subject);
        }
        if (this.form.module != null) {
          formData.set("webinar_module", this.form.module);
        }

        formData.set("webinar_record", this.form.webinar_record == null ? "" : this.form.webinar_record);

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
            this.dialog = false
            this.initialize()
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
    }
  },
  async created() {
    await this.initialize()
  },
}

</script>

<style>
</style>