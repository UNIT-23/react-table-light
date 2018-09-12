var faker = require('faker')

function generateEmployees() {
    let employees = []
    for (let id = 0; id < 50; id++) {
        let firstName = faker.name.firstName()
        let lastName = faker.name.lastName()
        let email = faker.internet.email()
        let isActive = faker.random.boolean()
        employees.push({
            id,
            firstName,
            lastName,
            email,
            isActive
        })
    }
    return {
        employees
    }
}
module.exports = generateEmployees