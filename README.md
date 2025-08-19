# PDR - Plataforma Digital de Relacionamento

> Sistema de gestão de pessoas e relacionamentos para gabinetes de vereadores e pessoas públicas

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Instalação e Configuração](#instalação-e-configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Guia de Uso](#guia-de-uso)
- [Sistema de Permissões](#sistema-de-permissões)
- [Segurança e LGPD](#segurança-e-lgpd)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **PDR (Plataforma Digital de Relacionamento)** é um sistema web moderno desenvolvido para auxiliar gabinetes de vereadores e pessoas públicas na gestão eficiente de relacionamentos com cidadãos, parceiros e colaboradores. A plataforma oferece ferramentas completas para cadastro, acompanhamento de interações, geração de relatórios e gestão de tarefas.

### Objetivos Principais

- **Centralizar** o relacionamento com cidadãos e stakeholders
- **Organizar** interações e atendimentos de forma estruturada
- **Facilitar** o acompanhamento de demandas e solicitações
- **Gerar** relatórios e análises para tomada de decisão
- **Garantir** conformidade com a LGPD (Lei Geral de Proteção de Dados)

## ⚡ Funcionalidades

### 🏠 Dashboard Executivo
- Métricas em tempo real de pessoas cadastradas
- Indicadores de interações pendentes e concluídas
- Gráficos de relacionamentos por tipo e região
- Visão geral das atividades recentes

### 👥 Gestão de Pessoas
- **Cadastro completo** de cidadãos com dados pessoais e endereço
- **Categorização** por tipo de relacionamento (eleitor, parceiro, colaborador, etc.)
- **Busca avançada** com múltiplos filtros
- **Histórico completo** de interações
- **Conformidade LGPD** com mascaramento de dados sensíveis

### 💬 Sistema de Interações
- **Registro de atendimentos** presenciais, telefônicos e digitais
- **Acompanhamento de status** (pendente, em andamento, concluído)
- **Agendamento** de reuniões e compromissos
- **Histórico detalhado** de todas as comunicações

### 🏛️ Gestão de Gabinetes
- **Cadastro de gabinetes** com informações institucionais
- **Gerenciamento de credenciais** de acesso
- **Controle de status** (ativo, pendente, inativo)
- **Auditoria completa** de alterações

### ✅ Gestão de Tarefas
- **Criação e atribuição** de tarefas e atividades
- **Categorização** por tipo de atividade parlamentar
- **Controle de prazos** e prioridades
- **Visualização** em lista ou grid
- **Acompanhamento** de progresso

### 📊 Relatórios e Análises
- **Relatórios personalizáveis** por período e critérios
- **Exportação** em múltiplos formatos
- **Análises demográficas** e geográficas
- **Métricas de atendimento** e produtividade

### 🔐 Sistema de Segurança
- **Autenticação robusta** com diferentes níveis de acesso
- **Controle de permissões** granular por funcionalidade
- **Auditoria completa** de ações do sistema
- **Modo de manutenção** para atualizações

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **React Router DOM** - Roteamento de páginas
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **Lucide React** - Biblioteca de ícones

### Formulários e Validação
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas TypeScript
- **@hookform/resolvers** - Integração entre React Hook Form e Zod

### Utilitários
- **date-fns** - Manipulação de datas
- **crypto-js** - Criptografia e hashing
- **clsx** - Utilitário para classes CSS condicionais
- **class-variance-authority** - Variantes de componentes

### Desenvolvimento
- **ESLint** - Linting de código
- **PostCSS** - Processamento de CSS
- **Autoprefixer** - Prefixos CSS automáticos

## 🏗️ Arquitetura do Sistema

### Padrões Arquiteturais

- **Component-Based Architecture** - Componentes reutilizáveis e modulares
- **Context API** - Gerenciamento de estado global
- **Service Layer** - Camada de serviços para lógica de negócio
- **Custom Hooks** - Lógica reutilizável entre componentes

### Estrutura de Camadas

```
┌─────────────────────────────────────┐
│           Presentation Layer        │
│         (Pages & Components)        │
├─────────────────────────────────────┤
│            Context Layer            │
│        (State Management)           │
├─────────────────────────────────────┤
│            Service Layer            │
│         (Business Logic)            │
├─────────────────────────────────────┤
│             Utils Layer             │
│      (Helpers & Utilities)          │
└─────────────────────────────────────┘
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Git**

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd PDR-Versao2
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:5173
   ```

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linting do código

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base da interface
│   ├── cabinet-management/  # Componentes de gestão de gabinetes
│   ├── cabinet-registration/ # Componentes de cadastro
│   ├── interactions/   # Componentes de interações
│   ├── settings/       # Componentes de configurações
│   └── tasks/          # Componentes de tarefas
├── contexts/           # Contextos React (estado global)
│   ├── AuthContext.tsx
│   └── MaintenanceContext.tsx
├── pages/              # Páginas da aplicação
│   ├── DashboardPage.tsx
│   ├── PersonSearchPage.tsx
│   ├── CabinetManagementPage.tsx
│   ├── TaskManagementPage.tsx
│   └── ...
├── services/           # Camada de serviços
│   ├── authService.ts
│   ├── personService.ts
│   ├── auditService.ts
│   └── ...
├── types/              # Definições de tipos TypeScript
│   └── index.ts
├── utils/              # Utilitários e helpers
│   ├── validation.ts
│   └── lgpd.ts
└── lib/                # Configurações de bibliotecas
    └── utils.ts
```

## 📖 Guia de Uso

### 1. Primeiro Acesso

1. Acesse a página inicial do sistema
2. Clique em "Acessar Sistema"
3. Faça login com suas credenciais
4. Explore o dashboard para visão geral

### 2. Cadastro de Pessoas

1. Navegue para "Buscar Pessoas"
2. Clique em "Nova Pessoa"
3. Preencha os dados obrigatórios
4. Selecione o tipo de relacionamento
5. Salve o cadastro

### 3. Registro de Interações

1. Acesse o perfil da pessoa
2. Clique em "Nova Interação"
3. Selecione o tipo de interação
4. Preencha os detalhes
5. Defina status e agendamento

### 4. Gestão de Tarefas

1. Acesse "Gestão de Tarefas"
2. Clique em "Nova Tarefa"
3. Defina tipo de atividade
4. Configure prazo e responsável
5. Acompanhe o progresso

### 5. Geração de Relatórios

1. Navegue para "Relatórios"
2. Configure filtros desejados
3. Visualize os dados
4. Exporte se necessário

## 🔐 Sistema de Permissões

### Níveis de Acesso

| Papel | Descrição | Permissões |
|-------|-----------|------------|
| **Admin** | Administrador do sistema | Acesso total, gestão de usuários, configurações |
| **Chefe de Gabinete** | Gestor do gabinete | Gestão completa do gabinete, relatórios |
| **Assessor** | Assessor parlamentar | Cadastro e interações, tarefas |
| **Visualizador** | Acesso somente leitura | Consulta de dados, relatórios básicos |

### Controle Granular

- **Criação**: Quem pode criar novos registros
- **Edição**: Quem pode modificar dados existentes
- **Exclusão**: Quem pode remover registros
- **Exportação**: Quem pode exportar dados
- **Auditoria**: Quem pode visualizar logs de sistema

## 🛡️ Segurança e LGPD

### Conformidade LGPD

- **Mascaramento de dados** sensíveis em listagens
- **Controle de acesso** baseado em permissões
- **Auditoria completa** de todas as ações
- **Anonimização** de dados quando necessário

### Medidas de Segurança

- **Autenticação** com tokens JWT
- **Validação** rigorosa de entrada de dados
- **Criptografia** de dados sensíveis
- **Logs de auditoria** para rastreabilidade
- **Sessões** com timeout automático

### Auditoria

Todas as ações são registradas incluindo:
- Criação, edição e exclusão de registros
- Acessos e consultas a dados
- Exportações e relatórios
- Login e logout de usuários

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código

- Use **TypeScript** para tipagem estática
- Siga as **convenções de nomenclatura** estabelecidas
- **Documente** funções e componentes complexos
- **Teste** suas alterações antes de submeter
- Mantenha **consistência** com o estilo existente

### Estrutura de Commits

```
type(scope): description

[optional body]

[optional footer]
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **Documentação**: Consulte este README e comentários no código
- **Issues**: Abra uma issue no repositório para bugs ou sugestões
- **Contato**: Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para modernizar a gestão pública**
