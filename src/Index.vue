<template lang="pug">
  #index
    v-navigation-drawer(permanent, clipped, app, style="background-color: transparent")
      v-list(style="background-color: transparent")
        v-list-tile(@click="filter = ''", :color="(filter == '') ? 'blue' : 'black'")
          v-list-tile-action
            v-icon all_inbox
          v-list-tile-content Todos los pedidos
        v-list-tile(@click="filter = 'tramit'", :color="(filter == 'tramit') ? 'blue' : 'black'")
          v-list-tile-action
            v-icon supervised_user_circle
          v-list-tile-content En tramite
          v-list-tile-action
            v-avatar.white--text(v-if="$store.state.tramitCount != 0", color="blue", size="24") {{ $store.state.tramitCount }}
            v-avatar(v-else, flat, size="24") {{ $store.state.tramitCount }}
        v-list-tile(@click="filter = 'paymentError'", :color="(filter == 'paymentError') ? 'blue' : 'black'")
          v-list-tile-action
            v-icon error
          v-list-tile-content Error de pago
          v-list-tile-action
            v-avatar.white--text(v-if="$store.state.errorCount != 0", color="red", size="24") {{ $store.state.errorCount }}
            v-avatar(v-else, flat, size="24") {{ $store.state.errorCount }}
        v-list-tile(@click="filter = 'sended'", :color="(filter == 'sended') ? 'blue' : 'black'")
          v-list-tile-action
            v-icon call_made
          v-list-tile-content Enviando
          v-list-tile-action
            v-avatar.white--text(v-if="$store.state.sendedCount != 0", color="blue", size="24") {{ $store.state.sendedCount }}
            v-avatar(v-else, flat, size="24") {{ $store.state.sendedCount }}
        v-list-tile(@click="filter = 'received'", :color="(filter == 'received') ? 'blue' : 'black'")
          v-list-tile-action
            v-icon call_received
          v-list-tile-content Recibiendo
          v-list-tile-action
            v-avatar.white--text(v-if="$store.state.receivedCount != 0", color="blue", size="24") {{ $store.state.receivedCount }}
            v-avatar(v-else, flat, size="24") {{ $store.state.receivedCount }}
        v-list-tile(@click="filter = 'conflict'", :color="(filter == 'conflict') ? 'blue' : 'black'")
          v-list-tile-action
            v-icon warning
          v-list-tile-content Conflicto
          v-list-tile-action
            v-avatar.white--text(v-if="$store.state.conflictCount != 0", color="yellow darken-1", size="24") {{ $store.state.conflictCount }}
            v-avatar(v-else, flat, size="24") {{ $store.state.conflictCount }}
        v-list-tile(@click="filter = 'finished'", :color="(filter == 'finished') ? 'blue' : 'black'")
          v-list-tile-action
            v-icon check_circle
          v-list-tile-content Finalizados
          v-list-tile-action
            div.mr-2 {{ $store.state.finishedCount }}
    v-content.ma-3
      v-expansion-panel
        v-expansion-panel-content(v-for="(service, i) in services", :key="i")
          v-layout(slot="header", justify-space-between, align-center, @click="userSelect(service.email)")
            div
              h3 {{ service.displayName }}
              div {{  service.email }}
          v-card.pa-3
            v-subheader Acciones
            v-layout(align-center, wrap)
              v-menu(offset-y, open-on-hover)
                v-btn(slot="activator", flat) {{ service.state | getState }}
                v-card
                  v-list
                    v-list-tile(@click="updateState(service.id, 'tramit', service.email, service.changeList, service.nextList, service.conserveList)") Tramitando
                    v-list-tile(@click="updateState(service.id, 'paymentError', service.email, service.changeList, service.nextList, service.conserveList)") Error de pago
                    v-list-tile(@click="updateState(service.id, 'sended', service.email, service.changeList, service.nextList, service.conserveList)") Enviando
                    v-list-tile(@click="updateState(service.id, 'received', service.email, service.changeList, service.nextList, service.conserveList)") Recibiendo
                    v-list-tile(@click="updateState(service.id, 'conflict', service.email, service.changeList, service.nextList, service.conserveList)") Conflicto
                    v-list-tile(@click="updateState(service.id, 'finished', service.email, service.changeList, service.nextList, service.conserveList)") Finalizado
              v-btn(icon, color="blue", dark, large, @click="sendMail(service.email, service.email)")
                v-icon email
              v-btn(v-if="service.paymentInfo", icon, color="grey", dark, large, @click="goToCustomer(service.paymentInfo.customer)")
                v-icon account_balance_wallet
              v-chip(color="green")
                div.font-weight-bold.white--text {{ service.phone }}
              v-chip(v-if="service.Cancelled")
                div Cancelación
              v-text-field.ml-4(label="Valor", v-model="amount", width="100px")
              v-btn(color="blue darken-1", dark, @click="charge(service.email)") Cobrar
            v-subheader Dirección
            .ml-4
              v-layout
                div.font-weight-bold Dirección
                div.ml-3 {{ service.direction.direction }}
              v-layout
                div.font-weight-bold Cod. Postal
                div.ml-3 {{ service.direction.cp }}
              v-layout
                div.font-weight-bold Localidad
                div.ml-3 {{ service.direction.city }} - {{ service.direction.province }}

            v-subheader.green--text Prendas a mandar
            v-list
              v-list-tile(v-for="(clothing, i) in service.nextList", :key="i")
                v-list-tile-avatar
                  img(:src="clothing.Images[0]")
                v-list-tile-content
                  v-list-tile-title <strong>{{ clothing.Size }}</strong> - {{ clothing.Title }}
                  v-list-tile-sub-title {{ clothing.Brand }}
            v-subheader.red--text Prendas a recibir
            v-list
              v-list-tile(v-for="(clothing, i) in service.changeList", :key="i")
                v-list-tile-avatar
                  img(:src="clothing.Images[0]")
                v-list-tile-content
                  v-list-tile-title {{ clothing.Size }} - {{ clothing.Title }}
                  v-list-tile-sub-title {{ clothing.Brand }}
            v-subheader Ha mantenido
            v-list
              v-list-tile(v-for="(clothing, i) in service.conserveList", :key="i")
                v-list-tile-avatar
                  img(:src="clothing.Images[0]")
                v-list-tile-content
                  v-list-tile-title {{ clothing.Size }} - {{ clothing.Title }}
                  v-list-tile-sub-title {{ clothing.Brand }}
            v-subheader.grey--text Compradas
            v-list
              v-list-tile(v-for="(clothing, i) in service.bought", :key="i")
                v-list-tile-avatar
                  img(:src="clothing.Images[0]")
                v-list-tile-content
                  v-list-tile-title {{ clothing.Size }} - {{ clothing.Title }}
                  v-list-tile-sub-title {{ clothing.Brand }}
    v-navigation-drawer(v-if="userSelected", permanent, clipped, app, right, style="background-color: transparent")
      v-toolbar(dense, flat, color="transparent")
          v-layout
            v-icon.mr-3 subject 
            div(v-if="!userSelected") Registro
            div(v-else) {{ userSelected }}
      v-list.observations(style="background-color: transparent")
        v-list-tile(v-for="(log, index) in logs", :key="index")
          v-chip(color="blue lighten-2")
            v-layout(wrap)
              div(style="font-size: 10px") {{log.text}}
              .font-weight-light.ml-2(style="font-size: 10px") {{ log.date.seconds | toDateCompact }}
      v-text-field.observationEntry(v-model="observationText", hide-details, label="Observaciones", append-icon="send", @click:append="addObservation", @keydown.enter.prevent="addObservation", solo, flat)

