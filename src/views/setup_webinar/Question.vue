<template>
  <div>
    <v-app-bar app color="primary" dark v-if="$vuetify.breakpoint.xs">
      <v-btn icon @click.stop="$router.go(-1)">
        <v-icon>mdi-arrow-left-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-card>
      <v-container fluid>
        <v-form v-model="valid">
          <v-text-field v-model="title" label="Judul Soal" outlined dense :rules="[rules.required]"></v-text-field>

          <vue-editor
            v-model="question"
            :customModules="customModulesForEditor"
            :editorOptions="editorSettings"
            useCustomImageHandler
            @image-added="handleImageAdded"
          ></vue-editor>

          <br />

          <h3>Opsi Jawaban</h3>

          <v-text-field
            v-model="options.a"
            label="Jawaban A"
            outlined
            dense
            :rules="[rules.required]"
          ></v-text-field>

          <v-text-field
            v-model="options.b"
            label="Jawaban B"
            outlined
            dense
            :rules="[rules.required]"
          ></v-text-field>

          <v-text-field
            v-model="options.c"
            label="Jawaban C"
            outlined
            dense
            :rules="[rules.required]"
          ></v-text-field>

          <v-text-field
            v-model="options.d"
            label="Jawaban D"
            outlined
            dense
            :rules="[rules.required]"
          ></v-text-field>

          <h3>Jawaban Benar</h3>

          <v-autocomplete v-model="answer" label="Jawaban Benar" outlined dense :items="answers"></v-autocomplete>
        </v-form>
      </v-container>

      <v-card-actions>
        <v-btn
          block
          color="primary"
          :disabled="!valid || question == '' ? true : false"
          :loading="loading"
          @click="simpan"
          v-if="Object.keys($route.query).length === 0"
        >Simpan</v-btn>

        <v-btn
          block
          color="primary"
          :disabled="!valid || question == '' ? true : false"
          :loading="loading"
          @click="update"
          v-else
        >Update</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { VueEditor } from 'vue2-editor'
import ImageResize from 'quill-image-resize-vue';
import { ImageDrop } from 'quill-image-drop-module'

export default {
  name: "question",
  components: {
    VueEditor
  },
  data: () => ({
    valid: true,
    customModulesForEditor: [
      { alias: "imageDrop", module: ImageDrop },
      { alias: "imageResize", module: ImageResize }
    ],
    editorSettings: {
      modules: {
        imageDrop: true,
        imageResize: {}
      }
    },
    title: "",
    question: "",
    options: {
      a: "",
      b: "",
      c: "",
      d: "",
    },
    answer: "",
    answers: ["A", "B", "C", "D"],
    rules: {
      required: value => !!value || 'This field is required.',
    },
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
    async getQuestion() {
      await this.axios
        .get("/setup-webinar/v1/question?id=" + this.$route.query.id, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then((response) => {
          let { data } = response.data;
          this.title = data.data[0].title;
          this.question = data.data[0].question;
          this.options = {
            a: data.data[0].option_a,
            b: data.data[0].option_b,
            c: data.data[0].option_c,
            d: data.data[0].option_d,
          }
          this.answer = data.data[0].answer;
        })
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      let formData = new FormData();
      formData.append("image", file);

      await this.axios
        .post("/home/v1/images", formData, {
          headers: {
            Authorization: "Bearer " + this.user.api_token,
          },
        })
        .then(response => {
          let { data } = response.data;
          Editor.insertEmbed(cursorLocation, "image", this.getImage(data.image));
          resetUploader();
        })
        .catch(err => {
          console.log(err);
        });
    },
    async simpan() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true

        let formData = new FormData();
        formData.set("title", this.title.toUpperCase());
        formData.set("question", this.question);
        formData.set("option_a", this.options.a);
        formData.set("option_b", this.options.b);
        formData.set("option_c", this.options.c);
        formData.set("option_d", this.options.d);
        formData.set("answer", this.answer);
        formData.set("created_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/question", formData, {
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
            this.$router.push("/setup-webinar/question-list")
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
    async update() {
      let r = confirm("Apakah anda yakin akan menyimpan data berikut?");

      if (r) {
        this.loading = true

        let formData = new FormData();
        formData.set("id", this.$route.query.id);
        formData.set("title", this.title.toUpperCase());
        formData.set("question", this.question);
        formData.set("option_a", this.options.a.toUpperCase());
        formData.set("option_b", this.options.b.toUpperCase());
        formData.set("option_c", this.options.c.toUpperCase());
        formData.set("option_d", this.options.d.toUpperCase());
        formData.set("answer", this.answer);
        formData.set("updated_by", this.user.id);

        await this.axios
          .post("/setup-webinar/v1/update-question", formData, {
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
            this.$router.push("/setup-webinar/question-list")
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
    if (this.$route.query.id) {
      await this.getQuestion()
    }
  }
}
</script>

<style>
</style>