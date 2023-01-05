<template lang="pug">
    v-content.ma-3
        v-btn(fixed, bottom, right, color="red darken-1", icon, dark, large, @click="deletable = !deletable")
            v-icon(v-if="!deletable") delete
            v-icon(v-else) close
        v-data-table(:headers="headers", :items="clothes", :pagination.sync="pagination").elevation-1
            template(slot="items" slot-scope="props")
                td {{ props.item.id }}
                td {{ props.item.Brand }}
                td {{ (!props.item.id) ? 'No tiene identificador' : (!props.item.Description) ? 'Falta descripción' : (!props.item.Color) ? 'Falta color' : (!props.item.Type) ? 'Falta categoria' : (!props.item.Brand) ? 'Falta marca' : (props.item.Sizes.length == 0) ? 'No hay tallas' : (props.item.Price == 0) ? 'Precio está a 0' : (!props.item.likes) ? 'Faltan likes' : 'Correcto' }}
                td
                    v-btn(flat, icon, @click="edit(props.item)")
                        v-icon edit
                td
                    v-btn(flat, icon, :disabled="!deletable", @click="deleteClothing(props.item.id)")
                        v-icon close
        v-dialog(v-model="dialog", fullscreen, hide-overlay, transition="dialog-bottom-transition")
            v-btn(fixed, bottom, left, icon, large, color="pink", dark, slot="activator")
                v-icon add
            v-card(flat)
                edit-clothing(v-if="clothingSelected.id", :clothing="clothingSelected", @close="dialog = false")
                v-card(v-else, flat)
                    v-alert(type="success", :value="clothingCreated.length") {{ clothingCreated }} creada exitosamente
                    v-alert(type="error", :value="error.length") {{ error }}
                    v-layout(align-center)
                        v-btn(flat, icon, @click="dialog = false")
                            v-icon close
                        v-subheader Crear prenda
                        div {{id}}
                        v-spacer
                        v-btn(color="red", dark, @click="clearData") Borrar campos
                    v-layout.pa-5
                        v-flex.pr-3(xs6)
                            v-text-field(label="Titulo", v-model="newClothing.Title")
                            v-autocomplete.mb-3(:items="brands", :search-input.sync="searchBrand", v-model="newClothing.Brand", cache-items, hide-no-data, hide-details, label="Marca")
                            v-subheader.pl-0 Imagenes
                            input(type="file", @change="updateFile", multiple)
                            v-layout.my-2(:key="rerender")
                                img.mr-2(v-for="(img, i) in newClothing.Images", :key="i", :src="img", style="height: 200px; width: 150px; border-radius: 20px, object-fit: cover")
                                v-progress-circular(v-if="loadingFiles", indeterminate, style="margin-top: 80px; margin-left: 70px")
                            v-textarea(label="Descripción", v-model="newClothing.Description")
                        v-flex.pl-3(xs6)
                            v-subheader Tallas
                            v-layout(wrap)
                                v-btn(outline, :color="(newClothing.Sizes.includes(6) ? 'blue' : 'black')", @click="select(6)") XXS
                                v-btn(outline, :color="(newClothing.Sizes.includes(0) ? 'blue' : 'black')", @click="select(0)") XS
                                v-btn(outline, :color="(newClothing.Sizes.includes(1) ? 'blue' : 'black')", @click="select(1)") S
                                v-btn(outline, :color="(newClothing.Sizes.includes(2) ? 'blue' : 'black')", @click="select(2)") M
                                v-btn(outline, :color="(newClothing.Sizes.includes(3) ? 'blue' : 'black')", @click="select(3)") L
                                v-btn(outline, :color="(newClothing.Sizes.includes(4) ? 'blue' : 'black')", @click="select(4)") XL
                                v-btn(outline, :color="(newClothing.Sizes.includes(5) ? 'blue' : 'black')", @click="select(5)") XXL
                            v-subheader Stories
                            v-layout(wrap)
                                v-btn(outline, :color="(newClothing.Looks.includes('Casual') ? 'blue' : 'black')", @click="selectLook('Casual')") Casual
                                v-btn(outline, :color="(newClothing.Looks.includes('Emergente') ? 'blue' : 'black')", @click="selectLook('Emergente')") Emergente
                                v-btn(outline, :color="(newClothing.Looks.includes('Sostenible') ? 'blue' : 'black')", @click="selectLook('Sostenible')") Sostenible
                                v-btn(outline, :color="(newClothing.Looks.includes('Party Time') ? 'blue' : 'black')", @click="selectLook('Party Time')") Party Time
                                v-btn(outline, :color="(newClothing.Looks.includes('Experimenta') ? 'blue' : 'black')", @click="selectLook('Experimenta')") Experimenta
                                
                            v-subheader Color   
                            v-layout.mx-2.mr-3.px-1.mt-2.pb-2(wrap)
                                v-avatar.pointer.mr-2.mb-2(color="yellow lighten-3", size="24", @click="selectColor('Amarillo')")
                                    v-icon(v-if="color == 'Amarillo'") check
                                v-avatar.pointer.mr-2.mb-2(color="blue lighten-3", size="24", @click="selectColor('Azul')")
                                    v-icon(v-if="color == 'Azul'") check
                                v-avatar.pointer.mr-2.mb-2(color="blue", size="24", @click="selectColor('Azul Oscuro')")
                                    v-icon(v-if="color == 'Azul Oscuro'") check
                                v-avatar.pointer.mr-2.mb-2(color="white", size="24", @click="selectColor('Blanco')")
                                    div(style="border: 1px solid #272727; height: 100%; width: 100%; border-radius: 50%")
                                        v-icon(v-if="color == 'Blanco'") check
                                v-avatar.pointer.mr-2.mb-2(color="red lighten-3", size="24", @click="selectColor('Carne')")
                                    v-icon(v-if="color == 'Carne'") check
                                v-avatar.pointer.mr-2.mb-2(color="grey lighten-3", size="24", @click="selectColor('Gris')")
                                    v-icon(v-if="color == 'Gris'") check
                                v-avatar.pointer.mr-2.mb-2(color="orange lighten-3", size="24", @click="selectColor('Naranja')")
                                    v-icon(v-if="color == 'Naranja'") check
                                v-avatar.pointer.mr-2.mb-2(color="black lighten-3", size="24", @click="selectColor('Negro')")
                                    v-icon.white--text(v-if="color == 'Negro'") check
                                v-avatar.pointer.mr-2.mb-2(color="red lighten-2", size="24", @click="selectColor('Rojo')")
                                    v-icon(v-if="color == 'Rojo'") check
                                v-avatar.pointer.mr-2.mb-2(color="blue-grey lighten-3", size="24", @click="selectColor('Vaquero')")
                                    v-icon(v-if="color == 'Vaquero'") check
                                v-avatar.pointer.mr-2.mb-2(color="pink lighten-3", size="24", @click="selectColor('Rosa')")
                                    v-icon(v-if="color == 'Rosa'") check
                                v-avatar.pointer.mr-2.mb-2(color="green lighten-3", size="24", @click="selectColor('Verde')")
                                    v-icon(v-if="color == 'Verde'") check
                            v-autocomplete.mb-3(:items="types", :search-input.sync="searchType", v-model="newClothing.Type", cache-items, hide-no-data, hide-details, label="Tipo de prenda")
                            v-text-field(label="Precio de venta", type="number", v-model="newClothing.Price")
                    v-btn(block, color="blue", :loading="uploading", :disabled="disabled", @click="create") Crear

                    
                    
        
