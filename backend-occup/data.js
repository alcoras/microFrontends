var faker = require('faker');

function gen() {
    var employees = []
    for (var id = 0; id < 50; id++) {
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
  

function ret()
{
    return { language: { lang: 'en'}, theme: { theme: ""}, occupations: gen() } 
}

module.exports = ret