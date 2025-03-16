const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'my-proceedings',
        name: 'proceedings',
        component: () => import('pages/ProceedingsPage.vue'),
      },
      {
        path: 'my-proceedings/details',
        name: 'proceeding-details',
        component: () => import('pages/ProceedingDetailsPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
