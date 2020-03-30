var faker = require('faker');

function genOccupations() {
    var employees = []
    for (var id = 0; id < 1000; id++) {
      var occ = faker.commerce.department();
      var date = faker.date.past();
      employees.push({
        "id": id,
        "occupation": occ,
        "created_at": date,
      })
    }
    return employees;
}

function genPersonnel() {
  var personnel = []
  for (var id = 0; id < 1000; id++) {
    personnel.push({
      "id": id,
      "PersonDataID": id,
      "DateValue": faker.date.past(),
      "DocReestratorID": faker.random.number(1000),
      "Oklad": faker.random.number(),
      "Stavka": faker.random.number(),
      "PIP": faker.random.number(100),
      "KodDRFO": faker.random.word(),
      "DataPriyomu": faker.date.past(),
      "Posada": faker.random.word(),
      "PodatkovaPilga": faker.random.number(100)
    })
  }
  return personnel;
}

function ret() {
    return { 
      language: { lang: 'en'}, 
      theme: { theme: ''}, 
      occupations: genOccupations(),
      personnel: genPersonnel(),
    } 
}

module.exports = ret