</template>

<script>
import storage from '../storage'
import editClothing from './editclothing.vue'

export default {
    data() {
        return {
            dialog: false,
            deletable: false,
            color: '',
            pagination: {rowsPerPage: 25},
            clothingSelected: {},
            rerender: 1,
            headers: [
                {
                    text: 'Identificador',
                    value: 'id'
                },
                {
                    text: 'Marca',
                    value: 'Brand'
                },
                {
                    text: 'Error',
                },
                {
                    text: 'Editar',
                    sortable: false
                },
                {
                    text: 'Borrar',
                    sortable: false
                },
            ],
            newClothing: {
                id: '',
                Title: '',
                Description: '',
                Color: '',
                Price: 0,
                Looks: [],
                Type: '',
                Images: [],
                Brand: '',
                Sizes: []
            },
            loadingFiles: false,
            uploading: false,
            clothingCreated: false,
            file: '',
            files: [],
            searchBrand: '',
            searchType: null,
            error: '',
            types: ['Blazers', 'Chaquetas y abrigos', 'Vestidos', 'Monos', 'Camisas | Blusas', 'Tops', 'Camisetas', 'Pantalones', 'Faldas', 'Sudaderas', 'Pantalones', 'Faldas', 'Sudaderas', 'Bolsos'],
            brands: []
        }
    },

    async mounted() {
        this.$store.dispatch("fetchClothes")
        await this.$store.dispatch("fetchBrands")
        this.brands = this.$store.state.brandDescriptionList.map(x => x.Title)
    },

    watch: {
        dialog(val) {
            if (!val) {
                this.clothingSelected = {}
            }
        },

        searchType(val) {
            val && val !== this.types
        },

        searchBrands(val) {
            val && val !== this.brands
        },
    },

    components: {
        editClothing
    },

    computed: {

        id() {
            const id = this.newClothing.Title.toLowerCase().replace(/ /g, "-") + '-' + this.newClothing.Brand.toLowerCase().replace(" ", "-")
            return this.normalize(id)
        },

        disabled() {
            return !this.newClothing.Title || !this.color || !this.newClothing.Type || !this.newClothing.Description || !this.newClothing.Brand || !this.newClothing.Price || !this.newClothing.Images.length
        },

        clothes() {
            var clothes = this.$store.state.clothes 

            return clothes
        }
    },

    methods: {

        edit(clothing) {
            this.clothingSelected = clothing
            this.dialog = true 
        },

        selectColor(c) {
            this.color = c
        },
        
        selectLook(value) {
            var index = this.newClothing.Looks.findIndex(x => {
                return x == value
            })

            if (index == -1) {
                this.newClothing.Looks.push(value)
            } else {
                this.newClothing.Looks.splice(index, 1)
            }
        },

        clearData() {
            this.newClothing = {
                id: '',
                Title: '',
                Description: '',
                Brand: '',
                Sizes: []
            }

            this.file = ''
            this.files = []
        },

        normalize(str) {
            var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", 
                to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
                mapping = {};
            
            for(var i = 0, j = from.length; i < j; i++ )
                mapping[ from.charAt( i ) ] = to.charAt( i );
            
            var ret = [];
            for( var i = 0, j = str.length; i < j; i++ ) {
                var c = str.charAt( i );
                if( mapping.hasOwnProperty( str.charAt( i ) ) )
                    ret.push( mapping[ c ] );
                else
                    ret.push( c );
            }      
            return ret.join( '' );
            
            },

        select(value) {
            var index = this.newClothing.Sizes.findIndex(x => {
                return x == value
            })

            if (index == -1) {
                this.newClothing.Sizes.push(value)
            } else {
                this.newClothing.Sizes.splice(index, 1)
            }
        },

        async updateFile(event) {
            this.file = event.target.files[0]
            this.files = event.target.files

            var images = this.files
            this.newClothing.Images = []


            const self = this
            this.loadingFiles = true
            for (const img of Object.entries(images)) {
                console.log(this.id + '/' + img[0] + this.makeid(6))
                let storageRef = storage.ref(this.id + '/' + img[0] + this.makeid(6))
                var snapshot = await storageRef.put(img[1])
                var downloadURL = await snapshot.ref.getDownloadURL()

                self.newClothing.Images.push(downloadURL)
                console.log("Images subida con exito", downloadURL)
                self.rerender++
            }
            this.loadingFiles = false
            
        },

        makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },

        deleteClothing(id) {
            this.$store.dispatch('deleteClothing', id)
        },

        async create() {

            
            this.uploading = true
            var self = this
            this.newClothing.id = this.id
            this.newClothing.Color = this.color
            this.newClothing.likes = 0
            this.newClothing.Value = Number(this.newClothing.Value)
            this.newClothing.Price = Number(this.newClothing.Price)

            if (!this.check()) return


            await self.$store.dispatch("addClothing", this.newClothing)
            this.uploading = false
            this.clothingCreated = this.newClothing.id

            setTimeout(() => {this.clothingCreated = ''}, 50000)

            console.log(this.newClothing)
            this.newClothing.Title = ""
            this.newClothing.Images = []

        },

        check() {
            if (!this.newClothing.Title) {
                this.error = 'Falta el identificado'
                const self = this
                setTimeout(() => {
                    self.error = ''
                }, 10000)
                this.uploading = false
                return false
            }
            else if (!this.newClothing.Color) {
                this.error = 'Falta el Color'
                const self = this
                setTimeout(() => {
                    self.error = ''
                }, 10000)
                this.uploading = false
                return false
            }
            else if (!this.newClothing.Description) {
                this.error = 'Falta la descripción'
                const self = this
                setTimeout(() => {
                    self.error = ''
                }, 10000)
                this.uploading = false
                return false
            }
            else if (!this.newClothing.Brand) {
                this.error = 'Falta la marca'
                const self = this
                setTimeout(() => {
                    self.error = ''
                }, 10000)
                this.uploading = false
                return false
            }
            else if (!this.newClothing.Price) {
                this.error = 'Falta el precio'
                const self = this
                setTimeout(() => {
                    self.error = ''
                }, 10000)
                this.uploading = false
                return false
            }
            else return true

        }
    }
}
</script>

