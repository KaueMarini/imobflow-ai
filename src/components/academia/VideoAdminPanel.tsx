import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Video, Settings2 } from "lucide-react";
import { toast } from "sonner";

interface VideoForm {
  title: string;
  description: string;
  video_url: string;
  category: string;
  duration: string;
  thumbnail_url: string;
  is_active: boolean;
}

const initialFormState: VideoForm = {
  title: "",
  description: "",
  video_url: "",
  category: "patrocinado",
  duration: "",
  thumbnail_url: "",
  is_active: true,
};

const categories = [
  { id: "patrocinado", label: "Tráfego Pago" },
  { id: "captacao", label: "Captação" },
  { id: "atendimento", label: "Atendimento" },
  { id: "fechamento", label: "Fechamento" },
];

export function VideoAdminPanel() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VideoForm>(initialFormState);

  // Check if user is admin
  const { data: isAdmin } = useQuery({
    queryKey: ["user-is-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch all videos (admin can see all)
  const { data: videos, isLoading } = useQuery({
    queryKey: ["academia-videos-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("academia_videos")
        .select("*")
        .order("order_index", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin === true,
  });

  const createMutation = useMutation({
    mutationFn: async (video: VideoForm) => {
      const { error } = await supabase.from("academia_videos").insert([video]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academia-videos-admin"] });
      queryClient.invalidateQueries({ queryKey: ["academia-videos"] });
      toast.success("Vídeo adicionado com sucesso!");
      resetForm();
    },
    onError: (error) => {
      console.error("Error creating video:", error);
      toast.error("Erro ao adicionar vídeo");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, video }: { id: string; video: VideoForm }) => {
      const { error } = await supabase
        .from("academia_videos")
        .update(video)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academia-videos-admin"] });
      queryClient.invalidateQueries({ queryKey: ["academia-videos"] });
      toast.success("Vídeo atualizado com sucesso!");
      resetForm();
    },
    onError: (error) => {
      console.error("Error updating video:", error);
      toast.error("Erro ao atualizar vídeo");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("academia_videos")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academia-videos-admin"] });
      queryClient.invalidateQueries({ queryKey: ["academia-videos"] });
      toast.success("Vídeo removido com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting video:", error);
      toast.error("Erro ao remover vídeo");
    },
  });

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (video: any) => {
    setForm({
      title: video.title,
      description: video.description || "",
      video_url: video.video_url,
      category: video.category,
      duration: video.duration || "",
      thumbnail_url: video.thumbnail_url || "",
      is_active: video.is_active,
    });
    setEditingId(video.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.video_url) {
      toast.error("Preencha título e URL do vídeo");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, video: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const getCategoryLabel = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.label || categoryId;
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings2 className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">Gerenciar Vídeos</CardTitle>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Vídeo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Título do vídeo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video_url">URL do Vídeo *</Label>
                <Input
                  id="video_url"
                  value={form.video_url}
                  onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
                <p className="text-xs text-muted-foreground">
                  Suporta YouTube, Vimeo ou link direto de vídeo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Descrição do vídeo"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm({ ...form, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duração</Label>
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="12:45"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">URL da Thumbnail (opcional)</Label>
                <Input
                  id="thumbnail_url"
                  value={form.thumbnail_url}
                  onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => setForm({ ...form, is_active: checked })}
                />
                <Label htmlFor="is_active">Vídeo ativo (visível para usuários)</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? "Salvar" : "Adicionar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Carregando...</p>
        ) : videos && videos.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        {video.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getCategoryLabel(video.category)}</Badge>
                    </TableCell>
                    <TableCell>{video.duration || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={video.is_active ? "default" : "outline"}>
                        {video.is_active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(video)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            if (confirm("Tem certeza que deseja excluir este vídeo?")) {
                              deleteMutation.mutate(video.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum vídeo cadastrado ainda.</p>
            <p className="text-sm">Clique em "Novo Vídeo" para começar.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
