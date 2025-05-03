const express = require('express');
const router = express.Router();

module.exports = (con) => {
   router.post("/postData", (req, res) => {

      const  {
         supervisor_id, first_name, last_name, phone_num, email, department, organization
      } = req.body;

      const values = [
         supervisor_id, first_name, last_name, phone_num, email, department, organization
      ];
      const update_query = "INSERT INTO supervisor(supervisor_id,first_name,last_name,phone_num,email,department,organization) VALUES($1,$2,$3,$4,$5,$6,$7)";
      con.query(update_query, values, (err, result) => {
         if (err) {
            res.status(500).send(err);
         } else {
            res.send("Successful");
         }
      })
   });

   router.get("/fetchData", (req, res) => {
      const fetch_query = "SELECT * FROM supervisor";
      con.query(fetch_query, (err, result) => {
         if (err) {
            res.status(500).send(err);
         } else {
            res.send(result.rows);
         }
      });
   });

   router.get("/fetchDatabyId/:supervisor_id", (req, res) => {
      const supervisor_id = req.params.supervisor_id;
      const fetch_query = "SELECT * FROM supervisor WHERE supervisor_id=$1";
      con.query(fetch_query, [supervisor_id], (err, result) => {
         if (err) {
            res.status(500).send(err);
         } else {
            res.send(result.rows[0]);
         }
      })
   });


   router.put("/updateDatabyId/:supervisor_id", (req, res) => {
      const supervisor_id = req.params.supervisor_id;
      const {
         first_name, last_name, phone_num, email, department, organization
      } = req.body;

      const values = [
         first_name, last_name, phone_num, email, department, organization, supervisor_id
      ];
      const updateDatabyId = "UPDATE supervisor SET first_name = $1,   last_name = $2, phone_num = $3, email = $4, department = $5, organization = $6 WHERE supervisor_id = $7";
      con.query(updateDatabyId, values, (err, result) => {
         if (err) {
            res.status(500).send(err);
         } else {
            res.send("Updated");
         }
      });
   });

   router.delete("/deleteData/:supervisor_id", (req, res) => {
      const supervisor_id = req.params.supervisor_id;
      const delete_query = "DELETE FROM supervisor WHERE supervisor_id=$1";
      con.query(delete_query, [supervisor_id], (err, res) => {
         if (err) {
            res.status(500).send(err);
         } else {
            console.log("Deleted");
         }
      });
   });
   return router;
};

