<template lang="pug">
    v-content.pa-3#Analytics
        //- Registros totales 
        v-layout.mt-5
            v-flex(xs4)
                v-subheader Registros
                v-card.pa-4
                    v-layout(v-if="register.length != 0", justify-space-between)
                        div
                            .font-weight-bold Total
                            .font-weight-black(style="font-size: 2em") {{register.length + registerInstagram.length}}
                        div
                            .font-weight-bold Email
                            .font-weight-black(style="font-size: 2em") {{register.length}}
                        div
                            .font-weight-bold Instagram
                            .font-weight-black(style="font-size: 2em") {{registerInstagram.length}}
                    v-layout.pa-8(v-else, column, align-center)
                        v-btn(color="blue", dark, @click="bringData", :loading="loadingData") Ver Numero Registros
                        v-alert(:value="true", type="warning", outline) Traer los datos todo el rato es muy costoso
                v-card.pa4
                    v-btn(block, color="blue", dark, :loading="loadingCsv", @click="exportcsv") Exportar CSV
                v-card.mt-2.pa-3
                    .font-weight-bold Generador de enlaces
                    v-text-field(v-model="campaign", label="<nombre_campaña>", :error-messages="error == 'campaign' ? 'Este campo no puede estar vacío' : ''", placeholder="Marta Soriano Noviembre")
                    v-text-field(v-model="utm_source", label="Campaign Source", :error-messages="error == 'utm_source' ? 'Este campo no puede estar vacío' : ''", placeholder="google, newsletter...")
                    v-text-field(v-model="utm_medium", label="Campaign Medium", :error-messages="error == 'utm_medium' ? 'Este campo no puede estar vacío' : ''", placeholder="banner, email...")
                    v-text-field(v-model="utm_content", label="Campaign Content (Opcional)", placeholder="Información extra")
                    v-btn-toggle(v-model="campaignType")
                        v-btn Instagram
                        v-btn Email
                        v-btn Ambos
                        
                    v-btn(block, color="blue", @click="generate", dark) Generar enlace
                    v-tooltip.pointer(bottom, @click.native="copyLink(linkResult)", style="position: relative")
                        .pa-2(slot="activator", style="position: relative; background-color: #FAFAFA")
                            p(style="white-space: wrap; word-break: break-all;") {{linkResult}}
                        span Click para copiar enlace
                v-card.mt-2.pa-3
                    .font-weight-bold Enlaces de utilidad
                    v-btn.my-2(block, color="green", dark, @click="openWindow('https://docs.google.com/document/d/1z39cbyjQLL-g3wHyJuPPZZnQT-uCixGYzy65SVTT-ck/edit?usp=sharing')") Ir a la guía
                    v-btn.my-2(block, color="red", dark, @click="openWindow('https://insights.hotjar.com/sites/1439489/heatmap/list')") Ver heatmaps
                    v-btn.my-2(block, color="red", dark, @click="openWindow('https://insights.hotjar.com/sites/1439489/playbacks/list?filters=%7B%22DAYS_AGO%22:%7B%22created%22:365%7D%7D')") Ver recordings
                    v-btn.my-2(block, color="blue darken-2", dark, @click="openWindow('https://www.facebook.com/analytics/2099208130385245/Funnels?__aref_src=events_manager_view_analytics_link&force_desktop=1&user_id=100002417663459')") Ver embudos
                    v-btn.my-2(block, color="blue darken-2", dark, @click="openWindow('https://www.facebook.com/events_manager/pixel/events?act=517167175056186&selected_screen_section=DATA_SOURCES&pixel_id=2099208130385245')") Ir a Pixel
                    v-btn.my-2(block, color="orange", dark, @click="openWindow('https://analytics.google.com/analytics/web/#/report-home/a123736439w182151492p179883766')") Ir a Google Analytics
                    v-btn.my-2(block, color="blue darken-2", dark, @click="openWindow('https://www.facebook.com/analytics/2099208130385245/overview/?force_desktop=1&user_id=100002417663459&__aref_src=events_manager_view_analytics_link')") Ir a Facebook Analytics
                    v-btn.my-2(block, color="red", dark, @click="openWindow('https://insights.hotjar.com/sites/1439489/dashboard')") Ir a Hotjar
            v-flex.pl-2(xs8)
                v-subheader Enlaces generados
                v-card.pa-1
                    v-alert(v-if="links.length == 0", :value="true", type="error", outline) No hay ningún link
                    v-list(v-else, two-line)
                        v-list-tile(v-for="(link, i) in links", :key="i")
                            v-list-tile-content
                                v-list-tile-title.pointer(@click="copyLink(link.data().link)")
                                    v-tooltip(bottom)
                                        div(slot="activator") {{`${link.data().event}: ${link.data().campaign}`}}
                                        span Click para copiar enlace
                                v-list-tile-sub-title {{link.data().createdAt | toDate}}
                            v-list-tile-action
                                v-btn(icon, @click="removeLink(`${link.data().event}.${link.data().campaign}`)") 
                                    v-icon far fa-times-circle
        v-snackbar(v-model="copied", color="green", :timeout="2000") Enlace copiado
                            
    //- Acceso a la guia
    //- Listar los registros
