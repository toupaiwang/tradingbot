import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, msgId: number, mint?: string, isBuy?: boolean) {
    const user = await this.userService.findUser(userId);
    if (user) {
      const message = this.messageRepository.create({
        user: { id: userId },
        msgId,
        mint,
        isBuy,
      });
      await this.messageRepository.save(message);
    }
  }

  async getData(userId: number, msgId: number) {
    const msg = await this.messageRepository.findOneBy({
      user: { id: userId },
      msgId,
    });
    if (msg) {
      return msg;
    } else {
      return null;
    }
  }
}
