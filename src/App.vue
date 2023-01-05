<template lang="pug">
  v-app(v-if="verified", style="background-color: #FAFAFA")
    v-toolbar(app, flat, color="transparent", dark, clipped-left)
      //- v-chip.ml-2(v-if="appInfo.serviceActive", color="green", text-color="white", @click="switchActive")
        v-avatar
          v-icon check_circle
        div.font-weight-bold Activo
      //- v-chip.ml-2(v-else, color="red", text-color="white", @click="switchActive")
        v-avatar
          v-icon error
        div.font-weight-bold Desactivado
      v-card(color="white", style="border-radius: 40px", light)
        v-btn(:color="$route.name == 'index' ? 'blue lighten-1' : 'black'", :flat="$route.name != 'index'", @click="$router.push({ path: '/' })", icon)
          v-icon fas fa-truck
        v-btn(:color="$route.name == 'users' ? 'blue lighten-1' : 'black'", :flat="$route.name != 'users'", @click="$router.push({ path: '/users' })", icon)
          v-icon fas fa-users
        v-btn(:color="$route.name == 'closet' ? 'blue lighten-1' : 'black'", :flat="$route.name != 'closet'", @click="$router.push({ path: '/closet' })", icon) 
          v-icon fas fa-tshirt
        v-btn(:color="$route.name == 'brands' ? 'blue lighten-1' : 'black'", :flat="$route.name != 'brands'", @click="$router.push({ path: '/brands' })", icon)
          v-icon fas fa-copyright
        v-btn(:color="$route.name == 'analytics' ? 'blue lighten-1' : 'black'", :flat="$route.name != 'analytics'", @click="$router.push({ path: '/analytics' })", icon)
          v-icon fas fa-chart-line
        v-btn(icon, color="blue lighten-1") {{ $store.state.tramitCount }}
      v-spacer
      v-card(color="white", style="border-radius: 40px; min-width: 400px; height: 50px", light)
        v-text-field(v-model="searchFilter", round, single-line, append-icon="search", label="Buscar", clearable, style="transform: scale(.8)")
    router-view.ma-3


</template>

<script>
  export default {
    data () {
      return {
        searchFilter: '',
        verified: true
      }
    },

    watch: {
      searchFilter(value) {
        this.searchFilter = value
        this.$store.state.searchFilter = value
      }
    },

    mounted() {
      console.log(this.$route.name)
      const urlParams = new URLSearchParams(window.location.search);
      const myParam = urlParams.get('pass');
      if (myParam != '5ccbac9a8425f20575fd600f7322a03b') {
        this.verified = false
        window.location = 'https://mouo.es'
      }
      this.$store.dispatch("fetchServices")
    },

    computed: {

      appInfo() {
        this.$store.dispatch('fetchAppInfo')
        return this.$store.state.appInfo
      },

    },

    filters: { 
      getState(value) {
        if(!value) return ''

        var state = ''

        switch (value) {
          case 'tramit':
            state = 'Tramitando'
            break;
          case 'paymentError':
            state = 'Error de pago'
            break;
          case 'sended':
            state = 'Enviando'
            break;
          case 'received':
            state = 'Recibiendo'
            break;
          case 'conflict':
            state = 'Conflicto'
            break;
          case 'finished':
            state = 'Finalizado'
            break;
          
        }

        return state
      }
    },

    methods: {

      switchActive() {
        this.$store.dispatch('switchActive')
      },
 
    }

    
  }
</script>


