const path = require('path');
const pbkdf2 = require('pbkdf2-password');

const defineRoutes = (app, db) => {
  const usersCollection = db.collection('users');
  const passwordModule = pbkdf2();

  app.get('/', (req, res) => {
    res.redirect('/login');
  });

  app.get('/restricted', restrict, (req, res) => {
    res.send(`Wahoo! restricted area, click to <a href="/logout">logout</a>`);
  });

  app.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });


  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
  });

  app.post('/login', async (req, res) => {
    console.log('intento de login');
    const { username, password } = req.body;
  
    try {
      const userRecord = await usersCollection.findOne({ username });
  
      if (!userRecord) {
        console.log('error de credenciales 1');
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }
  
      passwordModule({ password, salt: userRecord.passwordSalt }, (err, pass, salt, hash) => {
        if (err) {
          console.error('Error comparing password:', err);
          return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
  
        if (hash !== userRecord.password) {
          console.log('error de credenciales 2');
          return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
  
        console.log('usuario existe');
        req.session.regenerate(() => {
          req.session.username = userRecord.username;
          console.log('logged');
          res.json({ success: true });
        });
      });
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  });
  

  app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
  });

  app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
      const userRecord = await usersCollection.findOne({ username });

      if (userRecord) {
        res.status(409).json({ success: false, message: 'El usuario ya existe' });
      } else {
        passwordModule({ password: password }, (err, pass, salt, hash) => {
          if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
          }
          usersCollection.insertOne({ username, password: hash, passwordSalt: salt }, (err, result) => {
            if (err) {
              console.error('Error registrando usuario:', err);
              return res.status(500).json({ success: false, message: 'Error interno del servidor' });
            }
            req.session.username = username;
            return res.json({ success: true, message: 'Usuario creado correctamente' });
          });
        });
      }
    } catch (error) {
      console.error('Error registrando usuario:', error);
      res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
  });

  function restrict(req, res, next) {
    if (req.session.username) {
      next();
    } else {
      req.session.error = 'Access denied!';
      res.redirect('/login');
    }
  }

  function authenticate(username) {
    usersCollection.findOne({ username }, (err, user) => {
      if (err) return callback(err);
      if (!user) return callback(null, null);
      return username;
    });
  }
  app.get('/check-auth', async (req, res) => {
    console.log(req.session.username);
    
    authenticate(req.session.username);
  });
};

module.exports = { defineRoutes };
