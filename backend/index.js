
// /*
// * Auto generated Codehooks (c) example
// * Install: npm i codehooks-js
// */
// import {app} from 'codehooks-js'
// import {crudlify} from 'codehooks-crudlify'
// import {date, object, string, number, boolean} from 'yup';
// import jwtDecode from 'jwt-decode';

// // test route for https://<PROJECTID>.api.codehooks.io/dev/
// app.get('/', (req, res) => {
//   res.send('CRUD server ready')
// })

// // Use Crudlify to create a REST API for any collection
// app.crudlify()

// // bind to serverless runtime
// export default app.init();




/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import {date, object, string, number, boolean} from 'yup';
import jwtDecode from 'jwt-decode';

const review = object({
  name: string().required(),
  review: string(),
  rating: number().min(0).max(5),
  userId: string().required(),
  imageContent: string(),
  dateVisited: date().required(),
  address: string(),
})

const wishList = object({
  name: string().required(),
  note: string(),
  userId: string().required(),
  address: string(),
  createdOn: date().default(Date.now),
})

// This can largely be copy-pasted, it just grabs the authorization token and parses it, stashing it on the request.
const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace('Bearer ','');
      // NOTE this doesn't validate, but we don't need it to. codehooks is doing that for us.
      const token_parsed = jwtDecode(token);
      req.user_token = token_parsed;
    }
    next();
  } catch (error) {
    next(error);
  } 
}
app.use(userAuth)

// Use Crudlify to create a REST API for any collection
crudlify(app)

// bind to serverless runtime
export default app.init();
