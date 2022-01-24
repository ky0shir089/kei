<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-row>
      <v-col cols="12" sm="4">
        <v-date-picker v-model="dates" range></v-date-picker>
      </v-col>

      <v-col cols="12" sm="4">
        <v-form v-model="valid">
          <v-text-field
            v-model="dateRangeText"
            label="Date range"
            outlined
            dense
            prepend-icon="mdi-calendar"
            readonly
            :rules="[rules.required]"
          ></v-text-field>
        </v-form>

        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!valid || dates.length < 2"
          @click="download"
        >Download</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "report",
  data: () => ({
    valid: true,
    rules: {
      required: (value) => !!value || "This field is required.",
    },
    dates: [],
    loading: false,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async download() {
      let formData = new FormData();
      formData.set("from", this.dates[0] + " 00:00:00");
      formData.set("to", this.dates[1] + " 23:59:59");

      await this.axios
        .post("/report/v1/report", formData, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'file.txt');
          document.body.appendChild(link);
          link.click();
        });
    },
  },
}
</script>

<style>
</style>