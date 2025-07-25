import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/AxiosInstance";

export type Instructor = {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
};

export function useInstructors() {
  return useQuery<Instructor[], Error>({
    queryKey: ["instructors"],
    queryFn: async () => {
      const res = await axiosInstance.get("/instructors");
      return res.data.data || [];
    },
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}
