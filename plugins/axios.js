export default function ({ $axios, redirect }) {
    $axios.onRequest(config => {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    })

    // $axios.onError(error => {
    //   const code = parseInt(error.response && error.response.status)
    //   if (code === 400) {
    //     redirect('/400')
    //   }
    // })
}