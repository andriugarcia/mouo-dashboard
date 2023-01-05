<template lang="pug">
    v-content.ma-3
        v-expansion-panel
            v-expansion-panel-content(v-for="(user, index) in users", :key="index")
                v-layout(slot="header", justify-space-between, align-center)
                    div
                        h3 {{ user.displayName }}
                        div {{  user.email }}
                    div
                        .red--text(v-if="!user.displayName") Faltan datos críticos {{ user.id }}
                        .red--text(v-else-if="!user.size") Falta talla
                        div(v-else-if="user.directionList.length == 0 && user.paymentList.length == 0") No ha añadido dirección ni pago
                        div(v-else-if="user.directionList.length == 0") No ha añadido dirección
                        div(v-else-if="user.paymentList.length == 0") No ha añadido pago
                        div(v-else-if="user.temporalList.length == 0") No ha escogido prendas
                        .green--text(v-else-if="user.active") Activo
                    //- div {{ service.createdAt.seconds | toDate }}
                    //- v-btn(flat, small)
                        //- v-icon.mr-1 {{ service.state | getIcon }}
                        //- div {{ service.state | getState }}
                v-card.pa-3
                    v-layout
                        strong Usuario
                        div.ml-2 {{ user.active ? 'Activo' : 'No Activo' }}
                    v-layout(v-if="user.active")
                        strong Dia de actualización
                        div.ml-2 {{ user.payday }}
                    v-subheader.pl-0 Direccion seleccionada
                    v-layout(v-for="(direction, index) in user.directionList", :key="index")
                        div(v-if="direction.selected") {{ direction.direction }} - {{ direction.province }}/{{ direction.city }} ({{direction.cp}})
                    v-layout.pt-3
                        v-btn(icon, color="blue", dark, large, @click="sendMail(user.email)")
                            v-icon email
                        v-btn(icon, color="grey", dark, large, @click="goToCustomer(user.customerInfo.id)")
                            v-icon account_balance_wallet
                        v-chip(color="green")
                            div.font-weight-bold.white--text {{ user.phone }}
                    div(v-if="user.size")
                        v-subheader Tallas
                        .ml-4
                            v-layout
                                div.font-weight-bold Camiseta
                                div.ml-3 {{ user.size.shirt }}
                            v-layout
                                div.font-weight-bold Pantalón
                                div.ml-3 {{ user.size.pants }}
                            v-layout
                                div.font-weight-bold Vestido
                                div.ml-3 {{ user.size.dress }}
                            v-layout
                                div.font-weight-bold Estatura
                                div.ml-3 {{ user.size.height }}

                    v-subheader Prendas actuales
                    v-list
                        v-list-tile(v-for="(clothing, index) in user.actualList", :key="index")
                            v-list-tile-avatar
                                img(:src="clothing.Image")
                            v-list-tile-content
                                v-list-tile-title {{ clothing.Size }} - {{ clothing.Title }}
                                v-list-tile-sub-title {{ clothing.Brand }}
                    v-subheader Prendas escogidas
                    v-list
                        v-list-tile(v-for="(clothing, index) in user.nextList", :key="index")
                            v-list-tile-avatar
                                img(:src="clothing.Image")
                            v-list-tile-content
                                v-list-tile-title {{ clothing.Size }} - {{ clothing.Title }}
                                v-list-tile-sub-title {{ clothing.Brand }}

</template>

<script>
export default {
    computed: {
        searchFilter() {
            return this.$store.state.searchFilter
        },

        users() {
            this.$store.dispatch('fetchUsers')

            if (this.searchFilter) {
                return this.$store.state.users.filter(user => {
                    return user.displayName.includes(this.searchFilter) || user.email.includes(this.searchFilter) ||
                    user.phone.includes(this.searchFilter)
                })
            }

            else {
                return this.$store.state.users
            }
        }
    },

    methods: {
        sendMail(email) {
            window.location = `mailto:${email}`
        },

        goToCustomer(token) {
            window.open(`https://dashboard.stripe.com/test/customers/${token}`)
        }
    }
}
</script>

