import { useQuery } from "@tanstack/react-query";
import { getUser, getUserById } from "../../services/auth";

export const useUserQuery = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getUser,
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useUserByIdQuery = (userId) => {
  return useQuery({
    queryKey: ["userById", userId],
    queryFn: () => getUserById(userId),
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
