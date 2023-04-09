<template>
  <div class="container">
    <div class="mt-5" v-if="artist">
      <div class="row">
        <div class="col-md-5">
          <h1 class="mt-3 my-2">{{ artist.name }}</h1>
          <ol>
            <li>Listeners: {{ artist.stats.listeners.toLocaleString() }}</li>
            <li>Plays: {{ artist.stats.playcount.toLocaleString() }}</li>
          </ol>
          <button v-if="state.loadedFavorite" @click="() => toggleFavorite()" class="btn mr-3" :class="isFavorite?'btn-primary':'btn-outline-primary'">
            Favorite
          </button>
          <a
            :href="artist.url"
            class="btn btn-outline-primary text-white text-primary"
            target="_blank"
            >Play</a
          >
         
          <div class="mt-4">
            <a
              class="d-inline btn btn-outline-secondary mr-2 mb-2"
              v-for="(tag, smKey) in artist.tags.tag"
              :key="smKey"
              :href="tag.url"
              target="_blank"
            >
              {{ tag.name }}
            </a>
          </div>
        </div>
        <div class="col-md-5">
          <img :src="artist.image[artist.image.length - 1]['#text']" />
        </div>

        <div class="col-12">
          <div class="my-4" v-if="artist.bio">
            <h3 class="my-3">Bio</h3>
            <p v-html="artist.bio.summary"></p>
            <p>
              <i>{{ artist.bio.published }}</i>
            </p>
          </div>

          <div v-if="albums && albums.topalbums.album">
            <h2 class="my-2">Top Albums</h2>
            <div class="row">
              <div class="p-2 col-md-4" v-for="(album, albumKey) in albums.topalbums.album" :key="albumKey">

                <div class="shadow p-2 album-card rounded-lg">
                  <NuxtLink :to="`album?name=${album.name}&artist=${album.artist.name}`">
                    <h3>{{album.name}}</h3>
                    <img class="img-fluid w-100" :src="album.image[album.image.length-1]['#text']" />
                  </NuxtLink>
                  </div>
              </div>
            </div>
          </div>
          <div v-if="tracks && tracks.toptracks.track">
            <h2 class="my-2">Top Tracks</h2>
            <ol >
              <li
                v-for="(track, trackKey) in tracks.toptracks.track"
                :key="trackKey"
              >
                <a :href="track.url" class="text-reset" target="_blank"> {{ track.name }} </a>
              </li>
            </ol>
          </div>

          <div class="row" v-if="artist.similar.artist">
            <div class="col-12">
              <h2 class="my-3">Similar artists</h2>
            </div>
            <div
              class="col-md-3"
              v-for="(similarArtist, smKey) in artist.similar.artist"
              :key="smKey"
            >
              <h4><a :href="similarArtist.url" class="text-reset" target="_blank">{{ similarArtist.name }}</a></h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "AlbumPage",
  head: {
    title: `Artist | ${process.env.APP_NAME}`,
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
      tracks: null,
      albums: null,
      searchResults: null,
      isFavorite: null,
      favoriteId: null,
      error: null,
    };
  },
  computed: {
    artist() {
      return this.searchResults?.artist;
    },
  },
  mounted() {
    console.log(this.$route.query);
    let artistQ = {
      artist: this.$route.query.name,
      mbid: this.$route.query.mbid,
    };

    // Check if required fields are present
    if (artistQ.mbid || (artistQ.artist)) {
      this.state.searching = true;
      this.$axios
        .get("artist_get", {
          params: {
            ...artistQ,
          },
        })
        .then((response) => {
          console.log(response);
          this.state.searching = false;
          this.searchResults = response.data;

          this.checkFavorite()
          this.getTracksAlbums(artistQ)
        });
    } else {
      // TODO: proper error
      this.$toast.error("Proper data not sent in request", {
        duration: null
      });
    }
  },
  methods:{
    checkFavorite(){
      this.$axios
        .post("artist_favorite/check", {
          ...this.artist,
        })
        .then((response) => {
          this.state.loadedFavorite = true
          this.isFavorite = response.data.favorite
          let message = null;
          if(this.isFavorite){
            this.favoriteId = response.data.id
            message = 'This is your favorite'
          }else{
            message = 'You can add this artist to your favorites if you like'
          }
          this.$toast.info(message);
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.message);
        });
    },
    getTracksAlbums(artistData){
      this.state.tracks_albums = true
      this.$axios
        .get("artist/track_albums", {
          params: {
            ...artistData,
          }
        })
        .then((response) => {
          this.state.tracks_albums = false
          let data = response.data
          this.tracks = data.tracks
          this.albums = data.albums
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.message);
        });
    },
    toggleFavorite(){
      // we can do action when we know if the app checked if this artist is a favorite or not
      if(this.state.loadedFavorite){
        if(this.isFavorite){
          this.removeFavorite()
        }else{
          this.addToFavorite()
        }
      }
    },
    addToFavorite() {
      // Adds current artist to favorite

      this.$axios
        .post("artist_favorite", {
          ...this.artist,
        })
        .then((response) => {
          this.isFavorite = true
          this.favoriteId = response.data.id
          this.$toast.success(response.data.message);
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.message);
        });
    },
    removeFavorite() {
      // remove current artist to favorite
      let confirmRemoval = confirm(`Are you sure you want to remove ${this.artist.name} from your favorites 😫`)
      if(confirmRemoval){
        this.$axios
          .delete(`artist_favorite/${this.favoriteId}`,)
          .then((response) => {
            this.isFavorite = false
            this.$toast.success(response.data.message);
          })
          .catch(({ response }) => {
            this.$toast.error(response.data.message);
          });
      }else{
         this.$toast.success(`Keep having fun with ${this.artist.name}'s music 🤗`);
      }
    },
    
  },
};
</script>
