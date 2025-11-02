import { useQuery } from '@tanstack/react-query'
import { getUser } from '../../services/auth';

export const useUserQuery = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: getUser,
        staleTime: 0,
        cacheTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        retry: false
    });
}