</template>

<script>
export default {
    data() {
        return {
            filter: '',
            userSelected: '',
            observationText: '',
            amount: 0,
        }
    },

    computed: {
        logs() {
            if (this.userSelected) {
            this.$store.dispatch('fetchLogs', this.userSelected)
            return this.$store.state.logs
            }

            else {
            const date = new Date()
            return [{
                text: 'No existe ningún usuario seleccionado',
                date
            }]
            }
        },

    searchFilter() {
        return this.$store.state.searchFilter
    },

      services() {
        var services = []

        if (this.filter) {
          services = this.$store.state.services.filter(service => service.state == this.filter);
        }

        else {
          services = this.$store.state.services
        }

        if (this.searchFilter) {
          const self = this
          services = services.filter(service => {
            const changeListIndex = service.changeList.findIndex(x => {
              return x.Brand.includes(self.searchFilter) || x.Title.includes(self.searchFilter) || x.Value.includes == self.searchFilter
            })
            return service.email.includes(this.searchFilter) || service.phone.includes(this.searchFilter) || service.displayName.includes(this.searchFilter) || (changeListIndex != -1)
          })
        }

        console.log("services", services)
        
        return services
      }

    },

    filters: {
        toDateCompact(value) {
            if (!value) return ''
            var date = new Date(value * 1000)

            return `${date.getHours()}:${date.getMinutes()} ${date.getUTCDate()}/${date.getMonth()+1}/${date.getFullYear()}`
      },

            getIcon(value) {
        if(!value) return ''

        var icon = ''

        switch (value) {
          case 'tramit':
            icon = 'supervised_user_circle'
            break;
          case 'paymentError':
            icon = 'error'
            break;
          case 'sended':
            icon = 'call_made'
            break;
          case 'received':
            icon = 'call_received'
            break;
          case 'conflict':
            icon = 'warning'
            break;
          case 'finished':
            icon = 'check_circle'
            break;
          
        }

        return icon
      },



      toDate(value) {
        if (!value) return ''
        var date = new Date(value * 1000)

        var weekDay = ''
        var month

        switch (date.getDay()) {
          case 1:
            weekDay = 'Lunes'
            break;
          case 2:
            weekDay = 'Martes'
            break;
          case 3:
            weekDay = 'Miércoles'
            break;
          case 4:
            weekDay = 'Jueves'
            break;
          case 5:
            weekDay = 'Viernes'
            break;
          case 6:
            weekDay = 'Sábado'
            break;
          case 7:
            weekDay = 'Domingo'
            break;
        }

        switch (date.getMonth() + 1) {
          case 1: 
            month = 'Enero'
            break;
          case 2: 
            month = 'Febrero'
            break;
          case 3: 
            month = 'Marzo'
            break;
          case 4: 
            month = 'Abril'
            break;
          case 5: 
            month = 'Mayo'
            break;
          case 6: 
            month = 'Junio'
            break;
          case 7: 
            month = 'Julio'
            break;
          case 8: 
            month = 'Agosto'
            break;
          case 9: 
            month = 'Septiembre'
            break;
          case 10: 
            month = 'Octubre'
            break;
          case 11: 
            month = 'Noviembre'
            break;
          case 12: 
            month = 'Diciembre'
            break;
        }

        return `${weekDay}, ${date.getUTCDate()} de ${month}, ${date.getFullYear()}`
      },

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

      getDay() {
        const date = new Date()
        return date.getUTCDate()
      },
        
      charge(email) {
        this.$store.dispatch('charge', {
          email,
          amount: this.amount * 100
        })
      },

      addObservation() {
        const date = new Date()
        this.$store.dispatch('addLog', {
          email: this.userSelected,
          text: this.observationText,
          date
        }).then(() => {
          this.observationText = ''
        })
      },

      userSelect(email) {
        console.log(email)
        this.userSelected = email
      },

      sendMail(email) {
        window.location.href = `mailto:${email}`
      },

      updateState(id, state, email, changeList, nextList, conserve) {
        const actual = [...nextList, ...conserve]
        
        this.$store.dispatch('updateState', {id, state, email, changeList, nextList: actual})
      },

      goToCustomer(token) {
        window.open(`https://dashboard.stripe.com/test/customers/${token}`)
      }

    }
}
</script>

<style lang="scss" scoped>
  .observationEntry {
    position: absolute; 
    bottom: 0px;
    width: 100%;
  }

  .observations {
    overflow-y: scroll;
    height: calc(100vh - 160px);
  }
</style>