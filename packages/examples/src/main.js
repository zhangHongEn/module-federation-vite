import { createApp, getCurrentInstance} from 'vue'
import {createRouter, createWebHistory} from "vue-router"
import './style.css'
import App from './App.vue'
// import App1 from "remote/App"
import R from "react"
import ap from "remote2/App"
import ap3 from "remote2/App1"
import ap1 from "remote3"

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
console.log("remote1",ap , "remote2", ap1, ap === ap1)
// console.log(111111, App1, React)

createApp(App).use(rou).mount('#app')