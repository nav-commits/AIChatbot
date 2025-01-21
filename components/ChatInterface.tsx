'use client';

import { useState } from 'react';
import { Message } from '@/types/chat';
import {
  Send,
  Bot,
  User,
  LogIn,
  Plus,
  Settings,
  Moon,
  Sun,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now().toString(),
        content: data.reply,
        role: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex flex-1 bg-background">
      {/* Enhanced Sidebar */}
      <div className="w-72 bg-card border-r border-border flex flex-col h-screen">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold text-foreground">AI Assistant</h1>
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <LogIn className="h-5 w-5" />
            </Button>
          </div>
          <Button className="w-full flex items-center space-x-2" size="lg">
            <Plus className="h-5 w-5" />
            <span>New Chat</span>
          </Button>
        </div>

        {/* Chat History */}
        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Button
                key={i}
                variant="ghost"
                className="w-full justify-start text-left flex items-center space-x-2 py-3 px-4 hover:bg-muted rounded-lg"
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">Previous Chat {i}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <Separator className="my-2" />
          <Button variant="ghost" className="w-full justify-start space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start space-x-2"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start space-x-2">
            <HelpCircle className="h-4 w-4" />
            <span>Help & FAQ</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Chat Header */}
        <div className="bg-card border-b border-border p-4">
          <h2 className="text-lg font-semibold text-foreground">Current Chat</h2>
          <p className="text-sm text-muted-foreground">Ask me anything!</p>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6 bg-background">
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start space-x-4',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'flex max-w-[80%] items-start space-x-3 rounded-2xl p-4',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="h-6 w-6 mt-1 text-primary" />
                  ) : (
                    <User className={cn('h-6 w-6 mt-1', message.role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground')} />
                  )}
                  <div className="flex-1 space-y-2">
                    <p className={cn('text-sm', message.role === 'user' ? 'text-primary-foreground' : 'text-foreground')}>
                      {message.content}
                    </p>
                    <span className={cn('text-xs block', message.role === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Enhanced Input Area */}
        <div className="bg-card border-t border-border p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 py-6 text-base"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="lg"
                className="rounded-full px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}