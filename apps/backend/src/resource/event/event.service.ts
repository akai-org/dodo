import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { EventEntity } from 'src/database/entities/event.entity';
import { EventExceptionEntity } from 'src/database/entities/event.exception.entity';
import { RecurrenceEntity } from 'src/database/entities/recurrence.entity';
import {
    CreateEventDTO,
    CreateEventExceptionDTO,
    EditEventDTO,
    EditEventExceptionDTO,
    ReturnEventDTO,
    ReturnEventExceptionDTO,
    ReturnEventWithDatesDTO,
} from 'src/resource/event/dto';
import { RecurrenceType } from 'src/types';
import { addDays, nextMonthWithDate } from 'src/utils';
import {
    IsNull,
    LessThanOrEqual,
    MoreThanOrEqual,
    Or,
    Repository,
    UpdateValuesMissingError,
} from 'typeorm';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(EventEntity)
        private readonly eventRepository: Repository<EventEntity>,
        @InjectRepository(RecurrenceEntity)
        private readonly recurrenceRepository: Repository<RecurrenceEntity>,
        @InjectRepository(EventExceptionEntity)
        private readonly exceptionRepository: Repository<EventExceptionEntity>,
    ) {}

    async fetchById(userId: number, eventId: number) {
        return await this.eventRepository
            .findOneOrFail({
                where: { id: eventId, createdById: userId },
                relations: { recurrencePattern: true },
            })
            .then((event) => plainToInstance(ReturnEventDTO, event))
            .catch(() => {
                throw new NotFoundException('Event not found');
            });
    }

    async fetchByUser(userId: number) {
        const events = await this.eventRepository.find({
            where: { createdById: userId },
            relations: { recurrencePattern: true, eventExceptions: true },
        });
        return plainToInstance(ReturnEventDTO, events);
    }

    async fetchBetweenDates(userId: number, startDate: Date, endDate: Date) {
        const toFilter = await this.eventRepository.find({
            where: {
                createdById: userId,
                startDate: LessThanOrEqual(endDate),
                endDate: Or(IsNull(), MoreThanOrEqual(startDate)),
            },
            relations: { recurrencePattern: true, eventExceptions: true },
        });

        const filtered = toFilter.reduce(
            (filtered: ReturnEventWithDatesDTO[], event: EventEntity) => {
                const toReturn: ReturnEventWithDatesDTO = {
                    id: event.id,
                    name: event.name,
                    description: event.description,
                    startDate: event.startDate,
                    endDate: event.endDate,
                    isFullDay: event.isFullDay,
                    createdById: event.createdById,
                    eventDates: [],
                    eventExceptions: [],
                };

                if (event.eventExceptions != null) {
                    event.eventExceptions.forEach((exception) => {
                        const rescheduledConditions =
                            exception.isRescheduled &&
                            exception.originalDate <= endDate &&
                            (exception.endDate == null ||
                                exception.endDate >= startDate);
                        const cancelledConditions =
                            exception.isCancelled &&
                            exception.originalDate <= endDate;
                        if (rescheduledConditions || cancelledConditions) {
                            toReturn.eventExceptions?.push(exception);
                        }
                    });
                }

                if (event.recurrencePattern == null) {
                    if (event.startDate < startDate) return filtered;

                    toReturn.eventDates.push(
                        new Date(event.startDate).toLocaleDateString(),
                    );
                    filtered.push(toReturn);
                    return filtered;
                }

                let start = new Date(event.startDate);
                start.setHours(0, 0, 0, 0);
                const endFilter: number = event.endDate
                    ? Math.min(endDate.getTime(), event.endDate.getTime())
                    : endDate.getTime();
                const eventRecurrence = event.recurrencePattern.recurrenceType;
                const eventSeparation = event.recurrencePattern.separationCount;
                let eventCount =
                    event.recurrencePattern.numberOfOccurrences ??
                    Number.MAX_SAFE_INTEGER;
                const exceptionDates: string[] =
                    event.eventExceptions?.map((e) =>
                        e.originalDate.toLocaleDateString(),
                    ) ?? [];

                if (
                    eventRecurrence == RecurrenceType.DAILY ||
                    eventRecurrence == RecurrenceType.WEEKLY
                ) {
                    const freqInDays =
                        eventRecurrence == RecurrenceType.WEEKLY
                            ? (eventSeparation + 1) * 7
                            : eventSeparation + 1;
                    if (start.getTime() < startDate.getTime()) {
                        const freqInMs = 24 * 60 * 60 * 1000 * freqInDays;
                        const shiftInMs =
                            (startDate.getTime() - start.getTime()) % freqInMs;
                        const oldStart = new Date(start);
                        start = new Date(
                            startDate.getTime() + freqInMs - shiftInMs,
                        );
                        eventCount -=
                            (start.getTime() - oldStart.getTime() - 1) /
                            freqInMs;
                    }
                    while (start.getTime() <= endFilter && eventCount-- > 0) {
                        if (
                            !exceptionDates.includes(start.toLocaleDateString())
                        )
                            toReturn.eventDates.push(
                                start.toLocaleDateString(),
                            );
                        start = addDays(start, freqInDays);
                    }
                    if (toReturn.eventDates.length > 0) filtered.push(toReturn);
                } else {
                    const toAdd =
                        eventRecurrence == RecurrenceType.YEARLY
                            ? (eventSeparation + 1) * 12
                            : eventSeparation + 1;
                    while (start.getTime() < startDate.getTime()) {
                        start = nextMonthWithDate(start, toAdd);
                    }
                    while (start.getTime() <= endFilter && eventCount-- > 0) {
                        if (
                            !exceptionDates.includes(start.toLocaleDateString())
                        )
                            toReturn.eventDates.push(
                                start.toLocaleDateString(),
                            );
                        else {
                            const exception = event.eventExceptions?.find(
                                (e) =>
                                    e.originalDate.toLocaleDateString() ===
                                    start.toLocaleDateString(),
                            );
                            if (
                                exception?.isRescheduled &&
                                !exception?.isCancelled &&
                                (exception.startDate?.getTime() ?? 0) <
                                    endDate.getTime() &&
                                (exception.endDate?.getTime() ??
                                    Number.MAX_SAFE_INTEGER) >
                                    startDate.getTime()
                            ) {
                                toReturn.eventDates.push(
                                    exception.startDate?.toLocaleDateString() ??
                                        '',
                                );
                            }
                        }
                        start = nextMonthWithDate(start, toAdd);
                    }
                    if (toReturn.eventDates.length > 0) filtered.push(toReturn);
                }

                return filtered;
            },
            [],
        );

        return plainToInstance(ReturnEventWithDatesDTO, filtered);
    }

    async fetchExceptionById(userId: number, exceptionId: number) {
        return await this.exceptionRepository
            .findOneOrFail({
                where: { id: exceptionId, mainEvent: { createdById: userId } },
                relations: { mainEvent: true },
            })
            .then((exception) =>
                plainToInstance(ReturnEventExceptionDTO, exception),
            )
            .catch(() => {
                throw new NotFoundException('Exception not found');
            });
    }

    async add(userId: number, eventDto: CreateEventDTO) {
        const event = this.eventRepository.create({
            ...eventDto,
            createdById: userId,
        });
        await this.eventRepository.insert(event);
        if (event.recurrencePattern !== undefined)
            await this.recurrenceRepository.insert({
                ...event.recurrencePattern,
                eventId: event.id,
            });
        return plainToInstance(ReturnEventDTO, event);
    }

    async addException(
        userId: number,
        eventId: number,
        exceptionDto: CreateEventExceptionDTO,
    ) {
        return await this.eventRepository.manager.transaction(
            async (transaction) => {
                await transaction
                    .findOneByOrFail(EventEntity, {
                        id: eventId,
                        createdById: userId,
                    })
                    .catch(() => {
                        throw new NotFoundException('Event not found');
                    });

                const exception = transaction.create(EventExceptionEntity, {
                    ...exceptionDto,
                    mainEventId: eventId,
                });
                await transaction.insert(EventExceptionEntity, exception);
                return plainToInstance(ReturnEventExceptionDTO, exception);
            },
        );
    }

    async edit(userId: number, eventId: number, editEventDto: EditEventDTO) {
        return await this.eventRepository.manager.transaction(
            async (transaction) => {
                const eventToUpdate = await transaction
                    .findOneOrFail(EventEntity, {
                        where: { id: eventId, createdById: userId },
                    })
                    .catch(() => {
                        throw new NotFoundException('Event not found');
                    });

                if (editEventDto.deleteRecurrence) {
                    await transaction.delete(RecurrenceEntity, { eventId });
                    delete editEventDto.recurrencePattern;
                }
                delete editEventDto.deleteRecurrence;

                if (editEventDto.recurrencePattern)
                    editEventDto.recurrencePattern.eventId = eventId;

                transaction.merge(EventEntity, eventToUpdate, editEventDto);
                await transaction.save(EventEntity, eventToUpdate);

                return plainToInstance(ReturnEventDTO, eventToUpdate);
            },
        );
    }

    async editException(
        userId: number,
        exceptionId: number,
        editExceptionDto: EditEventExceptionDTO,
    ) {
        return await this.eventRepository.manager.transaction(
            async (transaction) => {
                const exceptionToUpdate = await transaction
                    .findOneOrFail(EventExceptionEntity, {
                        where: {
                            id: exceptionId,
                            mainEvent: { createdById: userId },
                        },
                        relations: { mainEvent: true },
                    })
                    .catch(() => {
                        throw new NotFoundException('Exception not found');
                    });

                transaction.merge(
                    EventExceptionEntity,
                    exceptionToUpdate,
                    editExceptionDto,
                );
                return await transaction
                    .update(
                        EventExceptionEntity,
                        { id: exceptionToUpdate.id },
                        { ...editExceptionDto },
                    )
                    .then(() =>
                        plainToInstance(
                            ReturnEventExceptionDTO,
                            exceptionToUpdate,
                        ),
                    )
                    .catch((error) => {
                        if (error instanceof UpdateValuesMissingError) {
                            throw new BadRequestException('Invalid body');
                        }
                        throw error;
                    });
            },
        );
    }

    async delete(userId: number, eventId: number) {
        await this.exceptionRepository.manager.transaction(
            async (transaction) => {
                await transaction
                    .findOneByOrFail(EventEntity, {
                        id: eventId,
                        createdById: userId,
                    })
                    .catch(() => {
                        throw new NotFoundException('Event not found');
                    });

                await transaction.delete(EventEntity, {
                    id: eventId,
                });
            },
        );
    }

    async deleteException(userId: number, exceptionId: number) {
        await this.exceptionRepository.manager.transaction(
            async (transaction) => {
                await transaction
                    .findOneOrFail(EventExceptionEntity, {
                        where: {
                            id: exceptionId,
                            mainEvent: { createdById: userId },
                        },
                        relations: { mainEvent: true },
                    })
                    .catch(() => {
                        throw new NotFoundException('Exception not found');
                    });

                await transaction.delete(EventExceptionEntity, {
                    id: exceptionId,
                });
            },
        );
    }
}
