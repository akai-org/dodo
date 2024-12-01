import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/database/entities/user.entity';
import { Repository, UpdateValuesMissingError } from 'typeorm';
import { EditUserDTO, ReturnUserDTO } from './dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async editMe(userId: number, editUserDto: EditUserDTO) {
        return this.userRepository.manager.transaction(async (transaction) => {
            const userToUpdate = await transaction
                .findOneByOrFail(UserEntity, {
                    id: userId,
                })
                .catch(() => {
                    throw new NotFoundException('User not found');
                });

            transaction.merge(UserEntity, userToUpdate, editUserDto);

            return await transaction
                .update(UserEntity, { id: userId }, { ...editUserDto })
                .then(() => plainToInstance(ReturnUserDTO, userToUpdate))
                .catch((error) => {
                    if (error instanceof UpdateValuesMissingError) {
                        throw new BadRequestException('Invalid body');
                    }
                    throw error;
                });
        });
    }

    async getUserById(userId: number) {
        return await this.userRepository
            .findOneByOrFail({ id: userId })
            .then((user) => plainToInstance(ReturnUserDTO, user))
            .catch(() => {
                throw new NotFoundException('User not found');
            });
    }
}
