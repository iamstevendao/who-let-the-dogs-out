<template>
  <div id="app">
    <div style="height: 55vh">
      <h1 v-if="isLoading" style="padding-top: 100px;">
        Hang in there! We are finding a dog for you.
      </h1>
      <h1 v-else-if="errorMessage" style="padding-top: 100px;">
        Oops! This error occurs {{ errorMessage }}
      </h1>
      <template v-else>
        <h1>Hi, here is a {{ currentBreed.name }} for you!</h1>
        <img :src="currentBreed.image" style="height: 40vh" />
        <div style="margin-top: 20px;">
          <a v-if="!saved" href="" @click.prevent="clickSave" style="margin-right: 100px;"
            >&#x2764; I love it!</a
          >
          <a href="" @click.prevent="clickNext">Give me the next one &#8594;</a>
        </div>
      </template>
    </div>
    <div
      v-if="savedBreeds.length"
      style="margin-top: 20px; height: 30vh; border-top: 0.5px solid whitesmoke; padding-top: 10px"
    >
      <span>&#x2764; The loved ones &#x2764;</span>
      <div style="overflow-y: scroll">
        <div v-for="breed in savedBreeds" :key="breed.name" style="display: inline-block">
          <h3>{{ breed.name }}</h3>
          <img :src="breed.image" style="height: 20vh" />
          <div>
            <a href="" @click.prevent="clickUnsave(breed.name)">Un-love it :(</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex-alt';

export default {
  name: 'app',
  data: () => ({
    currentBreed: {},
    isLoading: true,
    errorMessage: '',
    saved: false,
  }),
  computed: {
    ...mapGetters({
      savedBreeds: getters => getters.savedBreeds,
    }),
  },
  async mounted() {
    await this.getAllBreeds();
    this.clickNext();
  },
  methods: {
    ...mapActions({
      getAllBreeds: actions => actions.getAllBreeds,
      getNewBreed: actions => actions.getNewBreed,
      saveBreed: actions => actions.save,
      unsaveBreed: actions => actions.unsave,
    }),
    clickUnsave(breedName) {
      this.saved = false;
      this.unsaveBreed(breedName);
    },
    clickSave() {
      this.saved = true;
      this.saveBreed(this.currentBreed);
    },
    async clickNext() {
      this.isLoading = true;
      try {
        this.currentBreed = await this.getNewBreed();
      } catch (error) {
        this.errorMessage = error;
      }
      this.saved = false;
      this.isLoading = false;
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
