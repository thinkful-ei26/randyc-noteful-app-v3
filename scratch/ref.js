'use strict';

//solution tests for REF
it('should return a list with the correct right fields', function () {
  return Promise.all([
    Note.find().sort({ updatedAt: 'desc' }),
    chai.request(app).get('/api/notes')
  ])
    .then(([data, res]) => { 
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(data.length);
      res.body.forEach(function (item, i) { //setup to compare each item in the res.body array to each item in the data array
        console.log('>>> ',i);
        console.log('>>> ',data[i].id);
        console.log('>>> ',data[i].title);
        expect(item).to.be.a('object'); //each item in the res.body array is an object
        expect(item).to.include.all.keys('id', 'title', 'createdAt', 'updatedAt'); //each item has these keys in the object
        expect(item.id).to.equal(data[i].id);//forEach looks at item.id and compares to an indexed array version of item in the form of the array data
        expect(item.title).to.equal(data[i].title);
        expect(item.content).to.equal(data[i].content);
        expect(new Date(item.createdAt)).to.deep.equal(data[i].createdAt);
        expect(new Date(item.updatedAt)).to.deep.equal(data[i].updatedAt);
      });
    });
});


it('should return correct search results for a searchTerm query', function () {
  const searchTerm = 'reasons';
  // const re = new RegExp(searchTerm, 'i');
  const dbPromise = Note.find({
    title: { $regex: searchTerm, $options: 'i' }
    // $or: [{ 'title': re }, { 'content': re }]
  });
  const apiPromise = chai.request(app)
    .get(`/api/notes?searchTerm=${searchTerm}`);

  return Promise.all([dbPromise, apiPromise])
    .then(([data, res]) => {

      console.log('>>> ',data);

      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.be.a('array');
      expect(res.body).to.have.length(1);
      res.body.forEach(function (item, i) {
        expect(item).to.be.a('object');
        expect(item).to.include.all.keys('id', 'title', 'createdAt', 'updatedAt');
        expect(item.id).to.equal(data[i].id);
        expect(item.title).to.equal(data[i].title);
        expect(item.content).to.equal(data[i].content);
        expect(new Date(item.createdAt)).to.deep.equal(data[i].createdAt);
        expect(new Date(item.updatedAt)).to.deep.equal(data[i].updatedAt);
      });
    });
});








