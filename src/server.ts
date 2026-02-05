import app from "./app";
import { prisma } from "./lib/prisma"

async function main() {
    const port = process.env.PORT || 5000;

    try{

        await prisma.$connect();
        console.log("connected to the database successfully")
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`)
        })

        app.get('/',(req,res)=>{
            res.send("Hello from Post and Management API with Prisma and Postgres")
        })
        
    }
    catch(error){
        console.log(error)
        await prisma.$disconnect();
        process.exit(1);
    }
}
main()