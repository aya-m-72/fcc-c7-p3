/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title:'book1'})
        .end((err,res)=>{
            assert.equal(res.status,200)
            assert.equal(res.type,'application/json')
            assert.equal(res.body.title,'book1')
            assert.property(res.body,'_id')
            done();
        })

      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .post("/api/books")
          .send({ title: "" })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "text/html")
            done()
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "application/json")
            assert.isArray(res.body)
            done()
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai
          .request(server)
          .get("/api/books/668bc10c143792001386931f")
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "text/html")
            done()
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
       chai
         .request(server)
         .get("/api/books/668bc688a7c9894e2c63a385")
         .end((err, res) => {
           assert.equal(res.status, 200)
           assert.equal(res.type, "application/json")
           assert.equal(res.body._id, "668bc688a7c9894e2c63a385")
           assert.property(res.body, "title")
           assert.property(res.body,'comments')
           assert.property(res.body, "commentcount")
           done()
         })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
          .request(server)
          .post("/api/books/668bc688a7c9894e2c63a385")
          .send({ comment: "testing comment addition to book to get" })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "application/json")
            assert.equal(res.body._id, "668bc688a7c9894e2c63a385")
            assert.property(res.body, "title")
            assert.property(res.body, "comments")
            assert.property(res.body, "commentcount")
            assert.isArray(res.body.comments, )
            assert.include(res.body.comments,'testing comment addition to book to get')
            done()
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai
          .request(server)
          .post("/api/books/668bc688a7c9894e2c63a385")
          .send({ comment: "" })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "text/html")
            done()
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai
          .request(server)
          .post("/api/books/668bc10c143792001386931f")
          .send({ comment: "testing comment addition to book to get" })
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "text/html")
            done()
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai
          .request(server)
          .delete("/api/books/668bc919a7c9894e2c63a38a")
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "text/html")
            done()
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai
          .request(server)
          .delete("/api/books/668bc10c143792001386931f")
          .end((err, res) => {
            assert.equal(res.status, 200)
            assert.equal(res.type, "text/html")
            done()
          })
      });

    });

  });

});
