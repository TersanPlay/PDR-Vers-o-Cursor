import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./components/ui/avatar";
import { Progress } from "./components/ui/progress";
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  User,
  MoreHorizontal,
  MessageCircle,
  Paperclip,
  Star,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "high" | "medium" | "low";
  assignee: string;
  assigneeAvatar?: string;
  dueDate: string;
  progress?: number;
  category: string;
  comments?: number;
  attachments?: number;
  team?: string[];
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Sessão Ordinária do Período",
    description:
      "Adotar a conduta do projeto de melhoramento e implementação das novas diretrizes.",
    status: "pending",
    priority: "high",
    assignee: "João Silva",
    assigneeAvatar: "JS",
    dueDate: "15/08/2024",
    progress: 45,
    category: "reunioes",
    comments: 5,
    attachments: 3,
    team: ["JS", "MS", "PC"],
  },
  {
    id: "2",
    title: "Reunião do Comitê de Edificação",
    description:
      "Proposta para um novo desenvolvimento arquitetônico sustentável.",
    status: "in-progress",
    priority: "medium",
    assignee: "Maria Santos",
    assigneeAvatar: "MS",
    dueDate: "20/08/2024",
    progress: 75,
    category: "desenvolvimento",
    comments: 8,
    attachments: 2,
    team: ["MS", "AL", "CO"],
  },
  {
    id: "3",
    title: "Sessão Solene de Homenagens",
    description:
      "Cerimônia de homenagem aos membros que contribuíram significativamente.",
    status: "completed",
    priority: "low",
    assignee: "Pedro Costa",
    assigneeAvatar: "PC",
    dueDate: "10/08/2024",
    progress: 100,
    category: "eventos",
    comments: 12,
    attachments: 5,
    team: ["PC", "JS"],
  },
  {
    id: "4",
    title: "Reunião Vi Sae com Liderança",
    description:
      "Alinhamento de estratégias operacionais e definição de metas trimestrais.",
    status: "in-progress",
    priority: "high",
    assignee: "Ana Lima",
    assigneeAvatar: "AL",
    dueDate: "18/08/2024",
    progress: 60,
    category: "estrategia",
    comments: 4,
    attachments: 1,
    team: ["AL", "CO", "MS"],
  },
  {
    id: "5",
    title: "Auditoria Política Externa",
    description:
      "Análise de compliance e processos internos conforme regulamentação.",
    status: "pending",
    priority: "medium",
    assignee: "Carlos Oliveira",
    assigneeAvatar: "CO",
    dueDate: "25/08/2024",
    progress: 20,
    category: "auditoria",
    comments: 2,
    attachments: 7,
    team: ["CO", "JS", "AL"],
  },
  {
    id: "6",
    title: "Workshop de Inovação Digital",
    description:
      "Capacitação em tecnologias emergentes para modernização dos processos.",
    status: "pending",
    priority: "medium",
    assignee: "Fernanda Rocha",
    assigneeAvatar: "FR",
    dueDate: "30/08/2024",
    progress: 10,
    category: "capacitacao",
    comments: 6,
    attachments: 4,
    team: ["FR", "MS", "PC"],
  },
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const stats = {
    total: mockTasks.length,
    completed: mockTasks.filter(
      (task) => task.status === "completed",
    ).length,
    overdue: mockTasks.filter(
      (task) =>
        task.status === "pending" &&
        new Date(task.dueDate.split("/").reverse().join("-")) <
          new Date(),
    ).length,
    inProgress: mockTasks.filter(
      (task) => task.status === "in-progress",
    ).length,
  };

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      task.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending")
      return matchesSearch && task.status === "pending";
    if (activeTab === "in-progress")
      return matchesSearch && task.status === "in-progress";
    if (activeTab === "completed")
      return matchesSearch && task.status === "completed";

    return matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      reunioes: "from-blue-200/40 to-blue-300/40",
      desenvolvimento: "from-orange-200/40 to-orange-300/40",
      eventos: "from-purple-200/40 to-purple-300/40",
      estrategia: "from-green-200/40 to-green-300/40",
      auditoria: "from-pink-200/40 to-pink-300/40",
      capacitacao: "from-cyan-200/40 to-cyan-300/40",
    };
    return (
      colors[category as keyof typeof colors] ||
      "from-gray-200/40 to-gray-300/40"
    );
  };

  const getCategoryBg = (category: string) => {
    const colors = {
      reunioes:
        "bg-gradient-to-br from-blue-50/50 to-blue-100/30",
      desenvolvimento:
        "bg-gradient-to-br from-orange-50/50 to-orange-100/30",
      eventos:
        "bg-gradient-to-br from-purple-50/50 to-purple-100/30",
      estrategia:
        "bg-gradient-to-br from-green-50/50 to-green-100/30",
      auditoria:
        "bg-gradient-to-br from-pink-50/50 to-pink-100/30",
      capacitacao:
        "bg-gradient-to-br from-cyan-50/50 to-cyan-100/30",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gradient-to-br from-gray-50/50 to-gray-100/30"
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50/80 text-green-700 border-green-200/50";
      case "in-progress":
        return "bg-blue-50/80 text-blue-700 border-blue-200/50";
      case "pending":
        return "bg-orange-50/80 text-orange-700 border-orange-200/50";
      default:
        return "bg-gray-50/80 text-gray-700 border-gray-200/50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-400/60";
      case "medium":
        return "bg-yellow-400/60";
      case "low":
        return "bg-green-400/60";
      default:
        return "bg-gray-400/60";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída";
      case "in-progress":
        return "Em Andamento";
      case "pending":
        return "Pendente";
      default:
        return status;
    }
  };

  const getCategoryText = (category: string) => {
    const categories = {
      reunioes: "Reuniões",
      desenvolvimento: "Desenvolvimento",
      eventos: "Eventos",
      estrategia: "Estratégia",
      auditoria: "Auditoria",
      capacitacao: "Capacitação",
    };
    return (
      categories[category as keyof typeof categories] ||
      category
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/80 to-gray-100/60">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-500/80 to-blue-600/80 p-3 rounded-xl shadow-md">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Gerenciamento de Tarefas
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Organize e acompanhe suas atividades com
                  estilo
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex border-gray-200/60 bg-white/80"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-600/90 hover:to-blue-700/90 shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400/60 to-blue-500/60"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Total de Tarefas
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/60 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-blue-600/80" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400/60 to-green-500/60"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Concluídas
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {stats.completed}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50/80 to-green-100/60 p-3 rounded-full">
                  <CheckCircle2 className="h-6 w-6 text-green-600/80" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400/60 to-red-500/60"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Atrasadas
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {stats.overdue}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50/80 to-red-100/60 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600/80" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400/60 to-orange-500/60"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Em Andamento
                  </p>
                  <p className="text-3xl font-semibold text-gray-900">
                    {stats.inProgress}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50/80 to-orange-100/60 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600/80" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Tabs */}
        <Card className="mb-8 border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  className="pl-10 border-0 bg-gray-50/60 focus:bg-white/80 transition-colors text-[13px]"
                />
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-gray-100/60">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-white/90"
                >
                  Todas ({stats.total})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-white/90"
                >
                  Pendentes (
                  {
                    mockTasks.filter(
                      (t) => t.status === "pending",
                    ).length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="data-[state=active]:bg-white/90"
                >
                  Em Andamento ({stats.inProgress})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="data-[state=active]:bg-white/90"
                >
                  Concluídas ({stats.completed})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-8">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTasks.map((task) => (
                    <Card
                      key={task.id}
                      className={`relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${getCategoryBg(task.category)} backdrop-blur-sm`}
                    >
                      {/* Header with gradient */}
                      <div
                        className={`h-2 bg-gradient-to-r ${getCategoryColor(task.category)}`}
                      ></div>

                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-1 bg-white/70 text-gray-700 border-0"
                            >
                              {getCategoryText(task.category)}
                            </Badge>
                            <div
                              className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}
                            ></div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-white/60"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(task.status)} text-xs px-2 py-1`}
                          >
                            {getStatusText(task.status)}
                          </Badge>
                          {task.priority === "high" && (
                            <Star className="h-4 w-4 text-yellow-500/80 fill-current" />
                          )}
                        </div>

                        <CardTitle className="text-lg leading-tight mb-3 text-gray-900">
                          {task.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      </CardHeader>

                      <CardContent className="pt-0 space-y-4">
                        {task.progress !== undefined && (
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">
                                Progresso
                              </span>
                              <span className="font-medium text-gray-900">
                                {task.progress}%
                              </span>
                            </div>
                            <Progress
                              value={task.progress}
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8 border-2 border-white/80 shadow-sm">
                              <AvatarFallback className="text-xs bg-gradient-to-br from-gray-100/80 to-gray-200/60">
                                {task.assigneeAvatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-700 font-medium">
                              {task.assignee}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-3 w-3" />
                              <span>{task.comments}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Paperclip className="h-3 w-3" />
                              <span>{task.attachments}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {task.dueDate}
                            </span>
                          </div>

                          <div className="flex -space-x-2">
                            {task.team
                              ?.slice(0, 3)
                              .map((member, index) => (
                                <Avatar
                                  key={index}
                                  className="h-6 w-6 border-2 border-white/80 shadow-sm"
                                >
                                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-100/80 to-blue-200/60 text-blue-700">
                                    {member}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            {task.team &&
                              task.team.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-gray-200/80 border-2 border-white/80 shadow-sm flex items-center justify-center">
                                  <span className="text-xs text-gray-600 font-medium">
                                    +{task.team.length - 3}
                                  </span>
                                </div>
                              )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredTasks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-gradient-to-br from-gray-100/80 to-gray-200/60 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma tarefa encontrada
                    </h3>
                    <p className="text-gray-600">
                      Tente ajustar os filtros ou criar uma nova
                      tarefa.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}