<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-text-field
        v-model="search"
        label="Search"
        outlined
        dense
        append-icon="mdi-magnify"
        hide-details
        autofocus
      ></v-text-field>

      <br />

      <h2>Webinar</h2>

      <br />

      <v-row>
        <v-col cols="6" sm="4">
          <v-card rounded v-for="item in webinars" :key="item.id">
            <v-img :src="getImage(item.webinar_sponsor)" height="200" contain></v-img>

            <v-container fluid>
              <div class="text-subtitle-2">{{ item.webinar_name }}</div>

              <div class="text-caption">
                <v-icon small>mdi-calendar</v-icon>
                {{ moment(item.webinar_start_date).format("DD MMM YYYY") }},
                {{ item.webinar_start_time.substr(0, 5) }} -
                {{ item.webinar_end_time.substr(0, 5) }} WIB |
                <v-icon small>mdi-account</v-icon>
                {{ item.webinar_quota - item.peserta }}
              </div>

              <div>
                <v-chip x-small color="primary">{{ item.webinar_class }}</v-chip>
                <v-chip x-small color="secondary" class="mx-1">{{ item.webinar_category }}</v-chip>
                <v-chip
                  x-small
                  color="tertiary"
                  class="white--text"
                  v-if="item.webinar_level != null"
                >{{ item.webinar_level }}</v-chip>
              </div>

              <v-list>
                <v-list-item>
                  <v-list-item-avatar>
                    <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.webinar_mentor }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-divider class="my-2"></v-divider>

              <div class="text-right">Rp {{ item.webinar_price.toLocaleString("id-ID") }}</div>
            </v-container>

            <v-card-actions>
              <v-btn color="blue" dark block>Rincian Materi</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "pendaftaran",
  data: () => ({
    search: "",
    webinars: [],
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setCart: "cart/set",
    }),
    async getWebinar() {
      await this.axios
        .get("/setup-webinar/v1/list-tema", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.webinars = data;
        })
    },
  },
  async created() {
    await this.getWebinar()
  }
}
</script>

<style>
</style>
