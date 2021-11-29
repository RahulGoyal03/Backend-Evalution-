const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

const connect = () =>{
    return mongoose.connect("mongodb+srv://rahul:rahul03@cluster0.8acut.mongodb.net/job_portal")
}

const companySchema = new mongoose.Schema(
    {
        comapny_name : {type: String, require : true },
        established : {type: Number, require : true },
        head_office : {type: String, require : true },
    },{
        versionkey : false,
        timestamps : true
    }
)

const Company = mongoose.model("company",companySchema)

//.........Skill Schema.............//
const skillSchema = new mongoose.Schema(
    {
        skill : {type : String , require : true }
    },{
        versionKey : false,
        timestamps : true
    }

)
const Skill = mongoose.model("skill", skillSchema)

//........City Schema.............//

const citySchema = new mongoose.Schema(
    {
        city : {type : String , require : true }
    },{
        versionKey : false,
        timestamps : true
    }
)

const City = mongoose.model("city", citySchema)


//...............job Schema.............//

const jobSchema = new mongoose.Schema(
{
    role : {type : String , require : true},
    ratings : {type : Number , require : true},
    work_from_home : {type : String , require : false, default: "NO"},
    skills_id : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "skill",
        required : true
    }],
    company_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "company",
        required : true
    },city_id :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "city",
        required : true
    }
},{
    versionKey : false,
    timestamps : true
}
)

const Job = mongoose.model("job", jobSchema)

//...............company CRUD................//


app.post('/companies', async(req,res) =>{
    try{
        const company = await Company.create(req.body)
        return res.send(company)
    }catch(e){
        res.status(500).json({message : e.message})
    }
})
app.get('/companies', async (req, res) =>{
    try{
        const company = await Company.find().lean().exec()
        return res.send (company)
    }catch(e){
        res.status(500).json({message : e.message})
    }
})

//.............skills CRUD..........//

app.post('/skills', async(req,res) =>{
    try{
        const skill = await Skill.create(req.body)
        return res.send(skill)
    }catch(e){
        res.status(500).json({message : e.message})
    }
})

app.get('/skills', async (req, res) =>{
    try{
        const skill = await Skill.find().lean().exec()
        return res.send (skill)
    }catch(e){
        res.status(500).json({message : e.message})
    }
})
//............City CRUD.............//

app.post('/city', async(req,res) =>{
    try{
        const city = await City.create(req.body)
        return res.send(city)
    }catch(e){
        res.status(500).json({message : e.message})
    }
})
app.get('/city', async (req, res) =>{
    try{
        const city = await City.find().lean().exec()
        return res.send (city)
    }catch(e){
        res.status(500).json({message : e.message})
    }
})

//.............Jobs CRUD.............//
app.post('/jobs', async(req,res) =>{
    try{
        const job = await Job.create(req.body)
        return res.send(job)
    }catch(e){
        res.status(500).json({message : e.message})
    }
})
app.get('/jobs', async (req, res) =>{
    try{
        const job = await Job.find().lean().exec()
        return res.send (job)
    }catch(e){
        res.status(500).json({message : e.message})
    }
})

    //jobs sort by ratings

    app.get("/jobs/ratings", async (req,res) =>{
        try{
        const jobs = await Job.find().sort({ratings :1})

        return res.send(jobs)

        }catch(e){
     res.status(500).json({message : e.message})
      }

        })

  //jobs available for wfh

  app.get("/jobs/wfh", async (req,res) =>{
    try{
    const job = await Job.find({work_from_home: "Yes"})
    return res.send(job)


    }catch(e){
     res.status(500).json({message : e.message})
      }

    })

  //include particular skills and city
     app.get("/jobs/:id/:skill", async (req,res) =>{
  try {
  //console.log(req.params.skill)
    const jobs = await Job.find({city_id : req.params.id, skills_id : req.params.skill})
    .populate({path: 'city_id',select : 'city'})
    .lean().exec()
     //console.log(jobs)
    return res.send(jobs)

  }catch(e){
     res.status(500).json({message : e.message})
      }


    } )

  //Jobs having 2 Month notice period
  app.get('/jobs/np2', async (req,res) =>{

  try{
  const job = await Job.find({notice_period : "2 Months"}).lean().exec()
  return res.send(job)

  }catch(e){
     res.status(500).json({message : e.message})
}
})



app.listen(2000, async() => {
    await connect();
    console.log("Server Started")
})