</template>

<script>

import slugify from 'slugify'

export default {
    data() {
        return {
            register: [],
            registerInstagram: [],
            links: [],
            campaign: "",
            linkResult: "",
            utm_source: "",
            utm_content: "",
            utm_medium: "",
            error: "",
            loadingCsv: false,
            loadingData: false,
            copied: false,
            campaignType: 0
        }
    },

    filters: {
        toDate(value) {
            let date = new Date(value * 1000)
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        }
    },

    methods: {
        openWindow(link) {
            window.open(link)
        },

        async bringData() {
            this.loadingData = true
            this.register = await this.$store.dispatch("getRegister")
            this.registerInstagram = await this.$store.dispatch("getRegisterInstagram")
            this.loadingData = false
        },

        addLink(link) {
            this.$store.dispatch("addLink", link)
            this.getLinks()
        },

        removeLink(link) {
            this.$store.dispatch("removeLink", link)
            this.getLinks()
        },

        checkError() {
            if (this.campaign.length == 0) {
                this.error = "campaign"
                return false
            }
            else if (this.utm_source.length == 0) {
                this.error = "utm_source"
                return false
            }
            else if (this.utm_medium.length == 0) {
                this.error = "utm_medium"
                return false
            }
            else {
                this.error = ""
                return true
            }
        },

        async exportcsv() {

            this.loadingCsv = true

            if (this.register.length == 0) {
                this.register = await this.$store.dispatch("getRegister")
                this.registerInstagram = await this.$store.dispatch("getRegisterInstagram")
            }

            let csv = "data:text/csv;charset=utf-8, EMAIL, FECHA DE CREACIÓN, CAMPAÑA\n"
            this.register.forEach(doc => {
                let dateString
                let campaign
                if (doc.data().username.length != 0) {
                    dateString = "MOUO"
                }
                else if (typeof doc.data().createdAt != 'undefined') {
                    let date = new Date(doc.data().createdAt * 1000)
                    dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                }
                else {
                    dateString = "Anterior al 15/11"
                }

                if (typeof doc.data().event != 'undefined') {
                    campaign = ', ' + doc.data().event + '\n'
                }

                else {
                    campaign = '\n'
                }
                
                let date = new Date()
                csv += `${doc.data().email.replace(/ /g,'')}, ${dateString}${campaign}`
            })

            // let csv = "data:text/csv;charset=utf-8," + docs.join('"\n"').replace(/,/g, '","');
            console.log(csv)
            var encodedUri = encodeURI(csv);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "mails.csv");
            document.body.appendChild(link); 

            link.click()




            let csvInstagram = "data:text/csv;charset=utf-8, EMAIL, FECHA DE CREACIÓN, CAMPAÑA\n"
            this.registerInstagram.forEach(doc => {
                let dateStringInstagram
                let campaignInstagram
                if (typeof doc.data().createdAt != 'undefined') {
                    let date = new Date(doc.data().createdAt * 1000)
                    dateStringInstagram = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
                }
                else {
                    dateStringInstagram = "Anterior al 15/11"
                }

                campaignInstagram = doc.data().event ? ', ' + doc.data().event + '\n' : '\n'
                
                let date = new Date()
                csvInstagram += `${doc.data().instagram.replace(/ /g,'').replace(/,/g, '')}, ${dateStringInstagram}${campaignInstagram}`
            })

            console.log(csvInstagram)
            var encodedUriInstagram = encodeURI(csvInstagram);
            var linkInstagram = document.createElement("a");
            linkInstagram.setAttribute("href", encodedUriInstagram);
            linkInstagram.setAttribute("download", "instagram.csv");
            document.body.appendChild(linkInstagram); 

            linkInstagram.click()

            this.loadingCsv = false
        },

        generate() {
            if (!this.checkError()) return
            const camp = this.campaignType == 0 ? 'instagram' : this.campaignType == 1 ? 'onlymail' : 'event'
            let content = this.utm_content.length != 0 ? `&utm_content=${slugify(this.utm_content, {lower: true})}` : ''
            this.linkResult = `https://pantala.es?${camp}=${slugify(this.campaign, {lower: true})}&utm_source=${slugify(this.utm_source, {lower: true})}&utm_medium=${slugify(this.utm_medium, {lower: true})}&utm_campaign=${slugify(this.campaign, {lower: true})}${content}`
            this.addLink({
                event: camp, 
                campaign: slugify(this.campaign, {lower: true}),
                utm_source: this.utm_source,
                utm_content: this.utm_content,
                utm_medium: this.utm_medium
                })
        },

        async copyLink(link) {
            await navigator.clipboard.writeText(link)
            this.copied = true
        },

        async getLinks() {
            this.links = await this.$store.dispatch("getLinks")
        }
    },

    async mounted() {
        this.getLinks()
    }
}
</script>

<style lang="scss" scoped>
    .pointer {
        cursor: pointer;
    }
</style>