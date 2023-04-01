<template>
  <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <a class="logo" href="/">
        <img src="/melofinder_logo.png" />
      </a>
      <div class="mt-4 home-content d-flex bg-white overflow-hidden sm:rounded-lg container">
        <div>
          <p class="mt-3 text-gray-600">
          Search your favorite artist or album
          </p>
          <form class="form" @submit="search">
            <input class="form-control" type="text" placeholder="Artist or album" required v-model="searchQuery" />
            <div class="mt-3 d-flex justify-content-center">
              <button class="btn btn-primary">
                <template v-if="!state.searching">Search</template>
                <template v-else>Searching ...</template>
              </button>
            </div>
          </form>
          <div v-if="searchResults">
            <div v-if="searchResults.albums.results.albummatches.album">
              <h2>Albums</h2>
              <div class="row">
                <div class="p-2 col-md-4" v-for="(album, albumKey) in searchResults.albums.results.albummatches.album" :key="albumKey">

                  <div class="shadow p-2 rounded-lg">
                    <h3>{{album.name}}</h3>
                    <h4 class="text-muted">{{album.artist}}</h4>
                    <img class="img-fluid w-100" :src="album.image[album.image.length-1]['#text']" />
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
<style scoped>
  .logo img{
    max-width: 200px;
  }
  .home-content{
    min-height: 80vh;
    justify-content: center;
    align-items: center;
    
  }
</style>
<script>
import axios from 'axios'
export default {
  name: 'Home',
  data(){
    return {
      state:{
        searching: false,
      },
      searchQuery: null,
      searchResults: null,
    }
  },
  methods:{
    search(ev){
      ev.preventDefault()
      this.state.searching = true
      this.$axios.get(`search?searchQuery=${this.searchQuery}`)
        .then((response) => {
          console.log(response)
          this.state.searching = false
          this.searchResults = response.data
        })
    }
  }
}
</script>


