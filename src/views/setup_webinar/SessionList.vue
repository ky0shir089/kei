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
          event-color="secondary"
          @input="eventFilter"
        ></v-date-picker>
      </v-col>

      <v-col cols="12" sm="8">
        <div class="text-h6">List Sesi Webinar ({{ date }})</div>

        <div v-if="notes.length > 0">
          <v-card v-for="item in notes" :key="item.id" rounded class="my-4">
            <v-list>
              <v-list-item>
                <v-list-item-avatar size="80">
                  <v-img
                    :src="getImage(item.session_sponsor)"
                    contain
                    v-if="item.session_sponser != ''"
                  ></v-img>
                  <v-icon v-else>mdi-aeroplane</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title>{{ item.session_name }}</v-list-item-title>
                  <v-list-item-subtitle>Pukul: {{ item.session_start_time.substring(0, 5) }} WIB - {{ item.session_end_time.substring(0, 5) }} WIB</v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-chip small color="primary">{{ item.webinar_category }}</v-chip>
                    <v-chip small color="secondary">{{ item.webinar_level }}</v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon :to="'/setup-webinar/session-detail/' + item.id">
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "session-list",
  data: () => ({
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    sessions: [],
    events: [],
    notes: [],
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
        .get("/setup-webinar/v1/session-list", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.sessions = data;
          this.events = this.sessions.map((item) => {
            return item.session_start_date
          })
          this.eventFilter()
        })
    },
    eventFilter() {
      this.notes = this.sessions.filter(item => item.session_start_date.includes(this.date))
    },
  },
  async created() {
    await this.initialize()
  },
}
</script>

<style>
</style>
