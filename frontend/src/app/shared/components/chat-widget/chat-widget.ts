import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { ChatService, ChatResponse } from '../../../services/chat.service';

import { CartService } from '../../../services/cart.service';

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
  products?: ChatResponse['products'];
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-widget.html',
  styleUrl: './chat-widget.css',
})
export class ChatWidget {
  private readonly chatService = inject(ChatService);

  private readonly cartService = inject(CartService);

  readonly isOpen = signal(false);

  readonly isLoading = signal(false);

  readonly input = signal('');

  readonly messages = signal<ChatMessage[]>([
    {
      sender: 'bot',
      text:
        '👋 أهلاً بك في ByteZone!\n\n' +
        'أنا المساعد الذكي للمتجر 🤖\n\n' +
        'اسألني عن أي منتج، السعر أو الميزانية.\n\n' +
        'مثال:\n' +
        'عايز كارت شاشة للألعاب لحد $300',
    },
  ]);

  toggleChat(): void {
    this.isOpen.update((value) => !value);
  }

  sendMessage(): void {
    const message = this.input().trim();

    if (!message || this.isLoading()) {
      return;
    }

    this.messages.update((messages) => [
      ...messages,
      {
        sender: 'user',
        text: message,
      },
    ]);

    this.input.set('');
    this.isLoading.set(true);

    this.chatService.sendMessage(message).subscribe({
      next: (response) => {
        this.messages.update((messages) => [
          ...messages,
          {
            sender: 'bot',
            text: response.reply,
            products: response.products,
          },
        ]);

        this.isLoading.set(false);
      },

      error: () => {
        this.messages.update((messages) => [
          ...messages,
          {
            sender: 'bot',
            text: '❌ حصل خطأ أثناء الاتصال بالسيرفر. حاول مرة تانية.',
          },
        ]);

        this.isLoading.set(false);
      },
    });
  }

  addToCart(product: ChatResponse['products'][number]): void {
    this.cartService.addProduct(product).subscribe({
      next: () => {
        this.messages.update((messages) => [
          ...messages,
          {
            sender: 'bot',
            text: `🛒 تم إضافة ${product.name} إلى السلة بنجاح.`,
          },
        ]);
      },

      error: (error) => {
        this.messages.update((messages) => [
          ...messages,
          {
            sender: 'bot',
            text: `❌ ${error?.error?.message || 'تعذر إضافة المنتج إلى السلة.'}`,
          },
        ]);
      },
    });
  }
}
