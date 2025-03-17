import TodaysProceedings from 'pages/TodaysProceedings.vue'
import StartProceedings from 'pages/StartProceedings.vue'
import CaseManagement from 'pages/CaseManagement.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'proceedings', component: TodaysProceedings }, // List of proceedings
      { path: 'startproceedings', component: StartProceedings },
      { path: 'casemanagement', component: CaseManagement },
    ],
  },

  // Catch-all route for unknown paths
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
