const assert = require('assert');
const server =  require('../server');
const request = require('request');
const fs = require('fs');

describe ('server tests', () => {
   let app;

   before(done => {
       app = server.listen(3000, done);
   });

   beforeEach(() => {
      console.log("New test is running");
   });

   afterEach(() => {
       console.log("Test is done, go to the next");
   });

    after(done => {
        app.close(done);
    });

    it('should return index.html', () => {
       request('http://localhost:3000', function(err, res, body){
           if (err) return done(err);

           const file = fs.readFileSync('public/index.html', {encoding: 'utf-8'});
           assert.equal(body, file);

           done();
       });
    });

});