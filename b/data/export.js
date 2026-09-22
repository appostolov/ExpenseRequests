const requests = require( './requests.json' );
const users = require( './users.json' );

module.exports = {
    requests: Object.fromEntries(
        requests.map(request => [request.id, request])
    ),
    users: Object.fromEntries(
        users.map(user => [user.id, user])
    )
};