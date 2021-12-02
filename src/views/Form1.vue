<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="6" sm="12">
          <v-text-field v-model="userData.email" label="E-mail"></v-text-field>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-text-field
            v-model="userData.pws"
            :append-icon="show ? 'visibility' : 'visibility_off'"
            :rules="[rules.required, rules.min]"
            :type="show ? 'text' : 'password'"
            name="passw"
            label="use only text signs"
            hint="At least 8 characters"
            counter
            @click:append="show = !show"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-slider
            v-model="userData.satisfaction"
            min="1"
            max="10"
            :label="label_stf.label"
            :track-color="label_stf.color"
            thumb-label="always"
          ></v-slider>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-textarea
            name="comments"
            label="Comments"
            hint="type here ..."
            v-model="userData.comments"
          ></v-textarea>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-checkbox
            v-model="userData.Options"
            value="sendcoupons"
            label=" Send me monthly coupons"
          >
          </v-checkbox>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-checkbox
            v-model="userData.Options"
            value="sendSpecial"
            label="I want today's special"
          >
          </v-checkbox>
        </v-col>
        <v-col cols="12" class="mt-12" align="center">
          <v-file-input
            v-model="myFile"
            outlined
            :rules="[rules.maxsize]"
            accept="image/png, image/jpeg"
            placeholder="Click to upload file"
            @change="fileInput"
            :disabled="processing"
          >
            <template v-slot:append-outer>
              <v-progress-circular
                v-if="processing"
                color="grey"
                indeterminate
                small
              />
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="12" align="center">
          <v-img :src="fileUrl" contain v-if="fileUrl" max-height="500"></v-img>
        </v-col>
        <v-col cols="12" md="6" sm="12">
          <v-btn color="success" class="mr-4" @click.prevent="submitted"
            >Submit</v-btn
          >
        </v-col>
      </v-row>
      <v-card
        class="mx-auto my-12"
        max-width="374"
        elevation="2"
        v-if="userData.isSummitted"
      >
        <v-card-tittle>User Data Content</v-card-tittle>
        <v-card-text>
          <v-row>
            <div>
              Mail: <b>{{ userData.email }}</b>
            </div>
            <div>
              Password: <b>{{ userData.pws }}</b>
            </div>
            <div>
              Satisfaction: <b>{{ userData.satisfaction }}</b>
            </div>
            <p style="white-space: pre">
              Message: <b>{{ userData.comments }}</b>
            </p>
            <p>Options:</p>
            <ul>
              <li v-for="(item, index) in userData.Options" :key="index">
                {{ index }}. {{ item }}
              </li>
            </ul>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-form>
</template>
<script>
import UserDataService from "../services/UserDataService";
import { FirebaseStorage } from "../firebase";
export default {
  data() {
    return {
      myFile: null,
      URLimg: null,
      processing: false,
      fileURL: null,
      show: false,
      userData: {
        email: "",
        psw: "",
        satisfaction: 10,
        comments: "Describe your review...",
        Options: [],
        isSummitted: false,
      },
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 Characters.",
        images: (value) =>
          !value ||
          value.size < 2000000 ||
          "Image size should be less than 2 MB!",
      },
      label_stf: {
        label: "Satisfaction",
        val: 10,
        color: "red",
      },
    };
  },
  methods: {
    submitted() {
      //this.userData.isSummitted = true;
      //console.log(this.userData.Options);
      //alert(JSON.stringify(this.userData));
      var data = {
        email: this.userData.email,
        psw: this.userData.psw,
        satisfaction: this.userData.satisfaction,
        comments: this.userData.comments,
        Options: this.userData.Options,
      };
      UserDataService.create(data)
        .then(() => {
          alert("Created new user succesfully");
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async fileInput(file) {
      try {
        if (file && file.name) {
          this.processing = true;

          const fr = new FileReader();
          fr.readAsDataURL(file);
          fr.addEventListener("load", () => {
            // this is to load image on the UI
            // .. not related to file upload :)
            this.fileURL = fr.result;
          });
          const imgData = new FormData();
          imgData.append("image", this.myFile);
          const filePath = `mypath/${Date.now()}-${file.name}`;
          const metadata = { contentType: this.myFile.type };

          // Crear referencia
          const ref = FirebaseStorage.ref().child(filePath);
          //.put(this.myFile, metadata);

          // Subir el archivo
          const upload = ref.put(this.myFile, metadata);

          // Supervisar el proceso
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
              FirebaseStorage.ref(filePath)
                .getDownloadURL()
                .then((urls) => {
                  // Do something with the URL ...
                  console.log(urls);
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
