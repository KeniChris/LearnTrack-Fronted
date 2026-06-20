{
    path: 'admin',
        loadComponent: () => import('./features/admin/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent)
}