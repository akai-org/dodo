import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decorators';
import {
    AddEventApi,
    AddEventExceptionApi,
    DeleteEventApi,
    DeleteExceptionApi,
    EditEventApi,
    EditExceptionApi,
    GetEventByIdApi,
    GetEventExceptionByIdApi,
    GetUserEventsApi,
    GetUserEventsBetweenDatesApi,
} from 'src/decorators/OpenAPI';
import {
    CreateEventDTO,
    CreateEventExceptionDTO,
    EditEventDTO,
    EditEventExceptionDTO,
    EventDatesDTO,
} from 'src/resource/event/dto';
import { EventService } from 'src/resource/event/event.service';

@UseGuards(JwtGuard)
@ApiTags('Events')
@Controller('events')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class EventController {
    constructor(private eventService: EventService) {}

    @Get()
    @GetUserEventsApi()
    async getUserEvents(@GetUser('id') userId: number) {
        return await this.eventService.fetchByUser(userId);
    }

    @Get('dates')
    @GetUserEventsBetweenDatesApi()
    async getUserEventsBetweenDates(
        @GetUser('id') userId: number,
        @Query() query: EventDatesDTO,
    ) {
        return await this.eventService.fetchBetweenDates(
            userId,
            new Date(query.startDate),
            new Date(query.endDate),
        );
    }

    @Get(':id')
    @GetEventByIdApi()
    async getEventById(
        @GetUser('id') userId: number,
        @Param('id') eventId: number,
    ) {
        return await this.eventService.fetchById(userId, eventId);
    }

    @Get('exceptions/:id')
    @GetEventExceptionByIdApi()
    async getEventExceptionById(
        @GetUser('id') userId: number,
        @Param('id') exceptionId: number,
    ) {
        return await this.eventService.fetchExceptionById(userId, exceptionId);
    }

    @Post()
    @AddEventApi()
    async addEvent(
        @GetUser('id') userId: number,
        @Body() eventDto: CreateEventDTO,
    ) {
        return await this.eventService.add(userId, eventDto);
    }

    @Post('exceptions/:id')
    @AddEventExceptionApi()
    async addEventException(
        @GetUser('id') userId: number,
        @Param('id') eventId: number,
        @Body() exceptionDto: CreateEventExceptionDTO,
    ) {
        return await this.eventService.addException(
            userId,
            eventId,
            exceptionDto,
        );
    }

    @Patch(':id')
    @EditEventApi()
    async editEvent(
        @GetUser('id') userId: number,
        @Param('id') eventId: number,
        @Body() editEventDto: EditEventDTO,
    ) {
        return await this.eventService.edit(userId, eventId, editEventDto);
    }

    @Patch('exceptions/:id')
    @EditExceptionApi()
    async editException(
        @GetUser('id') userId: number,
        @Param('id') exceptionId: number,
        @Body() editExceptionDto: EditEventExceptionDTO,
    ) {
        return await this.eventService.editException(
            userId,
            exceptionId,
            editExceptionDto,
        );
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    @DeleteEventApi()
    async deleteEvent(
        @GetUser('id') userId: number,
        @Param('id') eventId: number,
    ) {
        await this.eventService.delete(userId, eventId);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('exceptions/:id')
    @DeleteExceptionApi()
    async deleteException(
        @GetUser('id') userId: number,
        @Param('id') exceptionId: number,
    ) {
        await this.eventService.deleteException(userId, exceptionId);
    }
}
