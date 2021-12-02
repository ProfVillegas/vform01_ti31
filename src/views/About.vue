<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12" md="4" sm="12">
          <v-text-field
            v-model="firstname"
            :rules="nameRules"
            :counter="10"
            label="First name:"
            required
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="4" sm="12">
          <v-text-field
            v-model="email"
            :rules="mailRules"
            label="E-mail"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-textarea
            cols="12"
            md="4"
            sm="12"
            name="input-7-1"
            filled
            label="Label"
            auto-grow
            value="The Woodman set to work at once, and so sharp was his axe that the tree was soon chopped nearly through."
          ></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script>
export default {
  data: () => ({
    valid: false,
    firstname: "",
    email: "",
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => v.length <= 10 || "Name must be less than 10 charact",
    ],
    mailRules: [
      (v) => !!v || "Email is required",
      (v) => /.+@+.+/.test(v) || "E-mail must be valid",
    ],
  }),
};
</script>
