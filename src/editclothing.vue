<template lang="pug">
    v-card(flat)
        v-layout(align-center)
            v-alert(type="success", :value="clothingCreated.length") {{ clothingCreated }} editada exitosamente
            v-btn(flat, icon, @click="close")
                v-icon close
            v-subheader Editar prenda
            div {{id}}
            v-spacer
            v-btn(color="red", dark, @click="clearData") Borrar campos
        v-layout.pa-5
            v-flex.mr-3(xs6)
                v-text-field(label="Titulo", v-model="clothing.Title", disabled)
                v-autocomplete.mb-3(:items="brands", :search-input.sync="searchBrand", disabled, v-model="clothing.Brand", cache-items, hide-no-data, hide-details, label="Marca")
                v-subheader.pl-0 Imagenes
                input(type="file", @change="updateFile", multiple)
                v-layout.my-2
                    img.mr-2(v-for="(img, i) in clothing.Images", :key="i", :src="img", style="height: 200px; width: 150px; border-radius: 20px")
                v-textarea(label="Descripción", v-model="clothing.Description")
            v-flex.ml-3(xs6)
                v-subheader Tallas
                v-layout(wrap)
                    v-btn(outline, :color="(clothing.Sizes.includes(6) ? 'blue' : 'black')", @click="select(6)") XXS
                    v-btn(outline, :color="(clothing.Sizes.includes(0) ? 'blue' : 'black')", @click="select(0)") XS
                    v-btn(outline, :color="(clothing.Sizes.includes(1) ? 'blue' : 'black')", @click="select(1)") S
                    v-btn(outline, :color="(clothing.Sizes.includes(2) ? 'blue' : 'black')", @click="select(2)") M
                    v-btn(outline, :color="(clothing.Sizes.includes(3) ? 'blue' : 'black')", @click="select(3)") L
                    v-btn(outline, :color="(clothing.Sizes.includes(4) ? 'blue' : 'black')", @click="select(4)") XL
                    v-btn(outline, :color="(clothing.Sizes.includes(5) ? 'blue' : 'black')", @click="select(5)") XXL
                v-subheader Stories
                v-layout(wrap)
                    v-btn(outline, :color="(clothing.Looks.includes('Casual') ? 'blue' : 'black')", @click="selectLook('Casual')") Casual
                    v-btn(outline, :color="(clothing.Looks.includes('Emergente') ? 'blue' : 'black')", @click="selectLook('Emergente')") Emergente
                    v-btn(outline, :color="(clothing.Looks.includes('Sostenible') ? 'blue' : 'black')", @click="selectLook('Sostenible')") Sostenible
                    v-btn(outline, :color="(clothing.Looks.includes('Party Time') ? 'blue' : 'black')", @click="selectLook('Party Time')") Party Time
                    v-btn(outline, :color="(clothing.Looks.includes('Experimenta') ? 'blue' : 'black')", @click="selectLook('Experimenta')") Experimenta
                    
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
                v-autocomplete.mb-3(:items="types", :search-input.sync="searchType", v-model="clothing.Type", cache-items, hide-no-data, hide-details, label="Tipo de prenda")
                v-text-field(label="Precio de venta", type="number", v-model="clothing.Price")
        v-btn(block, color="blue", :loading="uploading", @click="update") Actualizar
</template>


<script>
import storage from '../storage'

export default {
    data() {
        return {
            uploading: false,
            clothingCreated: false,
            file: '',
            files: [],
            searchBrand: '',
            color: 'Rojo',
            searchType: null,
            types: ['Blazers', 'Chaquetas y abrigos', 'Vestidos', 'Monos', 'Camisas | Blusas', 'Tops', 'Camisetas', 'Pantalones', 'Faldas', 'Sudaderas', 'Pantalones', 'Faldas', 'Sudaderas', 'Bolsos'],
            brands: this.$store.state.brandDescriptionList,
            price: 0,
            care_indications: "",
            looks: ['Casual', 'Emergente', 'Sostenible', 'Party Time', 'Experimenta']
        }
    },

    computed: {
        id() {
            const id = this.clothing.Title.toLowerCase().replace(/ /g, "-") + '-' + this.clothing.Brand.toLowerCase().replace(" ", "-")
            return this.normalize(id)
        },
    },

    methods: {
        close() {
            this.$emit('close')
        },
        selectColor(c) {
            this.color = c
        },
        clearData() {
            this.clothing = {
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
            var index = this.clothing.Sizes.findIndex(x => {
                return x == value
            })

            if (index == -1) {
                this.clothing.Sizes.push(value)
            } else {
                this.clothing.Sizes.splice(index, 1)
            }
        },

        selectLook(value) {
            var index = this.clothing.Looks.findIndex(x => {
                return x == value
            })

            if (index == -1) {
                this.clothing.Looks.push(value)
            } else {
                this.clothing.Looks.splice(index, 1)
            }
        },

        async updateFile(event) {
            this.file = event.target.files[0]
            this.files = event.target.files
            console.log(this.files)
            const self = this
            this.clothing.Images = []

            var images = this.files

            for (const img of Object.entries(images)) {
                console.log(img[1])
                let storageRef = storage.ref(this.id + '/' + img[0] + this.makeid(5))
                var snapshot = await storageRef.put(img[1])
                var downloadURL = await snapshot.ref.getDownloadURL()

                self.clothing.Images.push(downloadURL)
                console.log("Images subida con exito", downloadURL)

            }
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

        async update() {
            
            this.uploading = true
            var self = this
            this.clothing.id = this.id
            this.clothing.Color = this.color
            this.clothing.Value = Number(this.clothing.Value)
            this.clothing.Price = Number(this.clothing.Price)


            await self.$store.dispatch("addClothing", this.clothing)
            this.uploading = false
            this.clothingCreated = true

            setTimeout(() => {this.clothingCreated = ''}, 50000)

            console.log(this.clothing)


        }
    },

    props: ["clothing"],
}
</script>

<style lang="scss" scoped>
    .pointer {
        cursor: pointer;
    }
</style>

