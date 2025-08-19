import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Chat, Settings, Favorite, CalendarToday, Add, MoreVert, Delete, Edit, Image, Mic } from "@mui/icons-material";
import { VolumeUpFilled, Phone } from "@carbon/icons-react";
import { cn } from "@/lib/utils";
import { peopleService } from "@/services/peopleService";
import { useToast } from "@/hooks/use-toast";
import { Memory, Person } from "@/types/person";
import { VoiceMessageGenerator } from "@/components/VoiceMessageGenerator";
import { VoiceSettings } from "@/components/VoiceSettings";
import { AudioChat } from "@/components/AudioChat";
import { useLanguage } from "@/hooks/useLanguage";
interface PersonCardProps {
  id: string;
  name: string;
  relationship: string;
  birthYear?: number;
  birthDate?: string;
  avatar?: string;
  memoriesCount: number;
  memories?: Memory[];
  voiceSettings?: {
    hasRecording: boolean;
    voiceId?: string;
    audioFiles?: Array<{
      name: string;
      url: string;
      duration?: number;
    }>;
  };
  lastConversation?: Date;
  updatedAt: Date;
  person?: Person; // Pessoa completa para VoiceMessageGenerator
  onChat: (id: string) => void;
  onSettings: (id: string) => void;
  onAddMemory?: (id: string) => void;
  onDelete?: () => void;
  className?: string;
}

const getContent = (language: string) => {
  const content = {
    en: {
      years: "years",
      ageNotInformed: "Age not informed",
      memory: "memory",
      memories: "memories",
      memoriesOf: "Memories of",
      noMemories: "No memories recorded yet.",
      addFirstMemory: "Add first memory",
      lastConversation: "Last conversation",
      never: "Never",
      chat: "Chat",
      call: "Call",
      addMemory: "Add memory", 
      settings: "Settings",
      deleteConfirm: "Are you sure you want to delete",
      deleteWarning: "This action cannot be undone. All memories, conversations and data related to",
      deleteButton: "Delete",
      cancel: "Cancel",
      voiceMessage: "Voice Message",
      voiceSettings: "Voice Settings"
    },
    'pt-BR': {
      years: "anos",
      ageNotInformed: "Idade não informada", 
      memory: "memória",
      memories: "memórias",
      memoriesOf: "Memórias de",
      noMemories: "Nenhuma memória registrada ainda.",
      addFirstMemory: "Adicionar primeira memória",
      lastConversation: "Última conversa",
      never: "Nunca",
      chat: "Conversar",
      call: "Ligar",
      addMemory: "Adicionar memória",
      settings: "Configurações", 
      deleteConfirm: "Tem certeza que deseja excluir",
      deleteWarning: "Esta ação não pode ser desfeita. Todas as memórias, conversas e dados relacionados a",
      deleteButton: "Excluir",
      cancel: "Cancelar",
      voiceMessage: "Mensagem de Voz",
      voiceSettings: "Configurações de Voz"
    },
    es: {
      years: "años",
      ageNotInformed: "Edad no informada",
      memory: "recuerdo", 
      memories: "recuerdos",
      memoriesOf: "Recuerdos de",
      noMemories: "No hay recuerdos registrados aún.",
      addFirstMemory: "Agregar primer recuerdo",
      lastConversation: "Última conversación", 
      never: "Nunca",
      chat: "Conversar",
      call: "Llamar",
      addMemory: "Agregar recuerdo",
      settings: "Configuración",
      deleteConfirm: "¿Estás seguro de que quieres eliminar a",
      deleteWarning: "Esta acción no se puede deshacer. Todos los recuerdos, conversaciones y datos relacionados con",
      deleteButton: "Eliminar", 
      cancel: "Cancelar",
      voiceMessage: "Mensaje de Voz",
      voiceSettings: "Configuración de Voz"
    }
  };

  return content[language as keyof typeof content] || content.en;
};

