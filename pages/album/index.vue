<template>
  <div class="container-fluid">
    <div v-if="album">
      <div class="row">
        <div class="col-md-5">
          <h1>{{ album.name }}</h1>
          <h2 class="text-muted">by {{ album.artist }}</h2>
          <ol>
            <li>Listeners: {{ album.listeners?.toLocaleString() }}</li>
            <li>Plays: {{ album.playcount?.toLocaleString() }}</li>
          </ol>
          <a
            :href="album.url"
            class="btn btn-primary text-white text-reset"
            target="_blank"
            >Play</a
          >
          <button @click="() => addToFavorite()" class="btn btn-primary">
            Favorite
          </button>
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
          this.searchResults = response.data;
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
