import db from '../db'
import axios from 'axios'
import slugify from 'slugify'

export default {
    state: {
        services: [],
        brands: ['EMES', 'Beyonas', 'Thinking Mu', 'Ecoalf', 'Tiralahilacha', 'Maria Escote', 'Rita Row', 'Coosy', 'Hupit', 'Laagam', 'María Malo', 'Tulle Rouge', 'Bimani 13', 'Marine Layer', 'Ladypipa', 'Eseoese', 'Sophie&Lucie', 'SKFK', 'Cus', 'Moises Nieto', 'Diarte'],
        brandDescriptionList: [],
        users: [],
        searchFilter: '',
        allCount: 0,
        tramitCount: 0,
        errorCount: 0,
        sendedCount: 0,
        receivedCount: 0,
        conflictCount: 0,
        finishedCount: 0,
        logs: [],
        clothes: [],
        appInfo: {}
    },
    mutations: {
        setServices (state, data) {
            state.services = data
        },

        setLogs (state, data) {
            state.logs = data
        },

        setBrands (state, data) {
            state.brandDescriptionList = data
        },

        setAppInfo (state, data) {
            state.appInfo = data
        },

        setUsers (state, data) {
            state.users = data
        },

        setClothes (state, data) {
            state.clothes = data
        }


    },

    actions: {

        charge(context, data) {
            axios.get(`https://mouo-backend.herokuapp.com/charge?email=${data.email}&amount=${data.amount}`)
        },

        addLog (context, data) {
            const userRef = db.collection('users').doc(data.email)
            db.runTransaction((t) => {
                return t.get(userRef).then((doc) => {
                    // doc doesn't exist; can't update
                    if (!doc.exists) return;
                    // update the users array after getting it from Firestore.
                    var array = doc.get('logs');
                    array.push({
                        text: data.text,
                        date: data.date
                    })

                    t.set(userRef, {
                        logs: array
                    }, {
                            merge: true
                        });
                });
            })
        },

        addLink(context, data) {
            console.log(data)
            let content = data.utm_content.length != 0 ? `&utm_content=${slugify(data.utm_content, {lower: true})}` : ''
            db.collection("links").doc(`${data.event}.${data.campaign}`).set({
                event: data.event,
                campaign: data.campaign,
                link: `https://pantala.es?${data.event}=${slugify(data.campaign, {lower: true})}&utm_source=${slugify(data.utm_source, {lower: true})}&utm_medium=${slugify(data.utm_medium, {lower: true})}&utm_campaign=${slugify(data.campaign, {lower: true})}${content}`,
                createdAt: Math.floor(Date.now() / 1000)
            })
        },

        async getLinks(context) {
            let data = await db.collection("links").get()
            return data.docs
        },

        removeLink(context, link) {
            db.collection("links").doc(link).delete()
        },

        deleteClothing(context, id) {
            return db.collection('clothes').doc(id).delete()
        },

        async getRegister(context) {
            let data = await db.collection('waiting').get()
            return data.docs
        },

        async getRegisterInstagram(context) {
            let data = await db.collection('waitinginstagram').get()
            return data.docs
        },

        fetchUsers(context) {
            return db.collection('users').get().then((docs) => {
                var data = docs.docs
                var users = []
                
                data.forEach(doc => {
                    users.push(doc.data())
                })
                
                context.commit('setUsers', users)
                return users
            })
        },

        fetchClothes(context) {
            return db.collection('clothes').onSnapshot(docs => {
                var clothes = []

                docs.forEach(doc => {
                    clothes.push(doc.data())
                })

                context.commit('setClothes', clothes)

                return clothes
            })

        },

        async fetchBrands(context) {
            let docs = await db.collection('brands').get()
            
            let brands = []

            docs.forEach(doc => {
                brands.push(doc.data())
            })

            console.log(brands)

            context.commit('setBrands', brands)

            return brands
            

        },

        addClothing(context, clothing) {
            return db.collection('clothes').doc(clothing.id).set(clothing, {merge: true})
        },

        updateBrand(context, brand) {
            return db.collection('brands').doc(brand.Title).set(brand, {merge: true})
        },

        switchActive(context) {
            db.collection('statistics').doc('appInfo').set({
                serviceActive: !context.state.appInfo.serviceActive
            }, {merge: true})
        },

        fetchLogs (context, email) {
            db.collection('users').doc(email).get().then((doc) => {
                context.commit('setLogs', doc.data().logs)
            })
        },

        fetchAppInfo(context) {
            db.collection('statistics').doc('appInfo').get().then(doc => {
                context.commit('setAppInfo', doc.data())
            })
        },

        fetchServices (context) {
            db.collection('services').orderBy("createdAt", "desc").onSnapshot(snapshot => {
                var services = []

                context.state.allCount = 0
                context.state.tramitCount = 0
                context.state.errorCount = 0
                context.state.sendedCount = 0
                context.state.receivedCount = 0
                context.state.conflictCount = 0
                context.state.finishedCount = 0

                snapshot.docs.forEach(service => {

                    switch(service.data().state) {
                        case 'tramit':
                            context.state.tramitCount += 1
                            break;
                        case 'paymentError':
                            context.state.errorCount += 1
                            break;
                        case 'sended':
                            context.state.sendedCount += 1
                            break;
                        case 'received':
                            context.state.receivedCount += 1
                            break;
                        case 'conflict':
                            context.state.conflictCount += 1
                            break;
                        case 'finished':
                            context.state.finishedCount += 1
                            break;
                    }


                    services.push(service.data())
                })

                context.commit('setServices', services)
            })
        },

        removeBrand: (context, title) => {
            db.collection("brands").doc(title).delete()
        },

        updateState: (context, data) => {
            if (data.state == 'received' || data.state == 'finished') {
                db.collection('users').doc(data.email).set({
                    actualList: data.nextList,
                    bought: []
                }, { merge: true })
                // const userRef = db.collection('users').doc(data.email)

                // var list = []

                // data.changeList.forEach(clothing => {
                //     if (clothing.State == 'added') {
                //         list.push(clothing)
                //     }
                // })

                // userRef.set({
                //     actualList: list
                // }, {merge: true})

                // db.runTransaction((t) => {
                //     return t.get(userRef).then((doc) => {
                //         // doc doesn't exist; can't update
                //         if (!doc.exists) return;
                //         // update the users array after getting it from Firestore.
                //         var array = doc.get('nextList');

                //         t.set(userRef, {
                //             actualList: array,
                //             bought: []
                //         }, {
                //                 merge: true
                //             });
                //     });
                // })
            }

            db.collection('services').doc(data.id).set({
                state: data.state
            }, {merge: true})
        }
    }
}