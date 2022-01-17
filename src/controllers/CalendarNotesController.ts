import express from 'express';
import { CalendarNoteModel } from '../models';

class CalendarNoteController {

    async getAll ( req: express.Request, res: express.Response ) {
        CalendarNoteModel
            .find()
            .exec( function (err, notes) {
                if ( err ) return res.json({
                    message: 'error',
                    type: err
                })

                if ( !notes ) {
                    return res.json({
                        status: 404,
                        message: "Notes not found"
                    })
                }

                res.json(notes);
            } )
    }

    async deleteNote ( req: express.Request, res: express.Response ) {
        const noteId = req.params.id;

        CalendarNoteModel
            .findByIdAndRemove( {_id: noteId} )
            .then( note => {
                if ( note ) {
                    res.json({
                        message: ` Note deleted`,
                        status: 200
                    })
                }
            } )
            .catch( err => {
                res.json(err);
            }) 

    }

    async editNote ( req: express.Request, res: express.Response ) {
        const editedNoteId = req.body.id;
        const editedNoteValues = {
            type: req.body.type,
            content: req.body.content
        }
        
        const options = { new: true, upsert: true};

        CalendarNoteModel
            .findByIdAndUpdate(editedNoteId, editedNoteValues, options)
            .then( note => {
                if ( note ) {
                    res.json({
                        message: 'note updated',
                        status: 200,
                    })
                }

            })
            .catch( err => {
                res.json(err);
            })
    }

    async createNote ( req: express.Request, res: express.Response ) {
        const noteData = req.body;
        
        const model = new CalendarNoteModel(noteData);

        model
            .save()
            .then( (note: object) => {
                note ? res.json({message: note, status: 200}) : res.json({ message: 'err' });
            })
            .catch( (err: any) => {
                res.json(err)
            });
    }

}

export default CalendarNoteController;