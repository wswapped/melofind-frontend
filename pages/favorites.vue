<template>
  <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <div class="mt-4 home-content d-flex bg-white overflow-hidden sm:rounded-lg container">
        <div>
          <h1 class="mt-3 mb-4">Your favorite artists and albums</h1>
          <div v-if="searchResults">
            <div v-if="searchResults.albums">
              <h2 class="my-3">Albums</h2>
              <div class="row">
                <div class="p-2 col-md-4" v-for="(album, albumKey) in searchResults.albums" :key="albumKey">

                  <div class="shadow p-2 album-card rounded-lg">
                    <NuxtLink :to="`album?mbid=${album.mbid}&name=${album.name}&artist=${album.artist}`">
                      <h3>{{album.name}}</h3>
                      <h4 class="text-muted">By {{album.artist}}</h4>
                      <img class="img-fluid w-100" :src="album.image[album.image.length-1]['#text']" />
                    </NuxtLink>
                   </div>
                </div>
              </div>
            </div>
            <div class="mt-4" v-if="searchResults.artists">
              <h2 class="my-2">Artists</h2>
              <div class="row">
                <div class="p-2 col-md-4" v-for="(artist, artistKey) in searchResults.artists" :key="artistKey">
                  <div class="shadow p-2 rounded-lg">
                    <NuxtLink class="text-reset" :to="`artist?mbid=${artist.mbid}&name=${artist.name}`">
                      <h3>{{artist.name}}</h3>
                    </NuxtLink>
                    <h4 class="text-muted">{{artist.stats.listeners.toLocaleString()}} Listeners</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .home-content{
    min-height: 80vh;
    justify-content: center;
    align-items: center;
    
  }
  .album-card a{
    text-decoration: none;
    color: inherit;
  }
</style>
<script>
export default {
  name: 'FavoritesPage',
  head: {
    title: `Favorites | ${process.env.APP_NAME}`,
  },
  data(){
    return {
      state:{
        searching: false,
      },
      searchQuery: null,
      searchResults: null,
    }
  },
  mounted(){
    // Get favorited contents
    this.getFavorites()
  },
  methods:{
    getFavorites(){
      this.state.searching = true
      this.$axios.get(`favorites`)
        .then((response) => {
          console.log(response)
          this.state.searching = false
          this.searchResults = response.data
        })
    },
  }
}
</script>
