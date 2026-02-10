import { useState, useEffect, useRef } from 'react';
import { useGetMessages, useSendMessage, useMarkMessageAsRead } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface ChatPanelProps {
  requestId: bigint;
  requestTitle: string;
}

export default function ChatPanel({ requestId, requestTitle }: ChatPanelProps) {
  const [message, setMessage] = useState('');
  const { data: messages = [], refetch } = useGetMessages(requestId);
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkMessageAsRead();
  const { identity } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUserPrincipal = identity?.getPrincipal().toString();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    messages.forEach((msg) => {
      if (!msg.isRead && msg.sender.toString() !== currentUserPrincipal) {
        markAsReadMutation.mutate(msg.id);
      }
    });
  }, [messages, currentUserPrincipal]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({ requestId, content: message });
      setMessage('');
      refetch();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

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
