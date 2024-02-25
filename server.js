// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// // Stel het basis endpoint in
// const apiUrl = 'https://fdnd.directus.app/items'

// Haal alle squads uit de WHOIS API op
const squadData = await 
fetchJson('https://fdnd.directus.app/items/squad')

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))


// Maak een GET route voor de index
app.get('/', function (request, response) {

  // Haal alle personen uit de WHOIS API op
  fetchJson('https://fdnd.directus.app/items/person').then((apiData) => {
    // apiData bevat gegevens van alle personen uit alle squads
    // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

    // Render index.ejs uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
    response.render('index', {persons: apiData.data, squads: squadData.data})
  })

})


// Squad pagina
// Maak een GET route voor squad
// Haal alle personen uit de betreffende squad uit de WHOIS API op
// https://fdnd.directus.app/items/person/?filter={"squad_id":3}
// https://fdnd.directus.app/items/person/?filter={"squad_id":3}&sort=name
// How To Define Routes and HTTP Request Methods in Express https://www.digitalocean.com/community/tutorials/nodejs-express-routing

app.get('/squad', function (request, response) {
  fetchJson('https://fdnd.directus.app/items/person/?filter={"squad_id":3}').then((apiData) => {
    response.render('squad', {persons: apiData.data})
  })
})
// Maak een GET route voor squad met een request parameter id
app.get('/squad/:id', function (request, response) {

  const uri = 'https://fdnd.directus.app/items/person/'
  const squadId = request.params.id
  const filter = '?filter={"squad_id":'+squadId+'}'
  const sort = '' //'&sort=name'

    fetchJson(uri+filter+sort).then((apiData) => {
      response.render('squad', {persons: apiData.data})
    })
})


// GET person
// Maak een GET route voor een detailpagina met een request parameter id
app.get('/detail/:id', function (request, response) {
      
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson('https://fdnd.directus.app/items/person/' + request.params.id).then((apiData) => {
    // Render detail.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('detail', {person: apiData.data, squads: squadData.data})
  })
})


// POST Person
// Maak een POST route voor post data op een person
// How To Retrieve URL and POST Parameters with Express https://www.digitalocean.com/community/tutorials/use-expressjs-to-get-url-and-post-parameters
// Sending form data https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data

/*
  express.json() and express.urlencoded() 
  are built-in middleware functions to support JSON-encoded and URL-encoded bodies.
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/detail', function (request, response) {
  
    console.log(request.body)
    const user_id = request.body.id || 1;
    // const like = request.body.like || -1;
    // console.log(user_id)
    // console.log(like)

    // response.send({
    //   'user_id': user_id,
    //   'likes': like
    // });g
    
  // Na afhandelen van de POST, doe een redirect naar GET /person
  response.redirect('/detail/'+user_id)
})








// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
