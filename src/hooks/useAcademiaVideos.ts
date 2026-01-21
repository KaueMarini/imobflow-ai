import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AcademiaVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  category: string;
  duration: string | null;
  thumbnail_url: string | null;
  is_active: boolean;
  order_index: number | null;
  created_at: string;
}

export function useAcademiaVideos() {
  return useQuery({
    queryKey: ["academia-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academia_videos")
        .select("*")
        .eq("is_active", true)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data as AcademiaVideo[];
    },
  });
}
