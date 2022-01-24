<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-form ref="form" v-model="valid">
      <v-row align="center">
        <v-col cols="12" sm="6">
          <v-text-field
            v-model="id"
            label="User ID"
            outlined
            dense
            class="d-none"
          ></v-text-field>

          <v-text-field
            v-model="npk"
            label="User ID"
            outlined
            dense
            :rules="formRules"
            append-outer-icon="mdi-magnify"
            @click:append-outer="dialog = true"
          ></v-text-field>

          <v-text-field
            v-model="name"
            label="User Name"
            outlined
            dense
            :rules="formRules"
            class="mt-2"
          ></v-text-field>

          <v-autocomplete
            v-model="chpass"
            label="Reset Password"
            :items="resetStatus"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>

          <v-text-field
            v-model="description"
            label="User Description"
            outlined
            dense
          ></v-text-field>

          <v-autocomplete
            v-model="status"
            label="Status"
            :items="userStatus"
            outlined
            dense
            hide-selected
            :rules="formRules"
          ></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6">
          <v-row dense v-if="!selectUser">
            <v-col cols="3">
              <v-text-field
                v-model="person_id"
                label="ID"
                outlined
                dense
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="9">
              <v-autocomplete
                v-model="person_name"
                label="Person Name"
                :items="employee"
                item-text="emp_name"
                item-value="emp_npk"
                outlined
                dense
                return-object
                hide-selected
                @change="selectNotRegister()"
                :rules="formRules"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-row dense v-if="selectUser">
            <v-col cols="3">
              <v-text-field
                v-model="person_id"
                label="ID"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="9">
              <v-text-field
                v-model="person_name"
                label="Person Name"
                outlined
                dense
                readonly
                :rules="formRules"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row dense>
            <v-col cols="3">
              <v-text-field
                v-model="outlet"
                label="ID"
                outlined
                dense
                :rules="formRules"
              ></v-text-field>
            </v-col>

            <v-col cols="9">
              <v-autocomplete
                v-model="outlet_name"
                label="Outlet Name"
                :items="listOutlet"
                item-text="outlet_name"
                item-value="outlet_id"
                outlined
                dense
                hide-selected
                :rules="formRules"
                @change="outlet = outlet_name"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <v-text-field
            v-model="lastLogin"
            label="Last Login"
            outlined
            dense
            disabled
          ></v-text-field>

          <v-text-field
            v-model="ipaddress"
            label="IP Address"
            outlined
            dense
            disabled
          ></v-text-field>

          <v-text-field
            v-model="browser"
            label="Browser"
            outlined
            dense
            disabled
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row class="my-0">
        <v-col cols="6">
          <v-btn color="red" dark block @click="reset">
            <v-icon left>mdi-reload</v-icon> Reset
          </v-btn>
        </v-col>

        <v-col cols="6">
          <v-btn
            color="primary"
            block
            @click="simpan"
            :disabled="!valid"
            v-if="!selectUser"
          >
            <v-icon left>mdi-content-save</v-icon> Simpan
          </v-btn>

          <v-btn
            color="primary"
            block
            @click="update"
            :disabled="!valid"
            v-else
          >
            <v-icon left>mdi-content-save</v-icon> Update
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-card v-if="id">
      <v-card-title>
        List Role

        <v-spacer></v-spacer>

        <v-btn
          color="primary"
          @click="dialog2 = true"
          class="mr-2"
          v-if="selectUser"
        >
          <v-icon left>mdi-plus</v-icon> Add
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="headers3"
        :items="listUserRole"
        dense
        :loading="loading"
      >
        <template v-slot:item.action="{ item }">
          <v-icon small @click="deleteRole(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title>
          List of Value

          <v-spacer></v-spacer>

          <v-text-field
            outlined
            dense
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          :headers="headers"
          :items="listUser"
          dense
          :loading="loading"
          :search="search"
        >
          <template v-slot:item.action="{ item }">
            <v-icon small @click="ambil(item)">mdi-plus-thick</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog2" width="500">
      <v-card>
        <v-card-title>
          List of Value

          <v-spacer></v-spacer>

          <v-text-field
            outlined
            dense
            v-model="search2"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>

        <v-data-table
          :headers="headers2"
          :items="listRole"
          dense
          :loading="loading"
          :search="search2"
        >
          <template v-slot:item.action="{ item }">
            <v-icon small @click="addRole(item)">mdi-plus-thick</v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "user",
  data: () => ({
    id: "",
    npk: "",
    name: "",
    chpass: "",
    resetStatus: [
      { text: "YES", value: "YES" },
      { text: "NO", value: "NO" },
    ],
    description: "",
    agent: "",
    status: "",
    userStatus: [
      { text: "ACTIVE", value: "ACTIVE" },
      { text: "INACTIVE", value: "INACTIVE" },
    ],
    person_id: "",
    person_name: "",
    outlet: "",
    outlet_name: "",
    lastLogin: "",
    ipaddress: "",
    browser: "",
    search: "",
    formRules: [(v) => !!v || "Field is required"],
    valid: true,
    dialog: false,
    listUser: [],
    headers: [
      { text: "User ID", value: "npk" },
      { text: "User Name", value: "name" },
      { text: "User Description", value: "description" },
      { text: "Action", align: "center", value: "action", sortable: false },
    ],
    loading: true,
    selected: [],
    employee: [],
    listOutlet: [],
    selectUser: false,
    headers2: [
      { text: "Role ID", value: "id" },
      { text: "Role Name", value: "role_name" },
      { text: "Action", align: "center", value: "action", sortable: false },
    ],
    dialog2: false,
    listRole: [],
    search2: "",
    headers3: [
      { text: "Role ID", value: "role_id" },
      { text: "Role Name", value: "role_name" },
      { text: "Action", align: "center", value: "action", sortable: false },
    ],
    listUserRole: [],
  }),
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    ...mapActions({
      setAlert: "alert/set",
      setAuth: "auth/set",
    }),
    reset() {
      this.$refs.form.reset();
      this.selectUser = false;
    },
    async getUser() {
      this.loading = true;

      await this.axios
        .get("/v1/setup_aplikasi/list_user", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.listUser = data;
          this.loading = false;
        })
        .catch((error) => {
          let responses = error.message;
          console.log(responses);
        });
    },
    ambil(item) {
      this.selected = item;
      this.id = this.selected.id;
      this.npk = this.selected.npk;
      this.name = this.selected.name;
      this.chpass = this.selected.chpass;
      this.description = this.selected.description;
      this.status = this.selected.status;
      this.person_id = this.selected.npk;
      this.person_name = this.selected.name;
      this.outlet = this.selected.user_outlet;
      this.outlet_name = this.selected.user_outlet;
      this.lastLogin = this.selected.last_login;
      this.ipaddress = this.selected.ipaddress;
      this.browser = this.selected.browser;
      this.dialog = false;
      this.selectUser = true;
      this.getUserRole();
    },
    async getEmployee() {
      this.loading = true;

      await this.axios
        .get("/v1/setup_aplikasi/not_register", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.employee = data;
          this.loading = false;
        })
        .catch((error) => {
          let responses = error.message;
          console.log(responses);
        });
    },
    selectNotRegister() {
      this.person_id = this.person_name.emp_npk;
      this.outlet = this.person_name.emp_outlet;
      this.outlet_name = String(this.person_name.emp_outlet);
      this.npk = this.person_name.emp_npk;
      this.name = this.person_name.emp_name;
      this.chpass = "YES";
      this.status = "ACTIVE";
    },
    async getOutlet() {
      this.loading = true;

      await this.axios
        .get("/v1/network/list_outlet", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.listOutlet = data;
          this.loading = false;
        })
        .catch((error) => {
          let responses = error.message;
          console.log(responses);
        });
    },
    async simpan() {
      this.loading = true;

      let formData = new FormData();
      formData.set("npk", this.npk);
      formData.set("name", this.name.toUpperCase());
      formData.set("chpass", this.chpass);
      formData.set("description", this.description.toUpperCase());
      formData.set("status", this.status);
      formData.set("user_outlet", this.outlet);
      formData.set("created_by", this.user.id);

      await this.axios
        .post("/v1/register", formData, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response;
          let id = response.data.id;
          this.setAlert({
            status: true,
            color: "success",
            text: data.message,
          });
          this.selectUser = true;
          this.getUser();
          this.getEmployee();
          this.getRole();
          this.getUserRole();
          this.person_name = this.name;
          this.id = id;
        })
        .catch((error) => {
          let responses = error.message;
          console.log(responses);
        });
    },
    async update() {
      this.loading = true;

      await this.axios
        .post(
          "/v1/update",
          {
            id: this.id,
            name: this.name.toUpperCase(),
            chpass: this.chpass,
            description: this.description,
            status: this.status,
            user_outlet: this.outlet,
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
          this.reset();
          this.getUser();
          this.getEmployee();
          this.getRole();
        })
        .catch((error) => {
          let responses = error.message;
          console.log(responses);
        });
    },
    async getRole() {
      this.loading = true;

      await this.axios
        .get("/v1/setup_aplikasi/role", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.listRole = data;
          this.loading = false;
        })
        .catch((error) => {
          let responses = error.message;
          console.log(responses);
        });
    },
    async getUserRole() {
      this.loading = true;

      await this.axios
        .get("/v1/setup_aplikasi/user_role", {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
          params: {
            user_id: this.id,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.listUserRole = data;
          this.loading = false;
        })
        .catch((error) => {
          let responses = error.message;
          console.log(responses);
        });
    },
    async addRole(item) {
      this.loading = true;

      let formData = new FormData();

      formData.set("user_id", this.id);
      formData.set("role_id", item.id);
      formData.set("created_by", this.user.id);

      await this.axios
        .post("/v1/setup_aplikasi/add_role", formData, {
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
          this.dialog2 = false;
          this.getUserRole();
        })
        .catch((error) => {
          let responses = error.message;
          console.log(responses);
        });
    },
    async deleteRole(item) {
      let r = confirm("Yakin akan dihapus?");

      if (r == true) {
        this.loading = true;

        await this.axios
          .delete("/v1/setup_aplikasi/delete_role", {
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
            this.loading = false;
            this.getUserRole();
          })
          .catch((error) => {
            let responses = error.response.data;
            console.log(responses.message);
          });
      }
    },
  },
  async created() {
    await this.getUser();
    await this.getEmployee();
    await this.getOutlet();
    await this.getRole();
  },
};
</script>