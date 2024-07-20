import { createApp, getCurrentInstance} from 'vue'
import {createRouter, createWebHistory} from "vue-router"
import './style.css'
import App from './App.vue'
// import App1 from "remote/App"
import R from "react"
import remote1App from "remote1/App"
import remote2 from "remote2/App"

const rou = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./components/HelloWorld.vue")
    },
  ]
})

console.log("share vue", createApp)
console.log("share React", R)
console.log("remote1App", remote1App)
console.log("remote2", remote2)
// console.log(111111, App1, React)

createApp(App).use(rou).mount('#app')