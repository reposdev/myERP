const express = require('express');
const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/bilge', { useNewUrlParser: true });

// SCHEMA SETUP
// Burada her yeni teklifin nasıl kayıt edilmesini belirten şemayı oluşturuyoruz
const teklifSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    description: String,
    customer: String
});
const Teklif = mongoose.model('Teklif', teklifSchema);

// INDEX
app.get('/', (req, res) => {
    // Get all teklifs from DB
    Teklif.find({}, (err, allTeklifler) => {
        if (err) {
            console.log(err)
        } else {
            res.render('index', { teklifler: allTeklifler });
        }
    })
});

app.get('/yeniteklifler', (req, res) => {
    res.render('yeniteklif');
});


// Deneme için bir adet teklif create ediyorum, sonra bunu comment out edeceğim
// Teklif.create({
//     name: 'T203-154',
//     customer: 'Royal',
//     amount: 3450,
//     description: 'Tüm ürünler depoda'
// }, (err, teklif) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(teklif)
//     }
// })


// NEW

// CREATE
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/yeniteklif', (req, res) => {
    var name = req.body.name;
    var customer = req.body.customer;
    var amount = req.body.amount;
    var desc = req.body.description;
    var newTeklif = {name: name, customer: customer, amount: amount, description: desc};
    Teklif.create(newTeklif, (err, newlyCreatedTeklif) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

// SHOW
app.get('/:id', (req, res) => {
    Teklif.findById(req.params.id, (err, foundTeklif) => {
        if (err) {
            console.log(err)
        } else {
            res.render('show', { teklif: foundTeklif })
        }
    })
});





app.listen(port, (req, res) => {
    console.log(`Server Has Started on ${port}!`)
});
