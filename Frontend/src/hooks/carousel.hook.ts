import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllCarouselImages,
  createCarouselImage,
  deleteCarouselImage,
} from "@/utils/carousel";
import { TCarouselImage } from "@/types";

export function useCarouselImages() {
  return useQuery<TCarouselImage[], Error>({
    queryKey: ["carousel-images"],
    queryFn: getAllCarouselImages,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCarouselImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCarouselImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel-images"] });
    },
  });
}

export function useDeleteCarouselImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCarouselImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousel-images"] });
    },
  });
}