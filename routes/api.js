/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('../models').Book

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res)=>{
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      try {
        const allBooks = await Book.find()
        res.json(allBooks)
      } catch (err) {
        console.log(err)      
      }
    })
    
    .post(async (req, res)=>{
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title){
        res.send("missing required field title")
        return;
      }

      //check if the name already exists, if not create new one, either way you're gonna return that book doc

      try {
        let bookResult = await Book.findOne({ title })
        if (!bookResult) {
          bookResult = new Book({ title })
          await bookResult.save()
        }
        res.json({
          _id: bookResult._id,
          title: bookResult.title,
        })

      } catch (err) {
        console.log(err)   
      }
      
    })
    
    .delete(async(req, res)=>{
      //if successful response will be 'complete delete successful'

      try {
        const result = await Book.deleteMany()
        if (!result) {
          res.send("something went wrong")
          return
        }

        res.send("complete delete successful")
        
      } catch (err) {
        console.log(err)       
      }
    });



  app.route('/api/books/:id')
    .get(async  (req, res)=>{
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      try {
        const bookResult = await Book.findById(bookid)
        if (!bookResult) {
          res.send("no book exists")
          return
        }
        res.json(bookResult)
        
      } catch (err) {
        console.log(err) 
        res.send("no book exists")
      }
      
    })
    
    .post(async (req, res)=>{
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!bookid){
        res.send("missing required field book_id")
        return
      }
      if(!comment){
        res.send("missing required field comment")
        return;
      }

      try {
        const bookResult = await Book.findById(bookid)
        if(!bookResult){
          res.send('no book exists')
          return;
        }
        bookResult.comments.push(comment)
        bookResult.commentcount = bookResult.comments.length
        await bookResult.save()
        res.json(bookResult)
      } catch (err) {
        console.log(err)
        res.send("no book exists")
      }

    })
    
    .delete(async (req, res)=>{
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const result = await Book.findByIdAndDelete(bookid)
        if(!result){
          res.send('no book exists')
          return;
        }
        res.send('delete successful')
      } catch (err) {
        console.log(err)
        res.send("no book exists")
      }
    });
  
};
