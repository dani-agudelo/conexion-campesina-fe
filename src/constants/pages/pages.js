import { UserRole } from "../../types/enums";

export const PUBLIC_ROUTES = ['/login', '/register']

export const MAIN_ROUTES = {
    [UserRole.PRODUCER]: '/product-management',
    [UserRole.CLIENT]: '/catalog',
    [UserRole.ADMIN]: '/users'
}

export const SIDEBAR_LINKS = {
    [UserRole.PRODUCER]: [
        { id: 'products', label: 'Mis Productos', path: '/product-management/products' },
        { id: 'orders', label: 'Mis pedidos', path: '/product-management/orders' },
        // { id: 'inventory', label: 'Mi Inventario', path: '/product-management/inventory' },

    ],
    [UserRole.CLIENT]: [
        { id: 'catalog', label: 'Catálogo', path: '/catalog' },
        { id: 'orders', label: 'Mis pedidos', path: '/client-orders' },
    ],
};