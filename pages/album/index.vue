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
          <button @click="() => addToFavorite()" class="btn btn-primary mr-3">
            Favorite
          </button>
          <a
            :href="album.url"
            class="btn btn-outline-primary text-white text-reset"
            target="_blank"
            >Play</a
          >
          
        </div>
        <div class="col-md-5">
          <img :src="album.image[album.image.length - 1]['#text']" />
        </div>
        <div class="col-12">
          <ol>
            <li
              v-for="(track, trackKey) in album.tracks?.track"
              :key="trackKey"
            >
              {{ track.name }}
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
        searching: false,
      },
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
    console.log(this.$route.query);
    let albumQ = {
      name: this.$route.query.name,
      artist: this.$route.query.artist,
      mbid: this.$route.query.mbid,
    };

    // Check if required fields are present
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
          }
        });
    } else {
      // TODO: proper error
      alert("Error");
    }
  },
  methods: {
    addToFavorite() {
      // Adds current album to favorite

      this.$axios
        .post("album_favorite", {
          ...this.album,
        })
        .then((response) => {
          this.$toast.success(response.data.message);
        })
        .catch(({ response }) => {
          console.log(response);
          this.$toast.error(response.data.message);
        });
    },
  },
};
</script>
