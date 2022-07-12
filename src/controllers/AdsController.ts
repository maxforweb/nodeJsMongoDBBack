import express from 'express';
import { AdModel } from '../models';

class AdsController {

    index ( req: express.Request, res: express.Response ) {

        const reqId: string = req.params.id;
        // console.log( req );
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
        const sortValue = req.query.sort;
        let sortOption = {};

        switch (sortValue) {
            case 'NEW':
                sortOption = {createdAt: -1}
            
            case 'OLD':
                sortOption = {createdAt: 1}
            
            default: 
                sortOption = {}
        }
        console.log(sortOption)
        AdModel.find()
        .populate('owner', ['fullName', 'phone', 'avatar'])
        .sort(sortOption)
        .exec( function (err, ads) {            
            if ( err ) return res.json({
                message: 'error'
            })


            if ( !ads ) {
                return res.json({
                    message: 'empty'
                })
            }

            res.json(ads)
        })

        
    }

    create ( req: express.Request, res: express.Response ) {

        const postData = {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            address: req.body.adress,
            area: req.body.area,
            owner: req.body.owner
        }

        console.log(postData)

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
                    message : " An error was occured"
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

    getPostsByUser ( req: express.Request, res: express.Response ) {

        const userId = req.body.id;

        AdModel
            .find({owner: userId})
            .then( (posts) => {
                if ( !posts ) {
                    res.json({
                        status: 404,
                        message: "You have no any posts yet"
                    })

                    res.json({
                        status: 200, 
                        posts: posts
                    })
                }
            } )
            .catch( err => {
                res.json({
                    status: 400,
                    message: err
                });
            })

    }
    

}

export default AdsController