export const PersonCard: React.FC<PersonCardProps> = ({
  id,
  name,
  relationship,
  birthYear,
  birthDate,
  avatar,
  memoriesCount,
  memories = [],
  voiceSettings,
  lastConversation,
  updatedAt,
  person,
  onChat,
  onSettings,
  onAddMemory,
  onDelete,
  className = ""
}) => {
  const { currentLanguage } = useLanguage();
  const content = getContent(currentLanguage);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMemoriesDialogOpen, setIsMemoriesDialogOpen] = useState(false);
  const {
    toast
  } = useToast();
  const getRelationshipColor = (rel: string) => {
    return 'default'; // Usar cor padrão para design minimalista
  };
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await peopleService.deletePerson(id);
      toast({
        title: "Pessoa removida",
        description: `${name} foi removido com sucesso.`
      });
      onDelete?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível remover a pessoa.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const calculateAge = () => {
    if (birthDate) {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
        age--;
      }
      return age;
    } else if (birthYear) {
      return new Date().getFullYear() - birthYear;
    }
    return null;
  };
  const getLearningLevel = () => {
    return {
      level: 'Iniciante',
      progress: 10,
      color: 'bg-gray-500'
    };
  };
  return <div className={cn("bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden", className)}>
      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Avatar className="w-20 h-20 border-2 border-border shadow-sm flex-shrink-0">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-muted text-foreground font-semibold text-xl">
                {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-serif text-[clamp(1.125rem,2.5vw,1.5rem)] text-foreground leading-tight mb-2 truncate">{name}</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge 
                  variant="secondary" 
                  className="border border-border px-3 py-1 rounded-full text-sm"
                >
                  {relationship}
                </Badge>
                
                {lastConversation && <div className="text-xs text-muted-foreground/70 hidden sm:block">
                    {(() => {
                  const daysAgo = Math.floor((Date.now() - lastConversation.getTime()) / (1000 * 60 * 60 * 24));
                  if (daysAgo === 0) return "conversaram hoje";
                  if (daysAgo === 1) return "conversaram ontem";
                  if (daysAgo <= 7) return `conversaram há ${daysAgo} dias`;
                  if (daysAgo <= 30) return `conversaram há ${Math.floor(daysAgo / 7)} semanas`;
                  return `conversaram há ${Math.floor(daysAgo / 30)} meses`;
                })()}
                  </div>}
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
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSettings(id);
              }} 
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-muted rounded-xl w-10 h-10 flex items-center justify-center"
            >
              <Settings className="w-5 h-5" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-muted rounded-xl w-10 h-10 flex items-center justify-center">
                  <MoreVert className="w-5 h-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-red-600 focus:text-red-600">
                      <Delete className="w-4 h-4 mr-2" />
                      {content.deleteButton}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="mx-4 max-w-md sm:max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{content.deleteConfirm} {name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        {content.deleteWarning} {name} serão permanentemente removidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                        <AlertDialogCancel className="w-full sm:w-auto">{content.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                          {isDeleting ? "..." : content.deleteButton}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted rounded-2xl px-3 sm:px-4 py-2">
            <div className="flex items-center">
              {(() => {
              const age = calculateAge();
              return age !== null ? <>
                    <CalendarToday className="w-4 h-4 mr-2" />
                    <span className="text-xs sm:text-sm">{age} {content.years}</span>
                  </> : <span className="text-xs sm:text-sm text-muted-foreground/50">{content.ageNotInformed}</span>;
            })()}
            </div>
            <div className="flex items-center gap-4">
              <Dialog open={isMemoriesDialogOpen} onOpenChange={setIsMemoriesDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center">
                      <Favorite className="w-4 h-4 mr-2" />
                      <span className="text-xs sm:text-sm">
                        {memoriesCount} {memoriesCount === 1 ? content.memory : content.memories}
                      </span>
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle>{content.memoriesOf} {name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                    {memories.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                        <Favorite className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>{content.noMemories}</p>
                        {onAddMemory && <Button variant="outline" onClick={() => {
                      setIsMemoriesDialogOpen(false);
                      onAddMemory(id);
                    }} className="mt-4">
                            <Add className="w-4 h-4 mr-2" />
                            {content.addFirstMemory}
                          </Button>}
                      </div> : <>
                        <div className="grid gap-4">
                          {memories.map(memory => <Card key={memory.id} className="p-4">
                              <div className="space-y-3">
                                {memory.mediaUrl && <div className="relative">
                                    {memory.mediaType === 'image' && <img src={memory.mediaUrl} alt={content.memory} className="w-full h-32 object-cover rounded-lg" />}
                                    {memory.mediaType === 'video' && <video src={memory.mediaUrl} controls className="w-full h-32 rounded-lg" />}
                                    {memory.mediaType === 'audio' && <audio src={memory.mediaUrl} controls className="w-full" />}
                                    <div className="absolute top-2 left-2 bg-primary/50 rounded-full p-1">
                                      <Image className="w-4 h-4 text-primary-foreground" />
                                    </div>
                                  </div>}
                                <p className="text-sm leading-relaxed">{memory.text}</p>
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="sm" onClick={() => {
                              setIsMemoriesDialogOpen(false);
                              onAddMemory?.(id);
                            }}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Editar
                                  </Button>
                                </div>
                              </div>
                            </Card>)}
                        </div>
                        {onAddMemory && <div className="pt-4 border-t">
                            <Button variant="outline" onClick={() => {
                        setIsMemoriesDialogOpen(false);
                        onAddMemory(id);
                      }} className="w-full">
                              <Add className="w-4 h-4 mr-2" />
                              Adicionar nova memória
                            </Button>
                          </div>}
                      </>}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Visualização de áudios */}
              <div className="flex items-center">
                <Mic className="w-4 h-4 mr-2" />
                <span className="text-xs sm:text-sm">
                  {(() => {
                  // Primeiro tenta buscar dos audioFiles (tabela), depois do voiceSettings
                  const audioCount = person?.audioFiles?.length || person?.voiceSettings?.audioFiles?.length || 0;
                  return audioCount > 0 ? `${audioCount} áudio${audioCount > 1 ? 's' : ''}` : '0 áudios';
                })()}
                </span>
                {voiceSettings?.hasRecording && voiceSettings?.voiceId && <span className="ml-2 w-2 h-2 bg-green-500 rounded-full" title="Clone de voz criado"></span>}
              </div>
            </div>
          </div>
        </div>

        {/* Botão de adicionar memória */}
        {onAddMemory && <Button variant="outline" size="sm" onClick={e => {
        e.stopPropagation();
        onAddMemory(id);
      }} className="w-full mb-4 hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 transition-all">
            <Add className="w-4 h-4 mr-2" />
            <span className="text-xs sm:text-sm">{content.addMemory}</span>
          </Button>}

        {/* CTAs principais com hierarquia e espaçamento otimizado */}
        <div className="space-y-4">
          {/* Botão principal - Chat (destaque máximo) */}
            <Button 
              onClick={() => onChat(id)} 
              className="w-full mb-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
              size="lg"
              aria-label={`Conversar com ${name}`}
            >
              <Chat className="w-6 h-6 mr-3" />
              {content.chat}
            </Button>

          {/* Botões secundários - Grid responsivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Botão de receber áudio */}
            {person ? (
              <VoiceMessageGenerator 
                person={person} 
                trigger={
                    <Button 
                      onClick={e => e.stopPropagation()} 
                      size="lg" 
                      variant="secondary"
                      aria-label={`Gerar mensagem de voz de ${name}`}
                      className="w-full h-12 md:h-14 hover:bg-gradient-to-r hover:from-secondary/80 hover:to-secondary/60 transition-all"
                    >
                      <VolumeUpFilled className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span>{content.voiceMessage}</span>
                    </Button>
                } 
              />
            ) : (
              <Button 
                disabled 
                aria-label="Receber (indisponível)"
                className="w-full h-12 md:h-14" 
                size="lg"
                variant="secondary"
              >
                <VolumeUpFilled className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>Receber</span>
              </Button>
            )}

            {/* Botão de conversa por áudio */}
            {person ? (
              <AudioChat 
                person={person} 
                trigger={
                    <Button 
                      onClick={e => e.stopPropagation()} 
                      size="lg" 
                      variant="secondary"
                      aria-label={`Conversa por áudio com ${name}`}
                      className="w-full h-12 md:h-14 hover:bg-gradient-to-r hover:from-secondary/80 hover:to-secondary/60 transition-all"
                    >
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span>{content.call}</span>
                    </Button>
                } 
              />
            ) : (
              <Button 
                disabled 
                aria-label="Áudio (indisponível)"
                className="w-full h-12 md:h-14" 
                size="lg"
                variant="secondary"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span>{content.call}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Configurações de voz */}
        {person && person.voiceSettings?.hasRecording && (
          <div className="mt-4">
            <VoiceSettings person={person} onUpdate={onDelete} />
          </div>
        )}
      </div>
    </div>;
};