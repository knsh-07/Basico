var express = require('express');
var router = express.Router();
const {connection} = require('../database/conexion.js')

/* Obtener citas medicas*/

router.get('/', function(req, res, next) {
  connection.query('SELECT c.id, c.fecha, pa.nombre, med.nombres, med.consultorio FROM pacientes pa INNER JOIN cita_medica c on pa.cedula = c.cedula_paciente INNER JOIN medicos med on c.cedula_medico = med.cedula; ', function(error, results) {
    if (error) {
      console.log("Error en la consulta citas medicas", error)
      res.status(500).send(`Error en la consulta citas medicas ${error}`);
    }else{
    res.render('citas', { citas: results });
    }
  });
});

//Agregar citas medicas

router.get('/agregar-cita', (req, res) =>{
  res.sendFile('registro-cita.html', {root: 'public'});
})

router.post('/agregar', (req, res) =>{
  const cedulaDuenio = req.body.cedula;
  const fecha = req.body.fecha;
  const especialidad = req.body.especialidad;

  connection.query(`SELECT cedula FROM medicos WHERE especialidad='${especialidad}';`, function(error, results) {
    if (error) {
      console.log("Error en la consulta, no hay medico", error)
      res.status(500).send("Error en la consulta, no hay medico");
    }
      const cedulaMedico = results[0]?.cedula;
      if(!cedulaMedico){
        res.status(500).send("Error en la consulta, la especialidad no se encuentra");
      }
      connection.query(`INSERT INTO cita_medica (cedula_paciente,cedula_medico, fecha) VALUES (${cedulaDuenio}, ${cedulaMedico}, '${fecha}')`, (error, result) => {
        if (error) {
          res.status(500).send("Error en la consulta, verifique la cedula");
          console.log("Ocurrio un error en la ejecución", error)
        }else{
          res.redirect('/citas');
        }
      });
  });
})

//Eliminar cita medica

router.get('/eliminar/:id', (req, res) => {
  const id = req.params.id;
  connection.query(`DELETE FROM cita_medica WHERE id=${id}`, (error, result) => {
    if (error) {
      console.log("Ocurrio un error en la ejecución", error)
      res.status(500).send("Error en la consulta");
    } else {
      res.redirect('/citas');
    }
  });
})

module.exports = router;
