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
      show-expand
    >
      <template v-slot:top>
        <v-toolbar flat dense color="grey lighten-2">
          <v-toolbar-title>Setup Role Menu</v-toolbar-title>

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
        <v-icon small @click="open(item)">mdi-plus-thick</v-icon>
        <v-icon small @click="edit1(item)">mdi-pencil</v-icon>
        <v-icon small @click="deleteMaster(item)">mdi-delete</v-icon>
      </template>

      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length">
          <v-simple-table dense>
            <thead>
              <tr>
                <th>ID</th>
                <th>Menu</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="subItem in item.rolemenus" :key="subItem.id">
                <td>{{ subItem.id }}</td>
                <td>{{ subItem.menu_name }}</td>
                <td>{{ subItem.rolemenu_status }}</td>
                <td>
                  <v-icon small @click="edit2(subItem, item)">
                    mdi-pencil
                  </v-icon>
                  <v-icon small @click="deleteDetail(subItem)">
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog1" persistent width="300">
      <v-card>
        <v-card-title>
          {{ formTitle }}
        </v-card-title>

        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-form ref="form1" v-model="valid1">
                <v-text-field
                  v-model="form1.role_name"
                  label="Role Name"
                  outlined
                  dense
                  :rules="formRules"
                ></v-text-field>
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
            @click="saveMaster"
            v-if="editedIndex == -1"
          >
            <v-icon left>mdi-content-save</v-icon>Save
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!valid1"
            @click="updateMaster"
            v-else
          >
            <v-icon left>mdi-content-save</v-icon>Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" persistent width="300">
      <v-card>
        <v-card-title>
          {{ formTitle2 }}
        </v-card-title>

        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-form ref="form2" v-model="valid2">
                <v-autocomplete
                  v-model="form2.menu_name"
                  label="Menu"
                  :items="menus"
                  item-text="menu_name"
                  item-value="id"
                  outlined
                  dense
                  small-chips
                  multiple
                  hide-selected
                  clearable
                  :rules="formRules"
                  v-if="editedIndex == -1"
                ></v-autocomplete>

                <v-autocomplete
                  v-model="form2.rolemenu_status"
                  label="Status"
                  :items="status"
                  outlined
                  dense
                  hide-selected
                  :rules="formRules"
                ></v-autocomplete>
              </v-form>
            </v-col>
          </v-row>
        </v-container>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="secondary" @click="close2">
            <v-icon left>mdi-close-circle</v-icon>Cancel
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!valid2"
            @click="saveDetail"
            v-if="editedIndex == -1"
          >
            <v-icon left>mdi-content-save</v-icon>Save
          </v-btn>

          <v-btn
            color="primary"
            :disabled="!valid2"
            @click="updateDetail"
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
  name: "role",
  data: () => ({
    headers: [
      { text: "ID", value: "id" },
      { text: "Role Name", value: "role_name" },
      { text: "Action", value: "action", sortable: false },
      { text: "", value: "data-table-expand" },
    ],
    masters: [],
    search: "",
    dialog1: false,
    editedIndex: -1,
    form1: {},
    rolemenus: [],
    dialog2: false,
    form2: {},
    menus: [],
    status: ["ACTIVE", "INACTIVE"],
    action: "",
    formRules: [(v) => !!v || "Field is required"],
    valid1: true,
    valid2: true,
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
    formTitle() {
      return this.editedIndex === -1 ? "Tambah Role" : "Edit Role";
    },
    formTitle2() {
      return this.editedIndex === -1 ? "Tambah Menu" : "Edit Menu";
    },
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
    }),
    async initialize() {
      await this.axios
        .get("/setup-aplikasi/v1/role", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.masters = data;
        })
        .catch((error) => {
          let responses = error.response.data;
          console.log(responses.message);
        });
    },
    close1() {
      this.dialog1 = false;
      setTimeout(() => {
        this.form1 = {};
        this.editedIndex = -1;
      }, 300);
    },
    edit1(item) {
      this.editedIndex = this.masters.indexOf(item);
      this.form1 = Object.assign({}, item);
      this.dialog1 = true;
    },
    async saveMaster() {
      let formData = new FormData();
      formData.set("role_name", this.form1.role_name.toUpperCase());
      formData.set("created_by", this.user.id);

      await this.axios
        .post("/setup-aplikasi/v1/role", formData, {
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
          this.close1();
        })
        .catch((error) => {
          let responses = error.response.data;
          console.log(responses.message);
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
        });
    },
    async updateMaster() {
      await this.axios
        .put(
          "/setup-aplikasi/v1/role",
          {
            id: this.form1.id,
            role_name: this.form1.role_name.toUpperCase(),
            updated_by: this.user.id,
          },
          {
            headers: {
              Authorization: "Bearer " + this.user.api_token,
            },
          }
        )
        .then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
          this.initialize();
          this.close1();
        })
        .catch((error) => {
          let responses = error.response.data;
          console.log(responses.message);
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
        });
    },
    async deleteMaster(item) {
      let r = confirm("Yakin akan dihapus?");

      if (r) {
        await this.axios
          .delete("/setup-aplikasi/v1/role", {
            headers: {
              Authorization: "Bearer " + this.user.api_token,
            },
            data: {
              id: item.id,
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
          })
          .catch((error) => {
            let responses = error.response.data;
            console.log(responses.message);
            this.setAlert({
              status: true,
              color: "error",
              text: responses.message,
            });
          });
      }
    },
    open(item) {
      this.form1 = Object.assign({}, item);
      this.getMenu();
      this.dialog2 = true;
    },
    close2() {
      this.dialog2 = false;
      setTimeout(() => {
        this.form1 = {};
        this.form2 = {};
        this.editedIndex = -1;
      }, 300);
    },
    edit2(subItem, item) {
      this.editedIndex = this.masters.indexOf(item);
      this.form1 = Object.assign({}, item);
      this.form2 = Object.assign({}, subItem);
      this.dialog2 = true;
    },
    async getMenu() {
      await this.axios
        .get("/setup-aplikasi/v1/rolemenu", {
          params: {
            role_id: this.form1.id,
          },
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.menus = data;
        })
        .catch((error) => {
          let responses = error.message;
          console.log(responses);
        });
    },
    async saveDetail() {
      let i = 0;
      let menu_id = [];
      for (i = 0; i < this.form2.menu_name.length; i++) {
        menu_id.push(this.form2.menu_name[i]);
      }

      await this.axios
        .post(
          "/setup-aplikasi/v1/rolemenu",
          {
            role_id: this.form1.id,
            menu_id: menu_id,
            rolemenu_status: this.form2.rolemenu_status,
            created_by: this.user.id,
          },
          {
            headers: {
              Authorization: "Bearer " + this.user.api_token,
            },
          }
        )
        .then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
          this.initialize();
          this.close2();
        })
        .catch((error) => {
          let responses = error.response.data;
          console.log(responses.message);
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
        });
    },
    async updateDetail() {
      await this.axios
        .put(
          "/setup-aplikasi/v1/rolemenu",
          {
            id: this.form2.id,
            rolemenu_status: this.form2.rolemenu_status,
            updated_by: this.user.id,
          },
          {
            headers: {
              Authorization: "Bearer " + this.user.api_token,
            },
          }
        )
        .then((response) => {
          let { data } = response;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
          this.initialize();
          this.close2();
        })
        .catch((error) => {
          let responses = error.response.data;
          console.log(responses.message);
          this.setAlert({
            status: true,
            color: "error",
            text: responses.message,
          });
        });
    },
    async deleteDetail(item) {
      let r = confirm("Yakin akan dihapus?");

      if (r) {
        await this.axios
          .delete("/setup-aplikasi/v1/rolemenu", {
            headers: {
              Authorization: "Bearer " + this.user.api_token,
            },
            data: {
              id: item.id,
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
            this.close2();
          })
          .catch((error) => {
            let responses = error.response.data;
            console.log(responses.message);
            this.setAlert({
              status: true,
              color: "error",
              text: responses.message,
            });
          });
      }
    },
  },
  async created() {
    await this.initialize();
  },
};
</script>