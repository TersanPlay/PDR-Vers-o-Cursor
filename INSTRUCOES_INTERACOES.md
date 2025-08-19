# Instruções para Gerenciar Interações

## Como Acessar a Funcionalidade

1. **Acesso pelo Menu Principal**
   - Faça login no sistema PDR
   - No menu lateral, clique em "Interações" ou acesse diretamente `/interacoes`
   - A página principal de interações será exibida

2. **Permissões Necessárias**
   - **Visualizar**: Todos os usuários autenticados podem visualizar interações
   - **Criar**: Assessores, Chefe de Gabinete e Administradores
   - **Editar**: Assessores, Chefe de Gabinete e Administradores
   - **Excluir**: Chefe de Gabinete e Administradores

## Funcionalidades Disponíveis

### 1. Visualizar Interações
- **Lista de Interações**: Visualize todas as interações registradas
- **Filtros Disponíveis**:
  - Por status (Pendente, Em Progresso, Concluído, Cancelado)
  - Por tipo (Atendimento, Ligação, E-mail, WhatsApp, Reunião, Visita, Evento, Outro)
  - Busca por texto (título, descrição)
- **Métricas**: Painel com estatísticas das interações

### 2. Criar Nova Interação

#### Campos Obrigatórios:
- **Pessoa**: Selecione a pessoa vinculada à interação
- **Tipo**: Escolha o tipo de interação
- **Título**: Título descritivo da interação
- **Descrição**: Detalhes da interação realizada

#### Campos Opcionais:
- **Status**: Define o status atual (padrão: Pendente)
- **Prioridade**: Baixa, Normal, Média ou Alta
- **Data Agendada**: Para interações futuras
- **Data de Follow-up**: Para acompanhamentos

#### Campos Específicos para Eventos:
Quando o tipo "Evento" for selecionado, campos adicionais aparecerão:
- **Local**: Selecione o local do evento (Plenário, Plenarinho, Presidência, etc.)
- **Horário de Início**: Hora de início do evento
- **Horário de Fim**: Hora de término do evento
- **Marcado por**: Como o evento foi agendado (E-mail, Visita, Reunião, WhatsApp, Ligação, Outros)

### 3. Editar Interação
- Clique no ícone de edição na linha da interação
- Modifique os campos necessários
- Salve as alterações

### 4. Visualizar Detalhes
- Clique no ícone de visualização para ver todos os detalhes da interação
- Histórico de alterações e informações completas

### 5. Atualização Automática de Status
- O sistema possui atualização automática de status baseada em datas
- Interações agendadas são automaticamente atualizadas quando apropriado

## Tipos de Interação

| Tipo | Descrição | Ícone |
|------|-----------|-------|
| Atendimento | Atendimento presencial ou geral | 📋 |
| Ligação | Contato telefônico | 📞 |
| E-mail | Comunicação por e-mail | 📧 |
| WhatsApp | Mensagem via WhatsApp | 💬 |
| Reunião | Reunião presencial ou virtual | 🤝 |
| Visita | Visita domiciliar ou institucional | 🏠 |
| Evento | Evento ou atividade programada | 🎉 |
| Outro | Outros tipos de interação | 📝 |

## Status de Interação

| Status | Descrição | Quando Usar |
|--------|-----------|-------------|
| Pendente | Interação ainda não iniciada | Padrão para novas interações |
| Em Progresso | Interação em andamento | Durante a execução |
| Em Andamento | Interação ativa | Para processos contínuos |
| Concluído | Interação finalizada | Quando completada |
| Cancelado | Interação cancelada | Quando não realizada |

## Prioridades

- **Baixa**: Interações de rotina, sem urgência
- **Normal**: Interações padrão (padrão)
- **Média**: Interações importantes, com prazo
- **Alta**: Interações urgentes, prioridade máxima

## Locais para Eventos

- **Plenário**: Sessões e eventos principais
- **Plenarinho**: Reuniões menores
- **Presidência**: Reuniões executivas
- **Estacionamento Interno**: Eventos no estacionamento interno
- **Estacionamento Externo**: Eventos no estacionamento externo
- **Outros**: Outros locais não listados

## Dicas de Uso

### Boas Práticas:
1. **Títulos Descritivos**: Use títulos claros e específicos
2. **Descrições Detalhadas**: Inclua informações relevantes na descrição
3. **Atualização Regular**: Mantenha os status atualizados
4. **Uso de Filtros**: Utilize filtros para encontrar interações rapidamente
5. **Follow-up**: Configure datas de follow-up para acompanhamentos

### Para Eventos:
1. **Planejamento**: Defina local, horários e como foi marcado
2. **Antecedência**: Registre eventos com antecedência
3. **Detalhes**: Inclua informações específicas do evento
4. **Acompanhamento**: Use follow-up para ações pós-evento

## Relatórios e Métricas

- **Painel de Métricas**: Visualize estatísticas em tempo real
- **Filtros de Relatório**: Gere relatórios por período, tipo, status
- **Exportação**: Exporte dados para análise externa (quando disponível)

## Solução de Problemas

### Problemas Comuns:

1. **Não consigo criar interação**
   - Verifique se você tem permissão de criação
   - Certifique-se de que todos os campos obrigatórios estão preenchidos

2. **Pessoa não aparece na lista**
   - Verifique se a pessoa está cadastrada no sistema
   - Use a funcionalidade de busca de pessoas

3. **Campos de evento não aparecem**
   - Certifique-se de ter selecionado o tipo "Evento"
   - Recarregue a página se necessário

4. **Status não atualiza automaticamente**
   - Verifique as datas configuradas
   - O sistema atualiza periodicamente, aguarde alguns minutos

## Suporte

Para dúvidas ou problemas não cobertos neste manual:
- Entre em contato com o administrador do sistema
- Consulte a documentação técnica
- Verifique as permissões do seu usuário

---

*Última atualização: Dezembro 2024*
*Versão do Sistema: PDR v2.0*