<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container fluid>
      <v-card flat width="500" class="mx-auto">
        <v-card style="border-style: solid;border-color: green;border-width: thick;">
          <v-card-title>Payment Information</v-card-title>

          <v-container fluid v-if="invoices.length > 0">
            <v-simple-table>
              <tr>
                <th>Invoice Number</th>
                <td>{{ $route.params.id }}</td>
              </tr>

              <tr>
                <th>Total Tagihan</th>
                <td>Rp {{ invoices[0].invhdr_amount.toLocaleString("id-ID") }}</td>
              </tr>

              <tr>
                <th>Invoice Status</th>
                <td>
                  <b>{{ invoices[0].invhdr_status == "NEW" ? "Belum Dibayar" : invoices[0].invhdr_status }}</b>
                </td>
              </tr>

              <tr v-if="invoices[0].invhdr_status == 'REJECT'">
                <th>Alasan</th>
                <td>{{ invoices[0].reason }}</td>
              </tr>
            </v-simple-table>
          </v-container>
        </v-card>

        <br />

        <v-card style="border-style: solid;border-color: green;border-width: thick;">
          <v-card-title>Transfer To</v-card-title>

          <v-list>
            <v-list-item>
              <v-list-item-avatar size="80">
                <v-img src="/img/bca.png" contain></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-subtitle>BCA</v-list-item-subtitle>
                <v-list-item-title>2912671217</v-list-item-title>
                <v-list-item-subtitle>PT. Langgeng Warna Utama</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>

        <br />

        <v-card style="border-style: solid;border-color: green;border-width: thick;">
          <v-card-title>Upload Bukti Transfer</v-card-title>

          <div v-if="invoices.length > 0">
            <div v-if="invoices[0].invhdr_status == 'NEW'">
              <v-container fluid>
                <v-file-input
                  v-model="form.bukti_transfer"
                  label="Upload Bukti Bayar"
                  outlined
                  dense
                  accept="image/*"
                  @change="onFileChange(form.bukti_transfer)"
                ></v-file-input>

                <div align="center">
                  <v-img :src="image" width="400" contain></v-img>
                </div>
              </v-container>

              <v-card-actions>
                <v-btn
                  block
                  color="primary"
                  :disabled="form.bukti_transfer == null ? true : false"
                  :loading="loading"
                  @click="upload"
                >Upload</v-btn>
              </v-card-actions>
            </div>

            <div v-if="invoices[0].invhdr_status == 'REJECT'">
              <v-container fluid>
                <v-file-input
                  v-model="form.bukti_transfer"
                  label="Upload Bukti Bayar"
                  outlined
                  dense
                  accept="image/*"
                  @change="onFileChange(form.bukti_transfer)"
                ></v-file-input>

                <div align="center">
                  <v-img :src="image" width="400" contain v-if="image != null"></v-img>
                  <v-img :src="getImage(invoices[0].bukti_transfer)" width="400" contain v-else></v-img>
                </div>
              </v-container>

              <v-card-actions>
                <v-btn
                  block
                  color="primary"
                  :disabled="form.bukti_transfer == null ? true : false"
                  :loading="loading"
                  @click="upload"
                >Upload</v-btn>
              </v-card-actions>
            </div>

            <v-container fluid v-else>
              <div align="center">
                <v-img :src="getImage(invoices[0].bukti_transfer)" width="400" contain></v-img>
              </div>
            </v-container>
          </div>
        </v-card>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "invoice",
  data: () => ({
    invoices: [],
    carts: [],
    form: {
      bukti_transfer: null
    },
    image: null,
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
    async getInvoice() {
      await this.axios
        .get("/peserta/v1/inbox", {
          params: {
            created_by: this.user.id,
            inv_id: this.$route.params.id
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.invoices = data;
        })
    },
    async getCart() {
      await this.axios
        .get("/peserta/v1/cart", {
          params: {
            invoice_number: this.$route.params.id
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.carts = data;
        })
    },
    onFileChange(file) {
      this.image = URL.createObjectURL(file);
    },
    async upload() {
      let r = confirm("Apakah anda yakin mengupload file berikut?");

      if (r) {
        this.loading = true

        let formData = new FormData();
        formData.set("tema", JSON.stringify(this.carts));
        formData.set("id", this.invoices[0].id);
        formData.set("bukti_transfer", this.form.bukti_transfer);

        await this.axios
          .post("/peserta/v1/upload", formData, {
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
            this.$router.push("/peserta/inbox/")
          })
          .catch((error) => {
            let responses = error.response.data;
            this.setAlert({
              status: true,
              color: "error",
              text: responses.message,
            });
            this.tutup_tema()
            this.loading = false;
          });
      }
    },
    async tutup_tema() {
      let formData = new FormData();
      formData.set("tema", JSON.stringify(this.carts));

      await this.axios
        .post("/peserta/v1/tutup_tema", formData, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
    },
  },
  async created() {
    await this.getInvoice()
    await this.getCart()
  }
}
</script>

<style>
.card-border {
  border-style: solid;
  border-color: coral;
  border-width: thick;
}
</style>
