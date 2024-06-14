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

  app.post('/login', (req, res) => {
    console.log('intento de login');
    authenticate(req.body.username, req.body.password, (err, user) => {
      console.log('auntenticacion');
      if (err) {
        console.error('Authentication error:', err);
        return res.status(500).json({ success: false, message: 'Error interno del servidor' });
      }
      if (user) {
        console.log('usuario existe')
        req.session.regenerate(() => {
          req.session.username = user.username;
          res.json({ success: true });
        });
      } else {
        console.log('error de credenciales');
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }
    });
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
            res.json({ success: true });
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

  function authenticate(username, password, callback) {
    usersCollection.findOne({ username }, (err, user) => {
      if (err) return callback(err);
      if (!user) return callback(null, null);

      passwordModule({ password, salt: user.passwordSalt }, (err, pass, salt, hash) => {
        if (err) return callback(err);
        if (hash === user.password) return callback(null, user);
        callback(null, null);
      });
    });
  }
};

module.exports = { defineRoutes };
