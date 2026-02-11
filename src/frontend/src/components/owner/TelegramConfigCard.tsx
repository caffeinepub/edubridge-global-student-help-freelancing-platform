import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetTelegramConfigStatus, useSetTelegramConfig } from '../../hooks/useAdmin';
import { toast } from 'sonner';
import { Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';

export default function TelegramConfigCard() {
  const { data: telegramStatus, isLoading } = useGetTelegramConfigStatus();
  const setConfigMutation = useSetTelegramConfig();
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!botToken || !chatId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await setConfigMutation.mutateAsync({ botToken, chatId });
      toast.success('Telegram configuration saved successfully');
      setBotToken('');
      setChatId('');
      setShowForm(false);
    } catch (error) {
      toast.error('Failed to save Telegram configuration');
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-strong">
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-strong border-accent/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-accent/10">
            <Send className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <CardTitle>Telegram Notifications</CardTitle>
            <CardDescription>
              Receive instant notifications for new work requests
            </CardDescription>
          </div>
          {telegramStatus?.isConfigured ? (
            <CheckCircle2 className="h-5 w-5 text-accent" />
          ) : (
            <AlertCircle className="h-5 w-5 text-warning" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {telegramStatus?.isConfigured ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10">
              <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Telegram is configured</p>
                <p className="text-xs text-muted-foreground">
                  Chat ID: {telegramStatus.chatId}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <a 
                href="https://t.me/techcrunchz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Telegram Channel
              </a>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowForm(!showForm)}
              className="w-full"
            >
              {showForm ? 'Cancel' : 'Update Configuration'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10">
              <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
              <p className="text-sm text-warning">
                Telegram notifications are not configured. Set up your bot to receive notifications.
              </p>
            </div>
            <Button
              variant="default"
              onClick={() => setShowForm(!showForm)}
              className="w-full gradient-primary"
            >
              {showForm ? 'Cancel' : 'Configure Telegram'}
            </Button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg glass animate-fade-in">
            <div className="space-y-2">
              <Label htmlFor="botToken">Bot Token *</Label>
              <Input
                id="botToken"
                type="password"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="Enter your Telegram bot token"
                required
                className="glass focus-glow"
              />
              <p className="text-xs text-muted-foreground">
                Get your bot token from @BotFather on Telegram
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chatId">Chat ID *</Label>
              <Input
                id="chatId"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="Enter your chat ID"
                required
                className="glass focus-glow"
              />
              <p className="text-xs text-muted-foreground">
                Your Telegram chat ID or channel ID
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ExternalLink className="h-4 w-4" />
              <a 
                href="https://t.me/techcrunchz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Join Telegram Channel
              </a>
            </div>

            <Button
              type="submit"
              disabled={setConfigMutation.isPending}
              className="w-full gradient-primary hover:glow-primary"
            >
              {setConfigMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
