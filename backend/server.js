import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import mongoose from 'mongoose'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
const allowedOrigins = [
  'http://localhost:5173',
  'https://sudoku-react-gamma.vercel.app'
];

app.use(cors({
  origin: allowedOrigins
}));

app.get('/api/sudoku', async (req, res) => {
  const level = req.query.level || "medium"
  try{
    const response = await fetch("https://www.youdosudoku.com/api", {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'},
      body : JSON.stringify({
        difficulty : level,
        solution : true,
        array : true
      })
    })
    const data = await response.json()
    res.json(data)
  }catch (err){
    res.status(500).json({err : err.message})
  }
})

app.get('/', (req, res) => {
  res.send('Serveur Express OK !')
})

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`)
})

mongoose.connect(process.env.MONGO_URI, {dbName : process.env.DB_NAME})
.then(() => console.log("MongoDB connecté"))
.catch(err => console.error('Erreur de connexion à MongoDb', err))

const leaderBoardSchema = mongoose.Schema({
  name : {type : String, required : true, maxlength : 20},
  time : {type : Number, required : true},
  level : {type : String, required : true, enum : ['easy', 'medium', 'hard']}
})

const LeaderBoard =  mongoose.model('LeaderBoard', leaderBoardSchema)

const addScore = async(req, res) => {
  const {time, level} = req.body
  try{
    const scores = await LeaderBoard.find({level}).sort({time : 1})
    if(scores.length >= 5){
      const worstScore = scores[scores.length-1]
      if(time < worstScore.time){
        await LeaderBoard.findByIdAndDelete(worstScore._id)
        await LeaderBoard.create({...req.body})
        return res.status(200).json({message : "Score remplacé"})
      } else {
        return res.status(200).json("Score pas assez bon")
      }
    } else {
      await LeaderBoard.create({...req.body})
      return res.status(200).json("Nouveau score ajouté")
    }
  }catch(err){
    return res.status(400).json({error : err.message})
  }
}

const getScore = async(req, res) => {
  const {level} = req.query
  try {
    if(!["easy", "medium", "hard"].includes(level)){
      return res.status(400).json({erreur : "Level invalide"})
    }
    const scores = await LeaderBoard.find({level}).sort({time : 1})
    return res.status(200).json(scores)
  } catch (err) {
    return res.status(400).json({erreur : err.message})
  }
}

app.get('/api/leaderboard', getScore)

app.post('/api/leaderboard', addScore) 