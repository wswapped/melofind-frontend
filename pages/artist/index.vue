<template>
  <div class="container-fluid">
    <div v-if="artist">
      <div class="row">
        <div class="col-md-5">
          <h1>{{ artist.name }}</h1>
          <ol>
            <li>Listeners: {{ artist.stats.listeners.toLocaleString() }}</li>
            <li>Plays: {{ artist.stats.playcount.toLocaleString() }}</li>
          </ol>
          <a
            :href="artist.url"
            class="btn btn-primary text-white text-reset"
            target="_blank"
            >Play</a
          >
          <button @click="() => addToFavorite()" class="btn btn-primary">
            Favorite
          </button>
          <div>
            <a
              class="d-inline"
              v-for="(tag, smKey) in artist.tags.tag"
              :key="smKey"
              :href="tag.url"
            >
              {{ tag.name }}
            </a>
          </div>
        </div>
        <div class="col-md-5">
          <img :src="artist.image[artist.image.length - 1]['#text']" />
        </div>

        <div class="col-12">
          <div v-if="artist.bio">
            <p v-html="artist.bio.summary"></p>
            <p>
              <i>{{ artist.bio.published }}</i>
            </p>
          </div>

          <div class="row">
            <div
              class="col-md-4"
              v-for="(similarArtist, smKey) in artist.similar.artist"
              :key="smKey"
            >
              <h4>{{ similarArtist.name }}</h4>
            </div>
          </div>

          <ol>
            <li
              v-for="(track, trackKey) in artist.tracks?.track"
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
        searching: false,
      },
      searchResults: null,
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
    let albumQ = {
      artist: this.$route.query.artist,
      mbid: this.$route.query.mbid,
    };

    // Check if required fields are present
    if (albumQ.mbid || (albumQ.name && albumQ.artist)) {
      this.state.searching = true;
      this.$axios
        .get("artist_get", {
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
  methods:{
    addToFavorite() {
      // Adds current artist to favorite

      this.$axios
        .post("artist_favorite", {
          ...this.artist,
        })
        .then((response) => {
          this.$toast.success(response.data.message);
        })
        .catch(({ response }) => {
          this.$toast.error(response.data.message);
        });
    },
  },
};
</script>
