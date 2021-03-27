import express from 'express';
import { AdModel } from '../models';

class AdsController {

    index ( req: express.Request, res: express.Response ) {

        const reqId: string = req.params.id;

        AdModel
        .find().or([ { owner: reqId }, { _id: reqId } ])
        .populate('owner')
        .exec( function (err, ads) {
            if ( err ) return res.json({
                message: 'not found'
            })

            res.json(ads)
        }) 
    }

    getAll ( req: express.Request, res: express.Response ) {
        
        AdModel.find()
        .exec( function (err, ads) {
            if ( err ) return res.json({
                message: 'error'
            })

            res.json(ads)
        })

        
    }

    create ( req: express.Request, res: express.Response ) {

        const postData = {
            title: req.body.title,
            subtitle: req.body.subtitle,
            price: req.body.price,
            address: req.body.address,
            area: req.body.area,
            owner: req.body.owner
        }

        const newAd = new AdModel( postData );

        newAd
            .save()
            .then( ( obj: any ) => {
                res.json( obj );
            } )
            .catch( err => {
                res.json( err )
            })

    }

    update ( req: express.Request, res: express.Response ) {
        const adId = req.params.id;
        
        const updateData = {...req.body};

        AdModel
            .findByIdAndUpdate( adId, updateData, { new: true } )
            .exec( function ( err, ad ) {
                if(err) return res.json({
                    message : " An error was "
                })

                res.json( ad );
            } )
    }

    delete ( req: express.Request, res: express.Response) {

        const id = req.params.id;

        AdModel
            .findOneAndRemove( {_id: id } )
            .then( ad => {
                if(ad) {
                    res.json({
                        message: `Ad ${ad.title} was deleted`
                    })
                }
            })
            .catch( err => {
                res.json({
                    message: err
                })
            })
    }
    

}

export default AdsController