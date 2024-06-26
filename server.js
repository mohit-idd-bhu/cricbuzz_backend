const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const PORT = process.env.port||3000;
const secret_key = 'my-secret-key';
app.use(bodyParser.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'mohitsrt',
    password: 'mohitsrt',
    database: 'cricbuzz_app'
});

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
      const decoded = jwt.verify(token, 'my-secret-key');
      req.userId = decoded.userId;
      next();
  } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
  }
};

const getTeams = async (team_name)=>{
  const query = `SELECT * FROM PLAYERS JOIN teams ON PLAYERS.team_id = TEAMS.team_id WHERE TEAMS.team_name = "${team_name}";`
  const team = await new Promise((resolve,reject)=>{
    pool.query(query,(err,res)=>{
      if(err) reject(err);
      else resolve(res);
    })
  });
  return team;
}

app.post('/api/admin/signup',(req,res)=>{

    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    pool.query('INSERT INTO USERS (username, password,email,is_admin) VALUES (?, ?, ?, ?)', 
    [username, password, email, true], (error, results, fields) => {
      if (error) {
        console.error('Error adding user:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      const user_id=results.insertId;
      res.status(201).json({ status: 'Admin added successfully' , userID: user_id});
    });
});

app.post('/api/admin/login', (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    pool.query('SELECT * FROM USERS WHERE username = ? AND password = ?', 
    [username, password], (error, results, fields) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      const user = results[0];
      const token = jwt.sign({ userId: user.id }, secret_key, {
        expiresIn: '1h',
        });
      res.status(200).json({ 
        status: 'Login successful', 
        userID: user.id,
        access_token: token
      });
    });
});

app.post('/api/matches',verifyToken, (req, res) => {

    const { team1, team2, date, venue } = req.body;

    if (!team1 || !team2 || !date || !venue) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    pool.query('INSERT INTO MATCHES (team1, team2, date, venue) VALUES (?, ?, ?, ?)', 
    [team1, team2, date, venue], (error, results, fields) => {
        if (error) {
        console.error('Error adding match:', error);
        return res.status(500).json({ error: 'Internal server error' });
        }
        const matchId = results.insertId;
        res.status(201).json({ message: 'Match added successfully', matchId: matchId });
    });

});

app.get('/api/matches', (req, res) => {
    pool.query('SELECT * FROM MATCHES', (error, results, fields) => {
        if (error) {
        console.error('Error retrieving match schedules:', error);
        return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json(results);
    });
});

app.get('/api/matches/:id',(req, res) => {
    const matchId = req.params.id;
    pool.query('SELECT * FROM MATCHES WHERE match_id = ?', 
    [matchId], async (error, results, fields) => {
      if (error) {
        console.error('Error retrieving match schedule:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }
      results=results[0];
      team1=results.team1;
      team2=results.team2;
      const squad1 = await getTeams(team1);
      const squad2 = await getTeams(team2);
      results['squad1']=squad1;
      results['squad2']=squad2;
      const today = new Date();
      const match_date = results.date;
      if(match_date>today) results['status']="Upcoming";
      else results["status"] = "Completed";
      res.status(200).json(results);
    });
});

app.post('/api/teams/:team_id/squad', verifyToken,(req, res) => {

  const { team_id } = req.params;
  const {name,role} = req.body;

  pool.query('INSERT INTO PLAYERS (name, team_id, matches_played, runs, average,strike_rate) VALUES (?, ?, ?, ?,?,?)', 
  [name, team_id, 0, 0,0.0,0.0], (error, results, fields) => {
      if (error) {
      console.error('Error adding player:', error);
      return res.status(500).json({ error: 'Internal server error' });
      }
      res.status(201).json({ message: 'Player added to squad successfully', playerID: results.insertId });
  });

});

app.get('/api/players/:player_id/stats',(req,res)=>{
  const {player_id} = req.params;
  pool.query('SELECT * FROM PLAYERS WHERE player_id = ?',
  [player_id],(err,results,field)=>{
    if(err){
      console.log(err);
      return res.status(500).json({message:"Internal Server Error"});
    }
    if(results.length===0){
      return res.status(404).json({message:"Player Not Found"});
    }
    res.status(200).json({message:results[0]});
  })
})

app.listen(PORT,()=>{
    console.log(`Server started on ${PORT}`);
})


