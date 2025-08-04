import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Chat, Settings, Favorite, CalendarToday, Add, MoreVert, Delete, Edit, Image } from "@mui/icons-material";
import { cn } from "@/lib/utils";
import { peopleService } from "@/services/peopleService";
import { useToast } from "@/hooks/use-toast";
import { Memory } from "@/types/person";

interface PersonCardProps {
  id: string;
  name: string;
  relationship: string;
  birthYear?: number;
  avatar?: string;
  memoriesCount: number;
  memories?: Memory[];
  lastConversation?: Date;
  updatedAt: Date;
  onChat: (id: string) => void;
  onSettings: (id: string) => void;
  onAddMemory?: (id: string) => void;
  onDelete?: () => void;
  className?: string;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  id,
  name,
  relationship,
  birthYear,
  avatar,
  memoriesCount,
  memories = [],
  lastConversation,
  updatedAt,
  onChat,
  onSettings,
  onAddMemory,
  onDelete,
  className
}: PersonCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMemoriesDialogOpen, setIsMemoriesDialogOpen] = useState(false);
  const { toast } = useToast();

  const getRelationshipColor = (rel: string) => {
    const lowerRel = rel.toLowerCase();
    if (lowerRel.includes('mãe') || lowerRel.includes('pai')) return 'love';
    if (lowerRel.includes('avô') || lowerRel.includes('avó')) return 'memory';
    return 'accent';
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await peopleService.deletePerson(id);
      toast({
        title: "Pessoa removida",
        description: `${name} foi removido com sucesso.`,
      });
      onDelete?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a pessoa.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getLearningLevel = () => {
    return { level: 'Iniciante', progress: 10, color: 'bg-gray-500' };
  };

  return (
    <Card className={cn(
      "group cursor-pointer parallax-slow ios-focus overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/20",
      className
    )}>
      <CardContent className="p-4 sm:p-8 relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3 sm:space-x-5 flex-1 min-w-0">
            <Avatar className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-white/50 shadow-lg backdrop-blur-sm flex-shrink-0">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-gradient-to-br from-accent/20 to-accent/10 text-accent-foreground font-semibold text-lg sm:text-xl backdrop-blur-sm">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg sm:text-xl text-foreground leading-tight mb-2 truncate">{name}</h3>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "backdrop-blur-sm border border-white/30 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm",
                    getRelationshipColor(relationship) === 'love' && "bg-red-50/60 text-red-600",
                    getRelationshipColor(relationship) === 'memory' && "bg-blue-50/60 text-blue-600",
                    getRelationshipColor(relationship) === 'accent' && "bg-accent-soft/60 text-accent"
                  )}
                >
                  {relationship}
                </Badge>
                
                {lastConversation && (
                  <div className="text-xs text-muted-foreground/70 hidden sm:block">
                    {(() => {
                      const daysAgo = Math.floor((Date.now() - lastConversation.getTime()) / (1000 * 60 * 60 * 24));
                      if (daysAgo === 0) return "conversaram hoje";
                      if (daysAgo === 1) return "conversaram ontem";
                      if (daysAgo <= 7) return `conversaram há ${daysAgo} dias`;
                      if (daysAgo <= 30) return `conversaram há ${Math.floor(daysAgo / 7)} semanas`;
                      return `conversaram há ${Math.floor(daysAgo / 30)} meses`;
                    })()}
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground/50 mt-1 hidden sm:block">
                {(() => {
                  const updatedDaysAgo = Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
                  if (updatedDaysAgo === 0) return "atualizado hoje";
                  if (updatedDaysAgo === 1) return "atualizado ontem";
                  if (updatedDaysAgo <= 7) return `atualizado há ${updatedDaysAgo} dias`;
                  if (updatedDaysAgo <= 30) return `atualizado há ${Math.floor(updatedDaysAgo / 7)} semanas`;
                  return `atualizado há ${Math.floor(updatedDaysAgo / 30)} meses`;
                })()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onSettings(id);
              }}
              className="opacity-50 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 backdrop-blur-sm rounded-2xl w-8 h-8 sm:w-10 sm:h-10"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-50 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white/30 backdrop-blur-sm rounded-2xl w-8 h-8 sm:w-10 sm:h-10"
                >
                  <MoreVert className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-600">
                      <Delete className="w-4 h-4 mr-2" />
                      Remover pessoa
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remover {name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Todas as memórias, conversas e dados relacionados a {name} serão permanentemente removidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="w-full sm:w-auto">Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isDeleting ? "Removendo..." : "Remover definitivamente"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground bg-white/30 rounded-2xl px-3 sm:px-4 py-2 backdrop-blur-sm">
            {birthYear && (
              <div className="flex items-center">
                <CalendarToday className="w-4 h-4 mr-2" />
                <span className="text-xs sm:text-sm">{new Date().getFullYear() - birthYear} anos</span>
              </div>
            )}
            <Dialog open={isMemoriesDialogOpen} onOpenChange={setIsMemoriesDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost" 
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center">
                    <Favorite className="w-4 h-4 mr-2" />
                    <span className="text-xs sm:text-sm">
                      {memoriesCount} {memoriesCount === 1 ? 'memória' : 'memórias'}
                    </span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Memórias de {name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                  {memories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Favorite className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhuma memória registrada ainda.</p>
                      {onAddMemory && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsMemoriesDialogOpen(false);
                            onAddMemory(id);
                          }}
                          className="mt-4"
                        >
                          <Add className="w-4 h-4 mr-2" />
                          Adicionar primeira memória
                        </Button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-4">
                        {memories.map((memory) => (
                          <Card key={memory.id} className="p-4">
                            <div className="space-y-3">
                              {memory.mediaUrl && (
                                <div className="relative">
                                  {memory.mediaType === 'image' && (
                                    <img 
                                      src={memory.mediaUrl} 
                                      alt="Memória" 
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                  )}
                                  {memory.mediaType === 'video' && (
                                    <video 
                                      src={memory.mediaUrl} 
                                      controls 
                                      className="w-full h-32 rounded-lg"
                                    />
                                  )}
                                  {memory.mediaType === 'audio' && (
                                    <audio 
                                      src={memory.mediaUrl} 
                                      controls 
                                      className="w-full"
                                    />
                                  )}
                                  <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
                                    <Image className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              )}
                              <p className="text-sm leading-relaxed">{memory.text}</p>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setIsMemoriesDialogOpen(false);
                                    onAddMemory?.(id);
                                  }}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                      {onAddMemory && (
                        <div className="pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsMemoriesDialogOpen(false);
                              onAddMemory(id);
                            }}
                            className="w-full"
                          >
                            <Add className="w-4 h-4 mr-2" />
                            Adicionar nova memória
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {onAddMemory && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddMemory(id);
              }}
              className="w-full bg-white/20 border-white/30 text-accent hover:bg-accent/10 hover:border-accent/30 backdrop-blur-sm rounded-xl transition-all duration-200 h-9 sm:h-10"
            >
              <Add className="w-4 h-4 mr-2" />
              <span className="text-xs sm:text-sm">Adicionar Memória</span>
            </Button>
          )}
        </div>

        <Button 
          onClick={() => onChat(id)}
          className="w-full h-10 sm:h-12"
          size="lg"
          variant="glass"
        >
          <Chat className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
          <span className="text-sm sm:text-base">Conversar</span>
        </Button>
      </CardContent>
    </Card>
  );
};