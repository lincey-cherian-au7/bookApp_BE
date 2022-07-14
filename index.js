const express =  require('express');
const Joi = require('@hapi/joi');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());

const books =[
    {title :'Slient Night',id:1},
    {title :'Twilight',id:2},
    {title :'In the midst',id:3}
];


app.get('/',(req,res)=>{
    res.send('Welcome !!!!');
});
// ID
app.get('/api/book/:id',(req,res)=>{
    const book = books.find(c=>c.id === parseInt(req.params.id))
    if(!book)
        res.status(404).send('<h3>OOPS!!! Cant find the book you are looking for.</h3>');
    res.send(book);
})
app.get('/api/books',(req,res)=>{
    
    if(books.length===0)
        res.status(404).send('<h3>OOPS!!!No books available right now.</h3>');
    res.send(books);
})

// CREATE
app.post('/api/books',(req,res)=>{
    const {error} = validateRequest(req.body);
    if(error){
        res.status(404).send(error.details);
        return;
    }else{
        const book ={
            id:books.length+1,
            title:req.body.title
        }
        books.push(book);
    
    res.status(200).send(`Successfully added ${book.title}`);
    }
})


//UPDATE

app.put('/api/books/:id',(req,res)=>{
    const book =books.find(c=>c.id===parseInt(req.params.id));
    if(!book) res.status(404).send('<h3> Not found !!!!!</h3>');
    const {error} = validateRequest(req.body);
    if(error){
        req.status(404).send(error.details);
        return;
    }else{
        book.title= req.body.title;
    }
    res.status(200).send(`Successfully updated ${req.body.title}`);
})


//Delete
app.delete('/api/books/:id',(req,res)=>{
    const book = books.find(c=>c.id=== parseInt(req.params.id))
    if(!book) res.status(404).send('<h3> Not found !!!!!</h3>');
    const index = books.indexOf(book);
    books.splice(index,1);
    res.send(`Successfully deleted ${book}`);
})

function validateRequest(book){
    
    const schema =
        Joi.object({title:Joi.string().min(3).required()})
    
    return schema.validate(book);

}

const port = process.env.PORT||8080;
app.listen(port,()=>{
    console.log(`Connected to port ${port}`);
})