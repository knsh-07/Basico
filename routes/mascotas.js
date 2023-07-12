var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js');

/* Seleccionar mascotas*/
router.get('/', function (req, res) {
  connection.query('SELECT * FROM pacientes', function (error, results) {
    if (error) {
      console.log('Error en la consulta', error);
      res.status(500).send('Error en la consulta');
    } else {
      res.render('mascotas', {
        mascotas: results,
        opcion: 'disabled',
        estado: true,
      });
    }
  });
});

// Agregar mascotas

router.get('/agregar-mascota', (req, res) => {
  res.sendFile('registro-mascotas.html', { root: 'public' });
});

router.post('/agregar', (req, res) => {
  const cedula = req.body.cedula;
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const edad = req.body.edad;
  const telefono = req.body.telefono;
  connection.query(
    `INSERT INTO pacientes (cedula, nombre, apellido, edad, telefono) VALUES (${cedula},'${nombre}', '${apellido}', ${edad}, '${telefono}')`,
    (error, result) => {
      if (error) {
        console.log('Ocurrio un error en la ejecución', error);
        res.status(500).send('Error en la consulta');
      } else {
        res.redirect('/mascotas');
      }
    }
  );
});

// Actualizar mascotas

router.get('/activar', function (req, res) {
  connection.query('SELECT * FROM pacientes', function (error, results) {
    if (error) {
      console.log('Error en la consulta', error);
      res.status(500).send('Error en la consulta');
    } else {
      res.render('mascotas', { mascotas: results, opcion: '' });
    }
  });
});

router.post('/actualizar/:cedula', (req, res) => {
  const cedula = req.params.cedula;
  const nombre = req.body.nombre;
  const apellido = req.body.apellido;
  const edad = req.body.edad;
  const telefono = req.body.telefono;
  connection.query(
    `UPDATE pacientes SET nombre='${nombre}', apellido='${apellido}', edad=${edad}, telefono=${telefono} WHERE cedula=${cedula}`,
    (error, result) => {
      if (error) {
        console.log('Ocurrio un error en la ejecución', error);
        res.status(500).send('Error en la consulta');
      } else {
        res.redirect('/mascotas');
      }
    }
  );
});

// Eliminar mascotas

router.get('/eliminar/:cedula', (req, res) => {
  const cedula = req.params.cedula;
  connection.query(
    `DELETE FROM pacientes WHERE cedula=${cedula}`,
    (error, result) => {
      if (error) {
        console.log('Ocurrio un error en la ejecución', error);
        res.status(500).send('Error en la consulta');
      } else {
        res.redirect('/mascotas');
      }
    }
  );
});

module.exports = router;
