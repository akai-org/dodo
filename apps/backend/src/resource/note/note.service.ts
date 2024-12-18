import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { NoteEntity } from 'src/database/entities/notes.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository, UpdateValuesMissingError } from 'typeorm';
import { editNoteDTO, NoteDTO } from './dto';

@Injectable()
export class NoteService {
    constructor(
        @InjectRepository(NoteEntity)
        private noteRepository: Repository<NoteEntity>,
    ) {}

    async fetchByUser(user: UserEntity) {
        const notes = await this.noteRepository.find({
            relations: ['user'],
            where: { user },
        });
        return plainToInstance(NoteDTO, notes);
    }

    async add(user: UserEntity, noteDto: NoteDTO) {
        if (!user)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        const newNote = this.noteRepository.create({ ...noteDto, user });

        return plainToInstance(NoteDTO, this.noteRepository.save(newNote));
    }

    async edit(userId: number, noteId: number, noteDto: editNoteDTO) {
        await this.noteRepository.manager.transaction(async (transaction) => {
            await transaction
                .findOneOrFail(NoteEntity, {
                    where: { id: noteId, user: { id: userId } },
                    relations: { user: true },
                })
                .catch(() => {
                    throw new NotFoundException("Event doesn't exist");
                });

            await transaction
                .update(NoteEntity, { id: noteId }, { ...noteDto })
                .catch((error) => {
                    if (error instanceof UpdateValuesMissingError)
                        throw new BadRequestException('Invalid body');

                    throw error;
                });
        });
    }
}
