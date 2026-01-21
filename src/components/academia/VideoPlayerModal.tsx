import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  category: string;
  duration: string | null;
}

interface VideoPlayerModalProps {
  video: Video | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VideoPlayerModal({ video, open, onOpenChange }: VideoPlayerModalProps) {
  if (!video) return null;

  // Extract YouTube video ID if it's a YouTube URL
  const getEmbedUrl = (url: string) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    }
    
    // Check for Vimeo
    const vimeoRegex = /vimeo\.com\/(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    
    // Return original URL for direct video files
    return url;
  };

  const embedUrl = getEmbedUrl(video.video_url);
  const isDirectVideo = !embedUrl.includes('youtube.com') && !embedUrl.includes('vimeo.com');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">{video.title}</DialogTitle>
          {video.description && (
            <p className="text-sm text-muted-foreground mt-2">{video.description}</p>
          )}
        </DialogHeader>
        
        <div className="aspect-video w-full bg-black">
          {isDirectVideo ? (
            <video
              src={video.video_url}
              controls
              autoPlay
              className="w-full h-full"
            >
              Seu navegador não suporta vídeos HTML5.
            </video>
          ) : (
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
