<template>
  <div class="container">
    <div class="mt-5" v-if="album">
      <div class="row">
        <div class="col-md-5">
          <h1 class="mt-3">{{ album.name }}</h1>
          <h3 class="text-muted mt-0">by {{ album.artist }}</h3>
          <ol>
            <li>Listeners: {{ album.listeners?.toLocaleString() }}</li>
            <li>Plays: {{ album.playcount?.toLocaleString() }}</li>
          </ol>
          <button v-if="state.loadedFavorite" @click="() => toggleFavorite()" class="btn mr-3" :class="isFavorite?'btn-primary':'btn-outline-primary'">
            Favorite
          </button>
          <a
            :href="album.url"
            class="btn btn-outline-primary text-white text-primary"
            target="_blank"
            >Play</a
          >
          
        </div>
        <div class="col-md-5">
          <img :src="album.image[album.image.length - 1]['#text']" />
        </div>
        <div class="col-12">
          <h3>Tracks</h3>
          <ol>
            <li
              v-for="(track, trackKey) in album.tracks?.track"
              :key="trackKey"
            >
              <a :href="track.url" target="_blank" class="text-reset">{{ track.name }}</a>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlbumPage",
  head: {
    title: `Album | ${process.env.APP_NAME}`,
  },
  data() {
    return {
      albumQuery: {
        name: null,
        artist: null,
        mbid: null,
      },
      state: {
        loadedFavorite: false,
        searching: false,
      },
      isFavorite: null,
      favoriteId: null,
      searchResults: null,
      error: null,
    };
  },
  computed: {
    album() {
      return this.searchResults?.album;
    },
  },
  mounted() {
    let albumQ = {
      name: this.$route.query.name,
      artist: this.$route.query.artist,
      mbid: this.$route.query.mbid,
    };

    // Check if required album fields are present
    if (albumQ.mbid || (albumQ.name && albumQ.artist)) {
      this.state.searching = true;
      this.$axios
        .get("album_get", {
          params: {
            ...albumQ,
          },
        })
        .then((response) => {
          console.log(response);
          this.state.searching = false;
          let data = response.data
          this.searchResults = data;

          if(data.error){
            this.$toast.error(data.message);
          }else{
            this.checkFavorite()
          }
        });
    } else {
      // Show an error that all fields are not provided to be able to load the album
      this.$toast.error('All necessary fields were not sent, try again', {
        duration: null
      });
    }
  },
  methods: {
    checkFavorite(){
      this.$axios
        .post("album_favorite/check", {
          ...this.album,
        })
        .then((response) => {
          this.state.loadedFavorite = true
          this.isFavorite = response.data.favorite
          let message = null;
          if(this.isFavorite){
            this.favoriteId = response.data.id
            message = 'This is your favorite 🤗'
          }else{
            message = 'You can add this album to your favorites if you it'
          }
          this.$toast.info(message);
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.message);
        });
    },
    toggleFavorite(){
      // we can do action when we know if the app checked if this album is a favorite or not
      if(this.state.loadedFavorite){
        if(this.isFavorite){
          this.removeFavorite()
        }else{
          this.addToFavorite()
        }
      }
    },
    addToFavorite() {
      // Adds current album to favorite

      this.$axios
        .post("album_favorite", {
          ...this.album,
        })
        .then((response) => {
          this.isFavorite = true
          this.$toast.success(response.data.message);
        })
        .catch(({ response }) => {
          console.log(response);
          this.$toast.error(response.data.message);
        });
    },
    removeFavorite() {
      // remove current album from favorite
      let confirmRemoval = confirm(`Are you sure you want to remove ${this.album.name} from your favorites 😫`)
      if(confirmRemoval){
        this.$axios
          .delete(`album_favorite/${this.favoriteId}`,)
          .then((response) => {
            this.isFavorite = false
            this.$toast.success(response.data.message);
          })
          .catch(({ response }) => {
            this.$toast.error(response.data.message);
          });
      }else{
        this.$toast.success(`Keep having fun with ${this.album.name} 🤗`);
      }
    },
  },
};
</script>
