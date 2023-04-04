<template>
</template>

<script>
export default {
  name: 'IndexPage',
  mounted(){
    localStorage.removeItem('token')
    localStorage.removeItem('userData')
    location.href = '/'
  }
}
</script>
