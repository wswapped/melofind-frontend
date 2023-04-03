<template>
    <div class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0">
        <div class="">
            <a class="logo" href="/">
                <img src="/melofinder_logo.png" />
            </a>
            <Nuxt />
        </div>
    </div>
  
</template>
<style lang="scss" scoped>
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
export default {
  name: 'Layout',
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
  }
}
</script>