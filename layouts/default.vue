<template>
  <div class="relative">
    <div class="">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand logo" href="/"
          ><img src="/melofinder_logo.png"
        /></a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav mr-auto" >
            <template v-if="user">
              <li class="nav-item">
                <a class="nav-link" href="#">My favorites</a>
              </li>
            </template>
          </ul>
          <div>
            <div v-if="user" class="d-flex align-items-center">
              <img class="profile_img" :src="user.profile_img" />
              <p class="mb-0 ml-2 mr-2">{{ user.name }}</p>
              <NuxtLink to="logout" class="btn btn-info">Logout</NuxtLink>
            </div>
            <div v-else>
              <button @click="() => triggerLogin()" class="btn btn-primary">Login</button>
            </div>
          </div>
        </div>
      </nav>

      <Nuxt />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.logo img {
  max-width: 200px;
}

.profile_img{
  max-width: 40px;
  border-radius: 50%;
}

.home-content {
  min-height: 80vh;
  justify-content: center;
  align-items: center;
}
</style>
<script>
export default {
  name: "Layout",
  data() {
    return {
      state: {
        searching: false,
      },
      searchQuery: null,
      user: null,
      searchResults: null,
    };
  },
  mounted() {
    // Check if there is user data
    let userData = localStorage.getItem("userData");
    if (userData) {
      this.user = JSON.parse(userData);
    }
  },
  methods: {
    triggerLogin(){
      this.$axios.get('auth/redirect')
      .then((response) => {
        location.href = response.data.redirect_to
      })

    }
  },
};
</script>