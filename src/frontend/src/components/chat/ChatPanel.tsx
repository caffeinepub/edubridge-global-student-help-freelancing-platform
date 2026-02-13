import { useState, useEffect, useRef } from 'react';
import { useGetMessages, useSendMessage, useMarkMessageAsRead } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface ChatPanelProps {
  requestId: bigint;
  requestTitle: string;
}

export default function ChatPanel({ requestId, requestTitle }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const { data: messages = [], refetch, error: messagesError } = useGetMessages(requestId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessageAsRead();
  const { identity } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  // Check if there's an authorization error
  const isUnauthorized = messagesError && 
    (String(messagesError).includes('Unauthorized') || String(messagesError).includes('Only the request owner'));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isUnauthorized) {
      messages.forEach((msg) => {
        if (!msg.isRead && msg.sender.toString() !== currentUserPrincipal) {
          markAsReadMutation.mutate(msg.id);
        }
      });
    }
  }, [messages, currentUserPrincipal, isUnauthorized]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({ requestId, content: message });
      setMessage('');
      refetch();
    } catch (error: any) {
      if (error.message?.includes('Unauthorized') || error.message?.includes('Only the request owner')) {
        toast.error('You do not have permission to send messages in this chat');
      } else {
        toast.error('Failed to send message');
      }
    }
  };

  // Show access denied state if unauthorized
  if (isUnauthorized) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">Chat: {requestTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center gap-4 p-4">
          <ShieldAlert className="h-16 w-16 text-muted-foreground" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Access Denied</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              You do not have permission to view or send messages in this chat. 
              Only the request owner, assigned helper, and admin can access this conversation.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">Chat: {requestTitle}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg) => {
              const isCurrentUser = msg.sender.toString() === currentUserPrincipal;
              return (
                <div key={msg.id.toString()} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(Number(msg.timestamp) / 1000000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} disabled={!message.trim() || sendMessageMutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
