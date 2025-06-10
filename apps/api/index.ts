import express from "express";
import { prisma } from "@repo/store";
const app = express();

app.use(express.json());

app.post('/website', async (req, res) => {
    const url = req.body.url;

    if(!url) {
        res.status(400).json({
            message : "url is missing"
        })
        return;
    }

    try {
        const newWebsite = await prisma.website.create({
            data : {
                url : req.body.url,
            }
        }) ;

        res.status(201).json({
            message : "Website successfully added to db",
            website : newWebsite
        });
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error",
            error : error
        });
    }
})

app.get('/status/:websiteId', (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            message : "Internal Server Error",
            error : error
        });
    }
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on PORT 3000");
})