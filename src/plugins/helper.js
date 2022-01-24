"use strict"

import Vue from 'vue'
import moment from 'moment'

const Helper = {
    install(Vue) {
        Vue.prototype.appName = process.env.VUE_APP_NAME

        Vue.prototype.getImage = function (image) {
            if (image != "null" && image != undefined && image.length > 0) {
                return process.env.VUE_APP_BACKEND_URL + "/storage/" + image
            }
            // return "/img/unavailable.png"
        }

        Vue.prototype.moment = moment
    }
}

Vue.use(Helper)