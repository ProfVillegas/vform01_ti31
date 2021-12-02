<template>
  <v-data-table
    :headers="headers"
    :items="userData"
    :items-per-page="5"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" md="6" sm="12">
                  <v-text-field
                    v-model="edituserData.email"
                    label="E-mail"
                    hint="Type your email."
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                </v-col>
                <v-col cols="12" md="6" sm="12">
                  <v-text-field
                    v-model="edituserData.psw"
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
                    v-model="edituserData.ranking"
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
                    v-model="edituserData.comments"
                    hint="type here your comments..."
                  >
                  </v-textarea>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-checkbox
                    v-model="edituserData.options"
                    value="sendcoupons"
                    label="Send me monthly coupons."
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="4" sm="6">
                  <v-checkbox
                    v-model="edituserData.options"
                    value="sendspecial"
                    label="I want today's special."
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="red darken-1" text @click="close">Close</v-btn>
            <v-btn class="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
          <v-card-title class="text-h5">
            Are you sure you want to delete this row?
          </v-card-title>
          <v-card-text>
            if you delete this row, you will not be able to retrieve the
            information.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="red darken-1" text @click="closeDelete">Cancel</v-btn>
            <v-btn class="blue darken-1" text @click="deleteConfirm"
              >Confirm</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon class="mr-2" @click="editItem(item)">edit</v-icon>
      <v-icon @click="deleteItem(item)">delete</v-icon>
    </template>
  </v-data-table>
</template>
<script>
import UserDataService from "../services/UserDataService";
export default {
  data() {
    return {
      userData: [],
      edituserData: {
        email: "",
        psw: "",
        ranking: 1,
        comments: "",
        options: [],
      },
      defaultuserData: {
        email: "",
        psw: "",
        ranking: 1,
        comments: "",
        options: [],
      },
      currentuserData: null,
      currentIndex: -1,
      unsubscribe: null,
      headers: [
        { text: "E-mail", value: "email" },
        { text: "Ranking", value: "ranking" },
        { text: "Comments", value: "comments", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      dialog: false,
      dialogDelete: false,
      rules: {
        min: (v) => v.length >= 8 || "Min 8 Characters.",
        required: (value) => !!value || "Required.",
      },
      label_rank: {
        label: "Ranking",
        val: 10,
        color: "red",
      },
      show: false,
    };
  },
  methods: {
    onDataChange(items) {
      let _userData = [];
      items.forEach((item) => {
        let id = item.id;
        let data = item.data();
        _userData.push({
          id: id,
          email: data.email,
          psw: data.psw,
          ranking: data.ranking,
          comments: data.comments,
          options: data.options,
        });
      });
      this.userData = _userData;
    },
    refreshList() {
      this.currentuserData = null;
      this.currentIndex = -1;
    },
    editItem(item) {
      //alert("Show Edit Modal");
      this.edituserData = Object.assign({}, item);
      this.dialog = true;
      console.log(item);
    },
    deleteItem(item) {
      //alert("Show Delete Modal");
      this.edituserData = Object.assign({}, item);
      this.dialogDelete = true;
      console.log(item);
    },
    close() {
      this.dialog = false;
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    save() {
      const data = {
        email: this.edituserData.email,
        psw: this.edituserData.psw,
        ranking: this.edituserData.ranking,
        comments: this.edituserData.comments,
        options: this.edituserData.options,
      };
      UserDataService.update(this.edituserData.id, data)
        .then(() => {
          this.$emit("refreshList");
          this.close();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteConfirm() {
      UserDataService.delete(this.edituserData.id)
        .then(() => {
          this.$emit("refreshList");
          this.closeDelete();
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  computed: {
    formTitle() {
      return "Edit item";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  mounted() {
    this.unsubscribe = UserDataService.getAll()
      .orderBy("email", "asc")
      .onSnapshot(this.onDataChange);
  },
  beforeDestroy() {
    this.unsubscribe();
  },
};
</script>
