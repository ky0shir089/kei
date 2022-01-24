<template>
  <div>halo</div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "verify",
  data: () => ({
    url: [],
    user: []
  }),
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async getUser() {
      await this.axios
        .get("/auth/v1/user", {
          params: {
            id: this.url[5]
          },
        }).then((response) => {
          let { data } = response.data;
          this.user = data;
          this.verify()
        })
    },
    async verify() {
      await this.axios
        .get("/auth/v1/email/verify/" + this.url[5] + "/" + this.url[6] + "&signature=" + this.$route.query.signature, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        }).then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
        })
    },
  },
  created() {
    this.url = this.$route.query.email_verify_url.split("/")

    this.getUser()
  }
}
</script>

<style>
</style>