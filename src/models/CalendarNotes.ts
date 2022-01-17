import mongoose, { Schema, Document } from 'mongoose';


export interface ICalendarNote extends Document {
    date: string,
    type: string,
    content: string,
}

const CalendarNoteSchema = new Schema ({
    date : {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
}) 

const CalendarNoteModel = mongoose.model<ICalendarNote>("CalendarNote", CalendarNoteSchema);

export default CalendarNoteModel;