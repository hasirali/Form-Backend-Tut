const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./modals/user');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/read', async (req, res) => {
    try {
        let users = await userModel.find();
        res.render('read', { users });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error reading users');
    }
});

app.post('/create', async (req, res) => {
    try {
        let { name, email, image } = req.body;
        let user = await userModel.create({
            name,
            email,
            image
        });
        
        console.log('User created successfully:', user);
        res.redirect('/read'); // Corrected redirection
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating user');
    }
});

app.post('/delete/:id', async (req, res) => {
    await userModel.findByIdAndDelete(req.params.id);
    res.redirect('/read');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
