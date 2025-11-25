const express =require('express')
const loginRouter = require('./src/login/loginsignup.js');
const timeSheetRouter = require('./src/timesheet/timesheet.js');
const registerRouter = require('./src/register/userregister.js')
const cors= require('cors');
const app = express();



app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(
    cors({
    origin:'*'
}));

app.options('*', cors());

app.use('/', loginRouter);
app.use('/register',registerRouter);
app.use('/api',timeSheetRouter);


app.listen(3001,()=>{
    console.log('server is runnig on port:3001')
}
)