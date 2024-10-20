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
        const userToUpdate = await this.userRepository
            .findOneByOrFail({
                id: userId,
            })
            .catch(() => {
                throw new NotFoundException('User not found');
            });

        this.userRepository.merge(userToUpdate, editUserDto);
        try {
            await this.userRepository.update(
                {
                    id: userId,
                },
                {
                    ...editUserDto,
                },
            );
        } catch (error) {
            if (error instanceof UpdateValuesMissingError) {
                throw new BadRequestException('Invalid body');
            }
            throw error;
        }
        return plainToInstance(ReturnUserDTO, userToUpdate);
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
