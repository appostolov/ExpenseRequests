# Expense Requests | Petar Apostolov

## Built & Run
1. Open Git Bash
2. Clone the repo `git clone https://github.com/appostolov/ExpenseRequests.git`
3. Run `cd ExpenseRequests/b` in Git Bash to navigate to the server location
4. Run `npm install` to load node modules ( package.json is in `ExpenseRequests/b` )
5. Run `node index.js` to start the back end server
6. Open `http://localhost:3000/` in the browser

## Overview
* Responsive SPA will be served as an GUI for interaction with simple RESTful API served via the same server.
* You can pick user, preview requests, create, save, edit, submit and approve.
* Refreshing the browser anywhere in the UI will restart you at the user picker.
* Restarting the server will reset the in-memory state of the back end.

## Stack

### Back-End
* JavaScript ES5
* NodeJS
* Express

### Front-End
* JavaScript ES5
* RequireJS
* Custom Vanilla JS Framework

### API
* HTTP
* JSON

### Data
* In memory

## Journey

### Stack
Not the prefered one.
I was afraid that my efforts would flow in adopting new technology and syntax rather than showing my thinking and building capacity.
My decision was influenced by assumtion for indirect acceptance of the technologies I prefer ("Use any stack", "plain JS", "any frontend/backend", "prefer TypeScript" as reference for JavaScript ).

### Data Design
I would create these and other tables, create relations and stay flexible to extend with new structures.

* user
    * id
    * name
    etc.
* request
    * id
    * user
    etc.
* event
    * request
    * user
    etc.
* approver
    * request
    * user
    etc.
* comment
    * request / event
    * text
    etc.

For the current task in-memory data storage is used.

### Back End
* b/index.js - NodeJS/Express middleware chain + server start
* b/routes - API endpoints order
* b/middlewares - initial routing, response handling, error management
* b/controllers - the API brain
* b/utils - tools and helpers
* b/data - DB

The cleaner and simple the BE is, maintainability and extension is easier. The logic separation and abstraction without overengineering will help us build faster and safer.

### Front End
Here I use lighter version of a FE framework I created in pure JavaScript.
Even if I import the cleared sceleton directly it is still wirtten by me and shows how I would build scalable product.

* The routing is handled by u/js/manager/URLManager and u/js/feature/Router
* The user picker is inside u/js/feature/user/
* The list with expense requests is here u/js/feature/request/List
* Detail in u/js/feature/detail
* Edit and Create are in u/js/feature/form

There is lot to talk about the FE framework

### Testing
Every functional increment tested manually. While bearable for training task, automatic tests are a must for professional app.

* Unit testing - I would go for 100% coverage, because it is fast to execute, flexible for different cases, easy to implement, portable - couplet to the unit only.
* Integration testing - perfect for critical flows, because proving the clientts point. I would be carefull with the coverage of all corner cases, cause they could become bigger burden than the product itself.
* E2E - works on my machine is not enough. We have to be shure we reach the customers and provide value.
* Performance - time is money, slow could mean does not work
* Security - protercting our customers is protecting us
* Usability - this is how we bring value
* Accesibility - it should be easy if the normal usage is simple enough

### UX
Intuitive, responsive single page application

* User picker is the initial route
* Requests List appear after user selection
* Events history shows on list entry click
* You can Edit, Submit, Approve, Reject from Detail
* Edit and Create(from List) open the Form
* Save and Submit can be executed from Form

### Timing
* 2 hours - Stack research ( TypeScript / React / Node )
* 3 hours - NodeJS / Express sceleton preparation from existing app
* 5 hours - BE implementation
* 2 hours - FE sceleton preparation from existing app
* 4 hours - FE foundation. Components, routing, structure, list, detail
* 5 hours - More modules and fixes up until fully functional app

# Conclusion
I am happy with the created product, but not satisfied how I followed the task instructions.
More abstract, architectural approach would fit better here, but at least we have working product and hand made code to discuss.
Thank you for the opportunity!
