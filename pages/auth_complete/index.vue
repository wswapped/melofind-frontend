<template>
<div>
  
</div>
</template>

<script>
export default {
  name: 'AlbumPage',
  data(){
    return {
     token: null,
      state:{
        searching: false,
      },
      searchResults: null,
      error: null,
    }
  },
  mounted(){
    this.token = this.$route.query.token
    console.log(this.$route.query)
    localStorage.setItem("token", this.token);
    // get the user's data
    this.$axios.get('user', {
      'headers': {
        'Authorization': `Bearer ${this.token}`,
      }
    })
    .then((data) => {
      console.log(data)
      localStorage.setItem("userData", JSON.stringify(data.data));
      location.href = '/'
    })
  },
}
</script>
