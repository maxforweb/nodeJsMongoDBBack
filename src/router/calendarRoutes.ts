import { Router } from 'express';
import { CalendarNotesController } from '../controllers';

const calendarRouter = Router();
const CalendarNote = new CalendarNotesController();

// calendarRouter.get('/calendar-note/getAll', CalendarNote.getAll);
// calendarRouter.delete('/calendar-note/deleteNote/:id', CalendarNote.deleteNote);
// calendarRouter.post('/calendar-note/editNote/', CalendarNote.editNote);
// calendarRouter.post('/calendar-note/createNote/', CalendarNote.createNote);

export default calendarRouter;
