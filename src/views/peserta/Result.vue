<template>
  <div>
    <!-- <app-bar v-if="$vuetify.breakpoint.smAndUp" /> -->

    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-row>
        <v-col cols="12" sm="8" order-sm="1" order="2">
          <youtube :video-id="videoId" player-width="100%" player-height="400" v-if="play"></youtube>

          <div class="text-h5">{{ webinar.webinar_name }}</div>

          <div>{{ webinar.mentor_name }}</div>
        </v-col>

        <v-col cols="12" sm="4" order-sm="2" order="1">
          <div class="text-h5">Course Content</div>

          <v-list>
            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Video Record</v-list-item-title>
                </v-list-item-content>
              </template>

              <a
                class="mx-8 my-2"
                @click="getUrl(webinar.webinar_record)"
                v-if="webinar.webinar_record != null"
              >LIHAT</a>

              <div class="mx-8 my-2" v-else>BELUM TERSEDIA</div>
            </v-list-group>

            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>File Materi</v-list-item-title>
                </v-list-item-content>
              </template>

              <ul v-if="subjects != null" class="mx-8 my-2">
                <li v-for="(item, index) in subjects" :key="index">
                  <a :href="getImage(item)">{{ item.replace("file_materi/" + result_id + "/", "") }}</a>
                </li>
              </ul>

              <div class="mx-8 my-2" v-else>BELUM TERSEDIA</div>
            </v-list-group>

            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>File Modul</v-list-item-title>
                </v-list-item-content>
              </template>

              <a
                :href="getImage(webinar.webinar_module)"
                v-if="webinar.webinar_module != null"
                class="mx-8 my-2"
              >{{ webinar.webinar_module.replace("file_modul/" + result_id + "/", "") }}</a>

              <div class="mx-8 my-2" v-else>BELUM TERSEDIA</div>
            </v-list-group>

            <v-list-group no-action>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>E Sertifikat</v-list-item-title>
                </v-list-item-content>
              </template>

              <div v-if="score === ''">
                <div class="mx-8 my-2">BELUM TERSEDIA</div>
              </div>

              <div v-else>
                <div class="mx-8 my-2">Score Anda: {{ score }}</div>

                <div class="mx-8 my-2" v-if="score >= 70">
                  <a @click="cetakPDF">DOWNLOAD</a>
                  <v-icon v-if="loading">mdi-loading mdi-spin</v-icon>
                </div>

                <div class="mx-8 my-2 red--text" v-else>ANDA BELUM LULUS</div>
              </div>
            </v-list-group>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'

Vue.use(VueYouTubeEmbed)

export default {
  name: "result",
  // components: {
  //   AppBar: () =>
  //     import(/* webpackChunkName: "app-bar" */ "@/components/AppBar.vue"),
  // },
  data: () => ({
    id: "",
    webinar: [],
    subjects: [],
    score: "",
    play: false,
    videoId: "",
    startTime: "",
    loading: false,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
      result_id: "result/result_id",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    getUrl(url) {
      this.videoId = this.$youtube.getIdFromURL(url)
      this.startTime = this.$youtube.getTimeFromURL(url)
      this.play = true
    },
    async getWebinar() {
      await this.axios
        .get("/setup-webinar/v1/jadwal-webinar", {
          params: {
            id: this.result_id
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinar = data.data[0];
          this.subjects = JSON.parse(this.webinar.webinar_subject)
        })
    },
    async getScore() {
      await this.axios
        .get("/peserta/v1/score", {
          params: {
            user_id: this.user.id,
            session_id: this.result_id
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          if (data) {
            this.score = data.post_test_score;
          }
        })
    },
    async cetakPDF() {
      let data = {
        webinar_sponsor: this.webinar.webinar_sponsor,
        webinar_name: this.webinar.webinar_name,
        webinar_detail: this.webinar.webinar_detail,
        post_test_score: this.score,
        mentor_sign: this.webinar.mentor_sign,
        mentor_name: this.webinar.mentor_name,
        webinar_start_date: this.webinar.webinar_start_date,
      }

      this.loading = true

      let formData = new FormData();
      formData.set("data", JSON.stringify(data));
      formData.set("name", this.user.name);

      await this.axios
        .post("/peserta/v1/cetak_pdf", formData, {
          responseType: 'arraybuffer',
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let blob = new Blob([response.data], { type: 'application/pdf' })
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Sertifikat.pdf'
          link.click()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
  async created() {
    await this.getWebinar()
    await this.getScore()
  }
}
</script>

<style>
</style>