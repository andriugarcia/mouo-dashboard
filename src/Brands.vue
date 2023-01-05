<template lang="pug">
    v-content.pa-3
        v-card.mt-5.pa-3
            v-layout.pa-3(wrap, justify-center)
                div.mr-2(v-for="(brand, i) in brands", :key="i")
                    v-dialog(width="800")
                        v-btn(slot="activator", block, flat) 
                            div {{ brand.Title }}
                            v-btn(v-if="deleting", @click.stop="removeBrand(brand.Title)", small, flat, icon)
                                v-icon close
                        v-card.pa-3
                            v-alert(type="success", :value="brandEdited") Marca actualizada
                            v-subheader Editar {{ brand.Title }}
                            v-subheader.pl-0 Logo
                            input(type="file", @change="updateFile", multiple)
                            v-layout.my-2
                                img.mr-2(:src="brand.Logo", style="height: 200px; width: 150px; border-radius: 20px")
                            v-text-field(label="Fundado el", v-model="brand.Founded")
                            v-text-field(label="Lugar", v-model="brand.Localization")
                            v-textarea(label="Descripción", v-model="brand.Description")
                            v-btn.mt-5(block, :loading="loading", color="blue", @click="updateBrand(brand)") Actualizar Marca
            v-layout(justify-space-between)
                v-btn(depressed, color="red lighten-3", @click="deleting = !deleting")
                    v-icon(v-if="!deleting") delete 
                    div {{deleting ? 'Cancelar' : 'Eliminar'}}
                v-dialog(width="800")
                    v-btn(slot="activator", depressed, color="green lighten-3") 
                        v-icon add
                        div Nuevo
                    v-card.pa-3
                        v-alert(type="success", :value="brandEdited") Marca nueva
                        v-subheader Nueva marca
                        v-subheader.pl-0 Logo
                        input(type="file", @change="updateFile", multiple)
                        v-layout.my-2
                            img.mr-2(:src="newbrand.Logo", style="height: 200px; width: 150px; border-radius: 20px")
                        v-text-field(label="Título", v-model="newbrand.Title")
                        v-text-field(label="Fundado el", v-model="newbrand.Founded")
                        v-text-field(label="Lugar", v-model="newbrand.Localization")
                        v-textarea(label="Descripción", v-model="newbrand.Description")
                        v-btn.mt-5(block, :loading="loading", color="blue", @click="updateBrand(newbrand)") Crear Marca
                
</template>

<script>
import storage from '../storage'

export default {
    data() {
        return {
            brandEdited: false,
            loading: false,
            deleting: false,
            newbrand: {
                Title: '',
                Logo: '',
                Founded: '',
                Localization: '',
                Description: ''
            }
        }
    },

    mounted() {
        this.$store.dispatch("fetchBrands")
    },

    methods: {
        async updateFile(event) {
            this.file = event.target.files[0]            
            
        },

        async removeBrand(title) {
            this.$store.dispatch("removeBrand", title)
            await this.$store.dispatch('fetchBrands')
        },

        updateBrand: async function(brand) {
            this.loading = true
            const self = this

            let storageRef = storage.ref(brand.Title)
            var snapshot = await storageRef.put(this.file)
            var downloadURL = await snapshot.ref.getDownloadURL()
            console.log("Images subida con exito", downloadURL)
            this.rerender++
            brand.Logo = downloadURL
            this.loadingFiles = false


            await this.$store.dispatch('updateBrand', brand)
            this.loading = false
            this.brandEdited = true
            setTimeout(() => {
                self.brandEdited = false
            }, 2000)
            await this.$store.dispatch('fetchBrands')
        }
    },

    computed: {
        brands() {
            return this.$store.state.brandDescriptionList
        }
    }

}
</script>
