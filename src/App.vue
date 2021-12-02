<template>
  <v-app>
    <v-navigation-drawer app> </v-navigation-drawer>
    <v-app-bar app>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">Acerca de </router-link> |
      <router-link to="/form1">Formulario 1 </router-link>|
      <router-link to="/list1">List </router-link>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-footer app><p>UTRM - SMP 2021</p></v-footer>
  </v-app>
</template>

<style></style>
