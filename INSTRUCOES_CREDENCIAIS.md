# Instruções para Gerenciamento de Credenciais dos Gabinetes

## Como Acessar a Funcionalidade

A funcionalidade de gerenciamento de credenciais está disponível na página de **Gerenciamento de Gabinetes** (`http://localhost:5173/gabinetes`) e é acessível apenas para usuários com as seguintes permissões:

### Usuários Autorizados:

1. **Administradores** - Podem gerenciar credenciais de todos os gabinetes
2. **Chefes de Gabinete** - Podem gerenciar credenciais apenas do próprio gabinete

### Usuários de Teste Disponíveis:

#### Administrador:
- **Email:** `admin@gabinete.gov.br`
- **Senha:** `admin123`
- **Permissões:** Acesso total a todos os gabinetes

#### Chefe de Gabinete:
- **Email:** `chefe@gabinete.gov.br`
- **Senha:** `chefe123`
- **Permissões:** Acesso apenas ao Gabinete do Vereador João Silva

#### Visualizador:
- **Email:** `visualizador@gabinete.gov.br`
- **Senha:** `visualizador123`
- **Permissões:** Apenas visualização (sem acesso ao gerenciamento de credenciais)

#### Assessor:
- **Email:** `assessor@gabinete.gov.br`
- **Senha:** `assessor123`
- **Permissões:** Apenas visualização (sem acesso ao gerenciamento de credenciais)

## Como Usar a Funcionalidade:

### Passo 1: Fazer Login
1. Acesse `http://localhost:5173/login`
2. Use uma das credenciais acima
3. Clique em "Entrar"

### Passo 2: Acessar Gerenciamento de Gabinetes
1. No menu lateral, clique em "Gabinetes"
2. Você será direcionado para `http://localhost:5173/gabinetes`

### Passo 3: Gerenciar Credenciais
1. Na lista de gabinetes, localize o gabinete desejado
2. Clique no botão de ações (três pontos) na linha do gabinete
3. No menu dropdown, clique em "Gerenciar Credenciais" (ícone de chave)
4. Uma janela modal será aberta com as opções de gerenciamento

### Funcionalidades Disponíveis no Modal:

- **Visualizar credenciais atuais** (usuário e data da última alteração)
- **Alterar senha** com validação de segurança
- **Gerador de senha segura** com opção de copiar
- **Indicador de força da senha** (fraca, média, forte)
- **Validação em tempo real** da nova senha
- **Sistema de auditoria** que registra todas as alterações

### Recursos de Segurança:

- ✅ Validação de força da senha
- ✅ Confirmação de senha obrigatória
- ✅ Gerador de senhas seguras
- ✅ Registro de auditoria de todas as alterações
- ✅ Controle de acesso baseado em permissões
- ✅ Chefes de gabinete limitados ao próprio gabinete

## Observações Importantes:

1. **Chefes de Gabinete** só podem ver e alterar credenciais do gabinete ao qual estão associados
2. **Administradores** têm acesso total a todos os gabinetes
3. **Visualizadores e Assessores** não têm acesso à funcionalidade de gerenciamento de credenciais
4. Todas as alterações são registradas no sistema de auditoria
5. As senhas devem atender aos critérios de segurança definidos
6. É recomendado usar o gerador de senhas para criar senhas seguras
7. O sistema foi corrigido para importar corretamente as permissões do contexto de autenticação

## Solução de Problemas:

### Se não conseguir ver o botão "Gerenciar Credenciais":
- Verifique se está logado com um usuário autorizado (admin ou chefe_gabinete)
- Certifique-se de que está na página correta (`/gabinetes`)
- Tente fazer logout e login novamente
- Usuários com perfil "Visualizador" ou "Assessor" não têm acesso a esta funcionalidade

### Se aparecer erro de permissão:
- Confirme que está usando as credenciais corretas
- Chefes de gabinete só podem acessar o próprio gabinete
- Contate o administrador do sistema se necessário

### Se aparecer erro "canManageCredentials is not defined":
- Este erro foi corrigido na versão atual do sistema
- Certifique-se de que o servidor está rodando a versão mais recente
- Reinicie o servidor de desenvolvimento se necessário (`npm run dev`)

### Status do Sistema:
- ✅ **Corrigido:** Erro de importação da função `canManageCredentials`
- ✅ **Funcional:** Modal de gerenciamento de credenciais
- ✅ **Funcional:** Sistema de permissões baseado em roles
- ✅ **Funcional:** Gerador de senhas seguras
- ✅ **Funcional:** Validação de força da senha
- ✅ **Funcional:** Sistema de auditoria

---

**Desenvolvido para o Sistema PDR - Plataforma de Relacionamento Digital**