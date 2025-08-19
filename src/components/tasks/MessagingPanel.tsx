import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: Date
  isRead: boolean
}

interface Contact {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'offline' | 'away'
  lastMessage?: string
  unreadCount: number
  lastSeen?: Date
}

interface MessagingPanelProps {
  className?: string
}

const MessagingPanel: React.FC<MessagingPanelProps> = ({ className }) => {
  const [selectedContact, setSelectedContact] = useState<string | null>('1')
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Dados simulados
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'João Silva',
      avatar: '/avatars/joao.jpg',
      status: 'online',
      lastMessage: 'Vou revisar o relatório hoje',
      unreadCount: 2,
      lastSeen: new Date()
    },
    {
      id: '2',
      name: 'Maria Santos',
      avatar: '/avatars/maria.jpg',
      status: 'away',
      lastMessage: 'Reunião confirmada para amanhã',
      unreadCount: 0,
      lastSeen: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      avatar: '/avatars/carlos.jpg',
      status: 'offline',
      lastMessage: 'Obrigado pelas informações',
      unreadCount: 1,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]

  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      senderName: 'João Silva',
      content: 'Oi! Como está o andamento do projeto?',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      isRead: true
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Você',
      content: 'Está indo bem! Já finalizei a primeira fase.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isRead: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'João Silva',
      content: 'Ótimo! Vou revisar o relatório hoje à tarde.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false
    },
    {
      id: '4',
      senderId: '1',
      senderName: 'João Silva',
      content: 'Podemos marcar uma reunião para discutir os próximos passos?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false
    }
  ]

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedContactData = contacts.find(c => c.id === selectedContact)
  const contactMessages = selectedContact ? messages.filter(m => 
    m.senderId === selectedContact || m.senderId === 'me'
  ) : []

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return
    
    // Aqui você implementaria a lógica para enviar a mensagem
    console.log('Enviando mensagem:', newMessage)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [contactMessages])

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Mensagens</CardTitle>
        
        {/* Barra de pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar contatos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        {!selectedContact ? (
          /* Lista de contatos */
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact.id)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                      getStatusColor(contact.status)
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{contact.name}</h4>
                      {contact.unreadCount > 0 && (
                        <Badge className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                    {contact.lastMessage && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {contact.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          /* Chat ativo */
          <>
            {/* Cabeçalho do chat */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedContact(null)}
                  className="p-1 h-auto"
                >
                  ←
                </Button>
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={selectedContactData?.avatar} />
                    <AvatarFallback className="text-xs">
                      {selectedContactData?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full border border-white ${
                    getStatusColor(selectedContactData?.status || 'offline')
                  }`} />
                </div>
                <div>
                  <h4 className="font-medium text-sm">{selectedContactData?.name}</h4>
                  <p className="text-xs text-gray-500">
                    {selectedContactData?.status === 'online' ? 'Online' : 
                     selectedContactData?.lastSeen ? 
                     `Visto ${format(selectedContactData.lastSeen, 'HH:mm', { locale: ptBR })}` : 
                     'Offline'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {contactMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.senderId === 'me' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'me' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {format(message.timestamp, 'HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input de mensagem */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default MessagingPanel