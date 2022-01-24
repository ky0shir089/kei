import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import index from '../store/index'
import goTo from 'vuetify/lib/services/goto'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import(/* webpackChunkName: "checkout" */ '../views/Checkout.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/auth/:provider/callback',
    component: {
      template: '<div class="auth-component"></div>'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/verification',
    name: 'verification',
    component: () => import(/* webpackChunkName: "verification" */ '../views/Verification.vue')
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import(/* webpackChunkName: "forgot-password" */ '../views/ForgotPassword.vue')
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import(/* webpackChunkName: "reset-password" */ '../views/ResetPassword.vue')
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: () => import(/* webpackChunkName: "change-password" */ '../views/ChangePassword.vue'),
    meta: {
      Auth: true
    }
  },
  {
    path: '/workshop/sesi/:id',
    name: 'workshop',
    component: () => import(/* webpackChunkName: "workshop" */ '../views/Rincian.vue'),
  },
  {
    path: '/workshop/paket/:id',
    name: 'workshop-paket',
    component: () => import(/* webpackChunkName: "workshop-paket" */ '../views/RincianPaket.vue'),
  },
  {
    path: '/banner/:id',
    name: 'banner-detail',
    component: () => import(/* webpackChunkName: "banner-detail" */ '../views/BannerDetail.vue'),
  },
  {
    path: '/peserta/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '../views/peserta/Profile.vue'),
    meta: {
      Auth: true
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
    meta: {
      Auth: true
    },
    children: [
      {
        path: '/dashboard',
        name: 'chart',
        component: () => import(/* webpackChunkName: "chart" */ '../views/Chart.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-aplikasi/module',
        name: 'module',
        component: () => import(/* webpackChunkName: "module" */ '../views/setup_aplikasi/Module.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-aplikasi/role',
        name: 'role',
        component: () => import(/* webpackChunkName: "role" */ '../views/setup_aplikasi/Role.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/webinar-category',
        name: 'webinar-category',
        component: () => import(/* webpackChunkName: "webinar-category" */ '../views/setup_webinar/WebinarCategory.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/webinar-level',
        name: 'webinar-level',
        component: () => import(/* webpackChunkName: "webinar-level" */ '../views/setup_webinar/WebinarLevel.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/information',
        name: 'information',
        component: () => import(/* webpackChunkName: "information" */ '../views/setup_webinar/Information.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/job',
        name: 'job',
        component: () => import(/* webpackChunkName: "job" */ '../views/setup_webinar/Job.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/position',
        name: 'position',
        component: () => import(/* webpackChunkName: "position" */ '../views/setup_webinar/Position.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/hobby',
        name: 'hobby',
        component: () => import(/* webpackChunkName: "hobby" */ '../views/setup_webinar/Hobby.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/reason',
        name: 'reason',
        component: () => import(/* webpackChunkName: "reason" */ '../views/setup_webinar/Reason.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/paket/add-package',
        name: 'add-package',
        component: () => import(/* webpackChunkName: "add-package" */ '../views/paket/AddPackage.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/paket/package-list',
        name: 'package-list',
        component: () => import(/* webpackChunkName: "package-list" */ '../views/paket/PackageList.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/kelas/add-webinar',
        name: 'add-webinar',
        component: () => import(/* webpackChunkName: "add-webinar" */ '../views/kelas/WebinarClass.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/kelas/webinar-list',
        name: 'webinar-list',
        component: () => import(/* webpackChunkName: "webinar-list" */ '../views/kelas/WebinarList.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/kelas/webinar-detail/:id',
        name: 'webinar-detail',
        component: () => import(/* webpackChunkName: "webinar-detail" */ '../views/kelas/WebinarDetail.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/mentor',
        name: 'mentor',
        component: () => import(/* webpackChunkName: "mentor" */ '../views/setup_webinar/Mentor.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/peserta/pendaftaran',
        name: 'pendaftaran',
        component: () => import(/* webpackChunkName: "pendaftaran" */ '../views/peserta/Pendaftaran.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/peserta/inbox',
        name: 'inbox',
        component: () => import(/* webpackChunkName: "inbox" */ '../views/peserta/Inbox.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/peserta/invoice/:id',
        name: 'invoice',
        component: () => import(/* webpackChunkName: "invoice" */ '../views/peserta/Invoice.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/list-peserta',
        name: 'list-peserta',
        component: () => import(/* webpackChunkName: "list-peserta" */ '../views/setup_webinar/ListPeserta.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/question',
        name: 'question',
        component: () => import(/* webpackChunkName: "question" */ '../views/setup_webinar/Question.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/question-list',
        name: 'question-list',
        component: () => import(/* webpackChunkName: "question-list" */ '../views/setup_webinar/QuestionList.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/add-post-test',
        name: 'add-post-test',
        component: () => import(/* webpackChunkName: "add-post-test" */ '../views/setup_webinar/AddPretest.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/peserta/my-learning',
        name: 'my-learning',
        component: () => import(/* webpackChunkName: "my-learning" */ '../views/peserta/MyLearning.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/peserta/settings',
        name: 'settings',
        component: () => import(/* webpackChunkName: "settings" */ '../views/peserta/Settings.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/list-post-test',
        name: 'list-post-test',
        component: () => import(/* webpackChunkName: "list-post-test" */ '../views/setup_webinar/ListPretest.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/peserta/post-test',
        name: 'post-test',
        component: () => import(/* webpackChunkName: "post-test" */ '../views/peserta/Pretest.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/peserta/post-test-score',
        name: 'post-test-score',
        component: () => import(/* webpackChunkName: "post-test-score" */ '../views/peserta/Score.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/setup-webinar/banner',
        name: 'banner',
        component: () => import(/* webpackChunkName: "banner" */ '../views/setup_webinar/Banner.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/report/webinar',
        name: 'report',
        component: () => import(/* webpackChunkName: "report" */ '../views/report/Report.vue'),
        meta: {
          Auth: true
        }
      },
      {
        path: '/peserta/result',
        name: 'result',
        component: () => import(/* webpackChunkName: "result" */ '../views/peserta/Result.vue'),
        meta: {
          Auth: true
        }
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo)
  },
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.Auth)) {
    if (index.getters['auth/guest']) {
      index.dispatch('setPrevUrl', to.path)

      index.dispatch('alert/set', {
        status: true,
        text: 'Silahkan login terlebih dahulu',
        color: 'error',
      })

      router.push("/login")
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
