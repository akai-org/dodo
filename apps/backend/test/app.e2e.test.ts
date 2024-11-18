import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { AuthDTO, RegisterDTO } from 'src/auth/dto';
import {
    CreateEventDTO,
    CreateEventExceptionDTO,
    EditEventDTO,
    EditEventExceptionDTO,
} from 'src/resource/event/dto';
import { editNoteDTO } from 'src/resource/note/dto';
import { CreateTaskDTO, EditTaskDTO } from 'src/resource/task/dto';
import { EditUserDTO } from 'src/resource/user/dto';
import { RecurrenceType } from 'src/types';

describe('App e2e test', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            }),
        );
        app.useGlobalInterceptors(
            new ClassSerializerInterceptor(app.get(Reflector), {
                strategy: 'excludeAll',
                excludeExtraneousValues: true,
            }),
        );

        await app.listen(5000);
        pactum.request.setBaseUrl('http://localhost:5000');
    });

    afterAll(async () => {
        await app.close();
    });

    describe('App Module', () => {
        it('Hello world', async () => {
            await pactum
                .spec()
                .get('/')
                .expectStatus(200)
                .expectBody('Hello World!');
        });
    });

    describe('Auth Module', () => {
        describe('Register', () => {
            const dto = new RegisterDTO(
                'stanley',
                's.mazik2002@gmail.com',
                'stachu02',
            );

            it('Should fail if no body', async () => {
                await pactum.spec().post('/auth/register').expectStatus(400);
            });

            it('Should fail if no username', async () => {
                await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody({
                        email: dto.email,
                        password: dto.password,
                    })
                    .expectStatus(400);
            });

            it('Should fail if no email', async () => {
                await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody({
                        username: dto.username,
                        password: dto.password,
                    })
                    .expectStatus(400);
            });

            it('Should fail if no password', async () => {
                await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody({
                        username: dto.username,
                        email: dto.email,
                    })
                    .expectStatus(400);
            });

            it('Should register correct user', async () => {
                await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody(dto)
                    .expectStatus(201)
                    .expectJsonSchema({
                        properties: {
                            accessToken: {
                                type: 'string',
                            },
                        },
                    });
            });

            it('Should fail if mail already used', async () => {
                await pactum
                    .spec()
                    .post('/auth/register')
                    .withBody(dto)
                    .expectStatus(409);
            });
        });

        describe('Login', () => {
            const dto = new AuthDTO('s.mazik2002@gmail.com', 'stachu02');

            it('Should fail if empty body', async () => {
                await pactum.spec().post('/auth/login').expectStatus(400);
            });

            it('Should fail if no email', async () => {
                await pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({ password: dto.password })
                    .expectStatus(400);
            });

            it('Should fail if no password', async () => {
                await pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({ email: dto.email })
                    .expectStatus(400);
            });

            it('Should fail if incorrect password', async () => {
                await pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({ email: dto.email, password: 'wrong_password' })
                    .expectStatus(401);
            });

            it("Should fail if user doesn't exist", async () => {
                await pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({
                        email: 'smazik@mail.com',
                        password: dto.password,
                    })
                    .expectStatus(404);
            });

            it('Should login correct user', async () => {
                await pactum
                    .spec()
                    .post('/auth/login')
                    .withBody(dto)
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            accessToken: {
                                type: 'string',
                            },
                        },
                    });
            });
        });

        it.todo('Google login');
    });

    describe('User Module', () => {
        beforeAll(async () => {
            await pactum
                .spec()
                .post('/auth/login')
                .withBody(new AuthDTO('admin@local.host', 'admin'))
                .stores('adminToken', 'accessToken');

            await pactum
                .spec()
                .post('/auth/login')
                .withBody(new AuthDTO('user@local.host', 'user'))
                .stores('userToken', 'accessToken');
        });

        describe('Get me', () => {
            it('Should fail if no token', async () => {
                await pactum.spec().get('/users/me').expectStatus(401);
            });

            it('Should return correct user', async () => {
                await pactum
                    .spec()
                    .get('/users/me')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                            role: { type: 'string' },
                        },
                    })
                    .expectJsonLike({
                        id: 1,
                        username: 'admin',
                        email: 'admin@local.host',
                        role: 'ADMIN',
                    });
            });
        });

        describe('Edit me', () => {
            const dto: EditUserDTO = {
                username: 'admin2',
                email: 'admin2@local.host',
            };

            it('Should fail if no token', async () => {
                await pactum.spec().patch('/users/me').expectStatus(401);
            });

            it('Should fail if no body', async () => {
                await pactum
                    .spec()
                    .patch('/users/me')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should successfully edit user', async () => {
                await pactum
                    .spec()
                    .patch('/users/me')
                    .withBearerToken('$S{adminToken}')
                    .withBody(dto)
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                            role: { type: 'string' },
                        },
                    })
                    .expectJsonLike({
                        id: 1,
                        username: 'admin2',
                        email: 'admin2@local.host',
                        role: 'ADMIN',
                    });
            });

            it('Should return edited user', async () => {
                await pactum
                    .spec()
                    .get('/users/me')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLike({
                        id: 1,
                        username: 'admin2',
                        email: 'admin2@local.host',
                        role: 'ADMIN',
                    });
            });
        });

        describe('Get User by Id', () => {
            it('Should fail if no token', async () => {
                await pactum.spec().get('/users/2').expectStatus(401);
            });

            it('Should fail if no user found', async () => {
                await pactum
                    .spec()
                    .get('/users/222')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should fail if user is not an admin', async () => {
                await pactum
                    .spec()
                    .get('/users/1')
                    .withBearerToken('$S{userToken}')
                    .expectStatus(403);
            });

            it('Should return correct user', async () => {
                await pactum
                    .spec()
                    .get('/users/2')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            username: { type: 'string' },
                            email: { type: 'string' },
                            role: { type: 'string' },
                        },
                    })
                    .expectJsonLike({
                        id: 2,
                        username: 'user',
                        email: 'user@local.host',
                        role: 'USER',
                    });
            });
        });
    });

    describe('Event Module', () => {
        describe('Add event', () => {
            const dto: CreateEventDTO = {
                name: 'event',
                startDate: new Date(2002, 9, 20),
                isFullDay: true,
            };

            it('Should fail if no token', async () => {
                await pactum.spec().post('/events').expectStatus(401);
            });

            it('Should fail if no body', async () => {
                await pactum
                    .spec()
                    .post('/events')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should fail if incomplete body', async () => {
                await pactum
                    .spec()
                    .post('/events')
                    .withBearerToken('$S{adminToken}')
                    .withBody({ description: 'description' })
                    .expectStatus(400);
            });

            it('Should add event', async () => {
                await pactum
                    .spec()
                    .post('/events')
                    .withBearerToken('$S{adminToken}')
                    .withBody(dto)
                    .expectStatus(201)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            startDate: { type: 'string' },
                            isFullDay: { type: 'boolean' },
                            createdById: { type: 'number' },
                        },
                    })
                    .expectJson({
                        ...dto,
                        id: 1,
                        startDate: `${dto.startDate.toISOString()}`,
                        createdById: 1,
                    })
                    .stores('eventDate', 'startDate');
            });
        });

        describe('Get User Events', () => {
            it('Should fail if no token', async () => {
                await pactum.spec().get('/events').expectStatus(401);
            });

            it("Should return user's tasks", async () => {
                await pactum
                    .spec()
                    .get('/events')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            startDate: { type: 'string' },
                            isFullDay: { type: 'boolean' },
                            createdById: { type: 'number' },
                        },
                    })
                    .expectJsonLength(1);
            });
        });

        describe('Get Event by id', () => {
            const dto = {
                id: 1,
                name: 'event',
                startDate: '$S{eventDate}',
                isFullDay: true,
                createdById: 1,
            };

            it('Should fail if no token', async () => {
                await pactum.spec().get('/events/1').expectStatus(401);
            });

            it('Should fail if incorrect user', async () => {
                await pactum
                    .spec()
                    .get('/events/1')
                    .withBearerToken('$S{userToken}')
                    .expectStatus(403);
            });

            it('Should fail if event not found', async () => {
                await pactum
                    .spec()
                    .get('/events/100')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should return event', async () => {
                await pactum
                    .spec()
                    .get('/events/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            startDate: { type: 'string' },
                            isFullDay: { type: 'boolean' },
                            createdById: { type: 'number' },
                        },
                    })
                    .expectJson({
                        ...dto,
                        description: null,
                        endDate: null,
                        recurrencePattern: null,
                    });
            });
        });

        describe('Edit event', () => {
            const dto: EditEventDTO = {
                name: 'event2',
                isFullDay: false,
            };

            it('Should fail if no token', async () => {
                await pactum.spec().patch('/events/1').expectStatus(401);
            });

            it('Should fail if incorrect user', async () => {
                await pactum
                    .spec()
                    .patch('/events/1')
                    .withBearerToken('$S{userToken}')
                    .withBody(dto)
                    .expectStatus(403);
            });

            it("Should fail if event doesn't exist", async () => {
                await pactum
                    .spec()
                    .patch('/events/100')
                    .withBearerToken('$S{adminToken}')
                    .withBody(dto)
                    .expectStatus(404);
            });

            it('Should update event', async () => {
                await pactum
                    .spec()
                    .patch('/events/1')
                    .withBearerToken('$S{adminToken}')
                    .withBody(dto)
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            startDate: { type: 'string' },
                            isFullDay: { type: 'boolean' },
                            createdById: { type: 'number' },
                        },
                    })
                    .expectBodyContains(dto.name)
                    .expectBodyContains(dto.isFullDay);
            });

            it('Should return updated event', async () => {
                await pactum
                    .spec()
                    .get('/events/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectBodyContains(dto.name)
                    .expectBodyContains(dto.isFullDay);
            });
        });

        describe('Delete event', () => {
            it('Should fail if no token', async () => {
                await pactum.spec().delete('/events/1').expectStatus(401);
            });

            it('Should fail if incorrect user', async () => {
                await pactum
                    .spec()
                    .delete('/events/1')
                    .withBearerToken('$S{userToken}')
                    .expectStatus(403);
            });

            it("Should fail if event doesn't exist", async () => {
                await pactum
                    .spec()
                    .delete('/events/999')
                    .withBearerToken('$S{userToken}')
                    .expectStatus(404);
            });

            it('Should delete event', async () => {
                await pactum
                    .spec()
                    .delete('/events/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(204);
            });

            it("Shouldn't return a deleted task", async () => {
                await pactum
                    .spec()
                    .get('/events/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should return 0 events', async () => {
                await pactum
                    .spec()
                    .get('/events')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(0);
            });
        });
    });

    describe('Event Recurrence', () => {
        const events = new Map<string, CreateEventDTO>([
            [
                'event1',
                {
                    name: 'event1',
                    description: 'Event 1',
                    startDate: new Date(2024, 2, 26),
                    isFullDay: true,
                },
            ],
            [
                'event2',
                {
                    name: 'event2',
                    description: 'Event 2',
                    startDate: new Date(2024, 2, 3, 14),
                    endDate: new Date(2024, 2, 3, 18),
                    isFullDay: false,
                },
            ],
            [
                'event3',
                {
                    name: 'event3',
                    description: 'Event 3',
                    startDate: new Date(2024, 0, 2),
                    endDate: new Date(2024, 0, 18),
                    isFullDay: true,
                    recurrencePattern: {
                        recurrenceType: RecurrenceType.DAILY,
                        separationCount: 2,
                    },
                },
            ],
            [
                'event4',
                {
                    name: 'event4',
                    description: 'Event 4',
                    startDate: new Date(2024, 3, 22),
                    endDate: new Date(2024, 11, 22),
                    isFullDay: true,
                    recurrencePattern: {
                        recurrenceType: RecurrenceType.MONTHLY,
                    },
                },
            ],
            [
                'event5',
                {
                    name: 'event5',
                    description: 'Event 5',
                    startDate: new Date(2024, 3, 22),
                    isFullDay: true,
                    recurrencePattern: {
                        recurrenceType: RecurrenceType.WEEKLY,
                        numberOfOccurrences: 15,
                    },
                },
            ],
            [
                'event6',
                {
                    name: 'event6',
                    description: 'Event 6',
                    startDate: new Date(2024, 8, 11),
                    isFullDay: true,
                    recurrencePattern: {
                        recurrenceType: RecurrenceType.MONTHLY,
                        numberOfOccurrences: 6,
                    },
                },
            ],
        ]);

        describe('Get events between dates', () => {
            beforeAll(async () => {
                for (const [key, event] of events.entries()) {
                    await pactum
                        .spec()
                        .post('/events')
                        .withBody(event)
                        .withBearerToken('$S{adminToken}')
                        .stores(`${key}Id`, 'id');
                }
            });

            it('Should fail if no token', async () => {
                await pactum.spec().get('/events/dates').expectStatus(401);
            });

            it('Should fail if no query', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should fail if incorrect query', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({ startDate: 'xx', endDate: 'XX' })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Date scenario 1', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-03-01',
                        endDate: '2024-03-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(2)
                    .expect((ctx) => {
                        for (const [key, value] of Object.entries(
                            events.get('event1') ?? {},
                        )) {
                            expect(ctx.res.body[0]).toHaveProperty(key);
                            expect(ctx.res.body[0][key]).toBe(
                                value instanceof Date
                                    ? value.toISOString()
                                    : value,
                            );
                        }
                        expect(ctx.res.body[0].createdById).toBe(1);
                        expect(ctx.res.body[0].eventDates).toHaveLength(1);
                    })
                    .expect((ctx) => {
                        for (const [key, value] of Object.entries(
                            events.get('event2') ?? {},
                        )) {
                            expect(ctx.res.body[1]).toHaveProperty(key);
                            expect(ctx.res.body[1][key]).toBe(
                                value instanceof Date
                                    ? value.toISOString()
                                    : value,
                            );
                        }
                        expect(ctx.res.body[1].createdById).toBe(1);
                        expect(ctx.res.body[0].eventDates).toHaveLength(1);
                    });
            });

            it('Date scenario 2', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-01-01',
                        endDate: '2024-01-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(1)
                    .expect((ctx) => {
                        for (const [key, value] of Object.entries(
                            events.get('event3') ?? {},
                        )) {
                            if (key === 'recurrencePattern') continue;
                            expect(ctx.res.body[0]).toHaveProperty(key);
                            expect(ctx.res.body[0][key]).toBe(
                                value instanceof Date
                                    ? value.toISOString()
                                    : value,
                            );
                        }
                        expect(ctx.res.body[0].createdById).toBe(1);
                        expect(ctx.res.body[0].eventDates).toHaveLength(6);
                    });
            });

            it('Date scenario 3', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-01-01',
                        endDate: '2025-12-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(6)
                    .expect((ctx) => {
                        for (const [key, value] of Object.entries(
                            events.get('event4') ?? {},
                        )) {
                            if (key === 'recurrencePattern') continue;
                            expect(ctx.res.body[3]).toHaveProperty(key);
                            expect(ctx.res.body[3][key]).toBe(
                                value instanceof Date
                                    ? value.toISOString()
                                    : value,
                            );
                        }
                        expect(ctx.res.body[3].createdById).toBe(1);
                        expect(ctx.res.body[3].eventDates).toHaveLength(9);
                    })
                    .expect((ctx) => {
                        for (const [key, value] of Object.entries(
                            events.get('event5') ?? {},
                        )) {
                            if (key === 'recurrencePattern') continue;
                            expect(ctx.res.body[4]).toHaveProperty(key);
                            expect(ctx.res.body[4][key]).toBe(
                                value instanceof Date
                                    ? value.toISOString()
                                    : value,
                            );
                        }
                        expect(ctx.res.body[4].createdById).toBe(1);
                        expect(ctx.res.body[4].eventDates).toHaveLength(15);
                    });
            });

            it('Date scenario 4', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-09-01',
                        endDate: '2025-06-30',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(2)
                    .expect((ctx) => {
                        for (const [key, value] of Object.entries(
                            events.get('event6') ?? {},
                        )) {
                            if (key === 'recurrencePattern') continue;
                            expect(ctx.res.body[1]).toHaveProperty(key);
                            expect(ctx.res.body[1][key]).toBe(
                                value instanceof Date
                                    ? value.toISOString()
                                    : value,
                            );
                        }
                        expect(ctx.res.body[1].createdById).toBe(1);
                        expect(ctx.res.body[1].eventDates).toHaveLength(6);
                    });
            });

            it.todo('Maybe add more in the future');
        });

        describe('Add event recurrence', () => {
            const dto: EditEventDTO = {
                recurrencePattern: {
                    recurrenceType: RecurrenceType.DAILY,
                    numberOfOccurrences: 3,
                },
            };

            it('Should return one occurrence', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-01-01',
                        endDate: '2024-12-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expect((ctx) => {
                        expect(ctx.res.body[0].eventDates).toHaveLength(1);
                    });
            });

            it('Should successfully add event recurrence', async () => {
                await pactum
                    .spec()
                    .patch('/events/$S{event1Id}')
                    .withBody(dto)
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectBodyContains(dto.recurrencePattern?.recurrenceType);
            });

            it('Should return correct amount of occurrences', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-01-01',
                        endDate: '2024-12-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expect((ctx) => {
                        expect(ctx.res.body[0].eventDates).toHaveLength(3);
                    });
            });
        });

        describe('Edit event recurrence', () => {
            const dto: EditEventDTO = {
                recurrencePattern: {
                    recurrenceType: RecurrenceType.WEEKLY,
                    numberOfOccurrences: 2,
                },
            };

            it('Should successfully edit event recurrence', async () => {
                await pactum
                    .spec()
                    .patch('/events/$S{event1Id}')
                    .withBody(dto)
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectBodyContains(dto.recurrencePattern?.recurrenceType);
            });

            it('Should return correct amount of occurrences', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-01-01',
                        endDate: '2024-12-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expect((ctx) => {
                        expect(ctx.res.body[0].eventDates).toHaveLength(2);
                    });
            });
        });

        describe('Remove event recurrence', () => {
            const dto: EditEventDTO = {
                deleteRecurrence: true,
            };

            it('Should successfully remove event recurrence', async () => {
                await pactum
                    .spec()
                    .patch('/events/$S{event1Id}')
                    .withBody(dto)
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200);
            });

            it('Should return correct amount of occurrences', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-01-01',
                        endDate: '2024-12-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expect((ctx) => {
                        expect(ctx.res.body[0].eventDates).toHaveLength(1);
                    });
            });
        });

        describe('Add event exception - reschedule', () => {
            const dto: CreateEventExceptionDTO = {
                isRescheduled: true,
                isCancelled: false,
                originalDate: new Date(2025, 0, 11),
                startDate: new Date(2025, 0, 16),
            };

            it('Should return correct amount of occurrences - pre', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2025-01-01',
                        endDate: '2025-01-14',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expect((ctx) => {
                        expect(ctx.res.body[0].eventDates).toHaveLength(1);
                    });
            });

            it('Should fail if no token', async () => {
                await pactum
                    .spec()
                    .post('/events/exceptions/$S{event6Id}')
                    .expectStatus(401);
            });

            it('Should fail if incorrect user', async () => {
                await pactum
                    .spec()
                    .post('/events/exceptions/$S{event6Id}')
                    .withBody(dto)
                    .withBearerToken('$S{userToken}')
                    .expectStatus(403);
            });

            it("Should fail if event/exception don't exist", async () => {
                await pactum
                    .spec()
                    .post('/events/exceptions/9999')
                    .withBody(dto)
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should fail if no body', async () => {
                await pactum
                    .spec()
                    .post('/events/exceptions/$S{event6Id}')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should fail if incomplete body', async () => {
                await pactum
                    .spec()
                    .post('/events/exceptions/$S{event6Id}')
                    .withBody({
                        isCancelled: dto.isCancelled,
                        originalDate: dto.originalDate,
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should add event exception', async () => {
                await pactum
                    .spec()
                    .post('/events/exceptions/$S{event6Id}')
                    .withBody(dto)
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(201)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            isCancelled: { type: 'boolean' },
                            isRescheduled: { type: 'boolean' },
                            originalDate: { type: 'string' },
                        },
                    })
                    .expectJsonLike({
                        ...dto,
                        originalDate: dto.originalDate.toISOString(),
                        startDate: dto.startDate?.toISOString(),
                    })
                    .stores('event6ExceptionId', 'id');
            });

            it('Should return correct exception', async () => {
                await pactum
                    .spec()
                    .get('/events/exceptions/$S{event6ExceptionId}')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLike({
                        ...dto,
                        originalDate: dto.originalDate.toISOString(),
                        startDate: dto.startDate?.toISOString(),
                    });
            });

            it('Should return correct amount of occurrences - post', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2025-01-01',
                        endDate: '2025-01-14',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(0);
            });
        });

        describe('Add event exception - cancel', () => {
            const dto: CreateEventExceptionDTO = {
                isRescheduled: false,
                isCancelled: true,
                originalDate: new Date(2024, 0, 5),
            };

            it('Should return correct amount of occurrences - pre', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-01-01',
                        endDate: '2024-01-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expect((ctx) => {
                        expect(ctx.res.body[0].eventDates).toHaveLength(6);
                    });
            });

            it('Should add event exception', async () => {
                await pactum
                    .spec()
                    .post('/events/exceptions/$S{event3Id}')
                    .withBody(dto)
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(201)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            isCancelled: { type: 'boolean' },
                            isRescheduled: { type: 'boolean' },
                            originalDate: { type: 'string' },
                        },
                    })
                    .expectJsonLike({
                        ...dto,
                        originalDate: dto.originalDate.toISOString(),
                    })
                    .stores('event3ExceptionId', 'id');
            });

            it('Should return correct exception', async () => {
                await pactum
                    .spec()
                    .get('/events/exceptions/$S{event3ExceptionId}')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLike({
                        ...dto,
                        originalDate: dto.originalDate.toISOString(),
                    });
            });

            it('Should return correct amount of occurrences - post', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2024-01-01',
                        endDate: '2024-01-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expect((ctx) => {
                        expect(ctx.res.body[0].eventDates).toHaveLength(5);
                    });
            });
        });

        describe('Get event exception', () => {
            const dto: CreateEventExceptionDTO = {
                isRescheduled: true,
                isCancelled: false,
                originalDate: new Date(2025, 0, 11),
                startDate: new Date(2025, 0, 16),
            };

            it('Should fail if no token', async () => {
                await pactum
                    .spec()
                    .get('/events/exceptions/$S{event6ExceptionId}')
                    .expectStatus(401);
            });

            it('Should fail if incorrect user', async () => {
                await pactum
                    .spec()
                    .get('/events/exceptions/$S{event6ExceptionId}')
                    .withBearerToken('$S{userToken}')
                    .expectStatus(403);
            });

            it('Should return correct event exception', async () => {
                await pactum
                    .spec()
                    .get('/events/exceptions/$S{event6ExceptionId}')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            isCancelled: { type: 'boolean' },
                            isRescheduled: { type: 'boolean' },
                            originalDate: { type: 'string' },
                            startDate: { type: 'string' },
                        },
                    })
                    .expectJsonLike({
                        ...dto,
                        originalDate: dto.originalDate.toISOString(),
                        startDate: dto.startDate?.toISOString(),
                    });
            });
        });

        describe('Edit event exception', () => {
            const dto: EditEventExceptionDTO = {
                isCancelled: true,
            };

            it('Should return correct amount of occurrences - pre', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2025-01-01',
                        endDate: '2025-01-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(1)
                    .expect((ctx) => {
                        expect(ctx.res.body[0].eventDates).toHaveLength(1);
                    });
            });

            it('Should fail if no token', async () => {
                await pactum
                    .spec()
                    .patch('/events/exceptions/$S{event6ExceptionId}')
                    .expectStatus(401);
            });

            it('Should fail if incorrect user', async () => {
                await pactum
                    .spec()
                    .patch('/events/exceptions/$S{event6ExceptionId}')
                    .withBody(dto)
                    .withBearerToken('$S{userToken}')
                    .expectStatus(403);
            });

            it("Should fail if event doesn't exist", async () => {
                await pactum
                    .spec()
                    .patch('/events/exceptions/9999')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should fail if no body', async () => {
                await pactum
                    .spec()
                    .patch('/events/exceptions/$S{event6ExceptionId}')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should successfully edit event exception', async () => {
                await pactum
                    .spec()
                    .patch('/events/exceptions/$S{event6ExceptionId}')
                    .withBody(dto)
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectBodyContains(dto.isCancelled);
            });

            it('Should return correct amount of occurrences - post', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2025-01-01',
                        endDate: '2025-01-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(0);
            });
        });

        describe('Delete event exception', () => {
            it('Should return correct amount of occurrences - pre', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2025-01-01',
                        endDate: '2025-01-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(0);
            });

            it('Should fail if no token', async () => {
                await pactum
                    .spec()
                    .delete('/events/exceptions/$S{event6ExceptionId}')
                    .expectStatus(401);
            });

            it('Should fail if incorrect user', async () => {
                await pactum
                    .spec()
                    .delete('/events/exceptions/$S{event6ExceptionId}')
                    .withBearerToken('$S{userToken}')
                    .expectStatus(403);
            });

            it("Should fail if event doesn't exist", async () => {
                await pactum
                    .spec()
                    .delete('/events/exceptions/999')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should successfully delete event exception', async () => {
                await pactum
                    .spec()
                    .delete('/events/exceptions/$S{event6ExceptionId}')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(204);
            });

            it('Should return no exceptions', async () => {
                await pactum
                    .spec()
                    .get('/events/exceptions/$S{event6ExceptionId}')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should return correct amount of occurrences - post', async () => {
                await pactum
                    .spec()
                    .get('/events/dates')
                    .withQueryParams({
                        startDate: '2025-01-01',
                        endDate: '2025-01-31',
                    })
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(1);
            });
        });
    });

    describe('Note Module', () => {
        describe('Add note', () => {
            const dto = {
                title: 'Note',
                body: 'This is a body',
                icon: 'icon',
                color: 'black',
            };

            it('Should fail if no token', async () => {
                await pactum.spec().post('/notes').expectStatus(401);
            });

            it('Should fail if no body', async () => {
                await pactum
                    .spec()
                    .post('/notes')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should fail if missing body props', async () => {
                await pactum
                    .spec()
                    .post('/notes')
                    .withBearerToken('$S{adminToken}')
                    .withBody({ color: dto.color, icon: dto.icon })
                    .expectStatus(400);
            });

            it('Should add a note', async () => {
                await pactum
                    .spec()
                    .post('/notes')
                    .withBearerToken('$S{adminToken}')
                    .withBody(dto)
                    .expectStatus(201)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            title: { type: 'string' },
                            body: { type: 'string' },
                            createdAt: { type: 'string' },
                            icon: { type: 'string' },
                            color: { type: 'string' },
                        },
                    })
                    .expectBodyContains(dto.title)
                    .expectBodyContains(dto.body)
                    .expectBodyContains(dto.icon)
                    .expectBodyContains(dto.color);
            });
        });

        describe('Get User Notes', () => {
            it('Should fail if no token', async () => {
                await pactum.spec().get('/notes').expectStatus(401);
            });

            it('Should return user notes', async () => {
                await pactum
                    .spec()
                    .get('/notes')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            title: { type: 'string' },
                            body: { type: 'string' },
                            createdAt: { type: 'string' },
                            icon: { type: 'string' },
                            color: { type: 'string' },
                        },
                    })
                    .expectJsonLength(1);
            });
        });

        describe('Edit note', () => {
            const dto: editNoteDTO = {
                title: 'Note2',
                body: 'This is a body - 2',
            };

            it('Should fail if no token', async () => {
                await pactum.spec().patch('/notes/1').expectStatus(401);
            });

            it('Should fail if no body', async () => {
                await pactum
                    .spec()
                    .patch('/notes/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should edit note', async () => {
                await pactum
                    .spec()
                    .patch('/notes/1')
                    .withBearerToken('$S{adminToken}')
                    .withBody(dto)
                    .expectStatus(200);
            });

            it('Should return correct note', async () => {
                await pactum
                    .spec()
                    .get('/notes')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            title: { type: 'string' },
                            body: { type: 'string' },
                            createdAt: { type: 'string' },
                            icon: { type: 'string' },
                            color: { type: 'string' },
                        },
                    })
                    .expectBodyContains(dto.title)
                    .expectBodyContains(dto.body);
            });
        });
    });

    describe('Task Module', () => {
        describe('Add task', () => {
            const dto: CreateTaskDTO = {
                name: 'test',
                description: 'description',
                isDone: false,
            };

            it('Should fail if no token', async () => {
                await pactum.spec().post('/tasks').expectStatus(401);
            });

            it('Should fail if no body', async () => {
                await pactum
                    .spec()
                    .post('/tasks')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should fail if no name', async () => {
                await pactum
                    .spec()
                    .post('/tasks')
                    .withBearerToken('$S{adminToken}')
                    .withBody({ description: 'description', isDone: false })
                    .expectStatus(400);
            });

            it('Should create a task', async () => {
                await pactum
                    .spec()
                    .post('/tasks')
                    .withBearerToken('$S{adminToken}')
                    .withBody(dto)
                    .expectStatus(201)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            isDone: { type: 'boolean' },
                        },
                    })
                    .expectJson({
                        id: 1,
                        name: dto.name,
                        description: dto.description,
                        isDone: dto.isDone,
                    });
            });
        });

        describe("Get User's Tasks", () => {
            it('Should fail if no token', async () => {
                await pactum.spec().get('/tasks').expectStatus(401);
            });

            it("Should return user's tasks", async () => {
                await pactum
                    .spec()
                    .get('/tasks')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            isDone: { type: 'boolean' },
                        },
                    })
                    .expectJsonLength(1);
            });
        });

        describe('Get Task by id', () => {
            it('Should fail if no token', async () => {
                await pactum.spec().get('/tasks/1').expectStatus(401);
            });

            it('Should fail if task not found', async () => {
                await pactum
                    .spec()
                    .get('/tasks/100')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should return a task', async () => {
                await pactum
                    .spec()
                    .get('/tasks/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            isDone: { type: 'boolean' },
                        },
                    });
            });
        });

        describe('Edit Task', () => {
            const dto: EditTaskDTO = {
                id: 1,
                name: 'test2',
                description: 'description2',
                isDone: true,
            };

            it('Should fail if no token', async () => {
                await pactum.spec().patch('/tasks/1').expectStatus(401);
            });

            it('Should fail if no body', async () => {
                await pactum
                    .spec()
                    .patch('/tasks/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(400);
            });

            it('Should fail if no task id in body', async () => {
                await pactum
                    .spec()
                    .patch('/tasks/1')
                    .withBearerToken('$S{adminToken}')
                    .withBody({ name: dto.name, description: dto.description })
                    .expectStatus(400);
            });

            it("Should fail if ID in URL and body don't match", async () => {
                await pactum
                    .spec()
                    .patch('/tasks/1')
                    .withBearerToken('$S{adminToken}')
                    .withBody({ ...dto, id: 2 })
                    .expectStatus(400);
            });

            it("Should fail if task doesn't exist", async () => {
                await pactum
                    .spec()
                    .patch('/tasks/2')
                    .withBearerToken('$S{adminToken}')
                    .withBody({ ...dto, id: 2 })
                    .expectStatus(404);
            });

            it('Should edit task', async () => {
                await pactum
                    .spec()
                    .patch('/tasks/1')
                    .withBearerToken('$S{adminToken}')
                    .withBody(dto)
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            isDone: { type: 'boolean' },
                        },
                    })
                    .expectJson({
                        id: 1,
                        name: dto.name,
                        description: dto.description,
                        isDone: dto.isDone,
                    });
            });

            it('Should return an edited task', async () => {
                await pactum
                    .spec()
                    .get('/tasks/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonSchema({
                        properties: {
                            id: { type: 'number' },
                            name: { type: 'string' },
                            description: { type: 'string' },
                            isDone: { type: 'boolean' },
                        },
                    })
                    .expectJson({
                        id: 1,
                        name: dto.name,
                        description: dto.description,
                        isDone: dto.isDone,
                    });
            });
        });

        describe('Delete task', () => {
            it('Should fail if no token', async () => {
                await pactum.spec().delete('/tasks/1').expectStatus(401);
            });

            it('Should fail if task not found', async () => {
                await pactum
                    .spec()
                    .delete('/tasks/2')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should delete task', async () => {
                await pactum
                    .spec()
                    .delete('/tasks/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(204);
            });

            it("Shouldn't return a deleted task", async () => {
                await pactum
                    .spec()
                    .get('/tasks/1')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(404);
            });

            it('Should return no tasks', async () => {
                await pactum
                    .spec()
                    .get('/tasks')
                    .withBearerToken('$S{adminToken}')
                    .expectStatus(200)
                    .expectJsonLength(0);
            });
        });
    });

    describe('Search Module', () => {
        it.todo('Add search module e2e tests');
    });
});
