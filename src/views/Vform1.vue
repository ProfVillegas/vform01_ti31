<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="6" sm="12">
          <v-text-field
            v-model="userData.email"
            label="E-mail"
            hint="Type your email."
            :rules="[rules.required]"
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-text-field
            v-model="userData.psw"
            :append-icon="show ? 'visibility' : 'visibility_off'"
            :type="show ? 'text' : 'password'"
            label="Password"
            hint="At least 8 characters."
            counter
            @click:append="show = !show"
            :rules="[rules.required, rules.min]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-slider
            v-model="userData.ranking"
            min="0"
            max="10"
            :label="label_rank.label"
            :track-color="label_rank.color"
            thumb-label="always"
          ></v-slider>
        </v-col>
        <v-col cols="12" md="12" sm="12">
          <v-textarea
            label="Comments"
            v-model="userData.comments"
            hint="type here your comments..."
          >
          </v-textarea>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-checkbox
            v-model="userData.options"
            value="sendcoupons"
            label="Send me monthly coupons."
          ></v-checkbox>
        </v-col>
        <v-col cols="12" md="4" sm="6">
          <v-checkbox
            v-model="userData.options"
            value="sendspecial"
            label="I want today's special."
          ></v-checkbox>
        </v-col>

        <v-col cols="12" md="6" sm="12">
          <v-file-input
            v-model="myFile"
            outlined
            :rules="[rules.images]"
            accept="image/png, image/jpeg"
            placeholder="Click here to upload image"
            :disabled="processing"
          >
            <template v-slot:append-outer>
              <v-progress-circular
                v-if="processing"
                color="grey"
                indeterminate
                small
              ></v-progress-circular>
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-btn color="teal lighten-2" class="mr-4" @click.prevent="submitted"
            >Submit</v-btn
          >
        </v-col>
        <v-divider></v-divider>
        <v-col cols="12" md="6" sm="12" v-if="userData.isSubmitted">
          <v-card class="mx-auto my-12" elevation="2">
            <v-card-title> User Data Content </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6" sm="12">
                  <p><b>E-mail: </b> {{ userData.email }}</p>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <p><b>Password: </b> {{ userData.psw }}</p>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <p><b>Ranking: </b> {{ userData.ranking }}</p>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <p style="white-space: pre">
                    <b>Comments: </b> {{ userData.comments }}
                  </p>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <p>Options:</p>
                  <ul>
                    <li v-for="(item, index) in userData.options" :key="index">
                      {{ index + 1 }} -{{ item }}
                    </li>
                  </ul>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
import { FirebaseStorage } from "../firebase";
import UserDataService from "../services/UserDataService";

export default {
  data() {
    return {
      show: false,
      URLimg: null,
      processing: false,
      fileURL: null,
      myFile: null,
      userData: {
        email: "",
        psw: "",
        ranking: 5,
        comments: "",
        options: [],
        isSubmitted: false,
        image: null,
      },
      rules: {
        min: (v) => v.length >= 8 || "Min 8 Characters.",
        required: (value) => !!value || "Required.",
        images: (value) =>
          !value ||
          value.size < 2000000 ||
          "Image size should be less than 2MB.",
      },
      label_rank: {
        label: "Ranking",
        val: 10,
        color: "red",
      },
    };
  },
  methods: {
    submitted() {
      //this.userData.isSubmitted = true;
      this.fileInput(this.myFile);
      console.log(JSON.stringify(this.userData));
      var data = {
        email: this.userData.email,
        psw: this.userData.psw,
        ranking: this.userData.ranking,
        comments: this.userData.comments,
        options: this.userData.options,
        image: this.userData.image,
      };
      UserDataService.create(data)
        .then(() => {
          alert("Created new user successfully!");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    fileInput(file) {
      try {
        if (file && file.name) {
          this.processing = true;
          const fr = new FileReader();
          fr.readAsDataURL(file);
          fr.addEventListener("load", () => {
            this.fileURL = fr.result;
          });

          const imgData = new FormData();
          imgData.append("image", this.myFile);
          const filepath = `image_userdata/${Date.now()}-${file.name}`;
          const metadata = { contentType: this.myFile.type };
          this.userData.image = filepath;

          //Crear la refencia
          const ref = FirebaseStorage.ref().child(filepath);

          //Subir el archivo a esa referencia
          const upload = ref.put(this.myFile, metadata);

          //Supervisar el proceso de subida de archivo
          upload.on(
            "state_changed",
            function progress(snapshot) {
              console.warn(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
            },
            function error(error) {
              console.error(error);
            },
            function complete() {
              FirebaseStorage.ref(filepath)
                .getDownloadURL()
                .then((url) => {
                  console.log(url);
                });
            }
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.processing = false;
      }
    },
  },
};
</script>
