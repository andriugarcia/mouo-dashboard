import VueRouter from 'vue-router'
// 0. If using a module system (e.g. via vue-cli), import Vue and VueRouter
// and then call `Vue.use(VueRouter)`.

// 1. Define route components.
// These can be imported from other files
import index from '../src/Index.vue'
import users from '../src/Users.vue'
import closet from '../src/Closet.vue'
import brands from '../src/Brands.vue'
import analytics from '../src/Analytics.vue'

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
    {
        name: 'index',
        path: '/',
        component: index
    },
    {
        name: 'users',
        path: '/users',
        component: users
    },
    {
        name: 'brands',
        path: '/brands',
        component: brands
    },
    {
        name: 'closet',
        path: '/closet',
        component: closet
    },
    {
        name: 'analytics',
        path: '/analytics',
        component: analytics
    }
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
    routes // short for `routes: routes`
})

// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
export default router;

// Now the app has started!