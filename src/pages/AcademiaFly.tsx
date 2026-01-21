import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Search, Clock, GraduationCap, Megaphone, Users, Building2, MessageSquare } from "lucide-react";
import { VideoPlayerModal } from "@/components/academia/VideoPlayerModal";
import { VideoAdminPanel } from "@/components/academia/VideoAdminPanel";
import { useAcademiaVideos, AcademiaVideo } from "@/hooks/useAcademiaVideos";

const categories = [
  { id: "all", label: "Todos", icon: GraduationCap },
  { id: "patrocinado", label: "Tráfego Pago", icon: Megaphone },
  { id: "captacao", label: "Captação", icon: Building2 },
  { id: "atendimento", label: "Atendimento", icon: MessageSquare },
  { id: "fechamento", label: "Fechamento", icon: Users },
];

export default function AcademiaFly() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedVideo, setSelectedVideo] = useState<AcademiaVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: videos = [], isLoading } = useAcademiaVideos();

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.label || categoryId;
  };

  const handleVideoClick = (video: AcademiaVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        title="Academia Fly"
        subtitle="Aprenda a vender mais com nossos conteúdos exclusivos"
      />

      <div className="p-6 space-y-6">
        {/* Admin Panel - only visible for admins */}
        <VideoAdminPanel />

        {/* Header com busca */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Biblioteca de Vídeos</h2>
              <p className="text-sm text-muted-foreground">{videos.length} vídeos disponíveis</p>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtros por categoria */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Grid de vídeos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-video bg-muted" />
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                  <div className="h-5 bg-muted rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card 
                key={video.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden"
                onClick={() => handleVideoClick(video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <GraduationCap className="h-12 w-12 text-primary/30" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                      <Play className="h-8 w-8 text-primary-foreground ml-1" />
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryLabel(video.category)}
                    </Badge>
                    {video.duration && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {video.duration}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="line-clamp-2">
                    {video.description || "Clique para assistir"}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Nenhum vídeo encontrado</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {videos.length === 0 
                    ? "Novos conteúdos serão adicionados em breve!"
                    : "Tente buscar por outro termo ou categoria"
                  }
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Info sobre novos conteúdos */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="p-3 rounded-full bg-primary/10">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Novos conteúdos toda semana!</h3>
              <p className="text-sm text-muted-foreground">
                Estamos sempre adicionando novos vídeos para ajudar você a vender mais.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}
