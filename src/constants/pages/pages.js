import { UserRole } from "../../types/enums";

export const PUBLIC_ROUTES = ['/login', '/register']

export const MAIN_ROUTES = {
    [UserRole.PRODUCER]: '/product-management',
    [UserRole.CLIENT]: '/catalog'
}

export const ROLE_ACCESS = {
    [UserRole.PRODUCER]: [{ path: '/product-management', label: '' }],
    [UserRole.CLIENT]: [{ path: '/catalog', label: 'Catálogo' }]
}