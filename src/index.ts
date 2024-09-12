import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import * as amqp from "amqplib/callback_api"
import { Channel } from "amqplib"
import { UserRatesFoodController } from "./controller/UserRatesFoodController"
import { UserRejectsAllergenController } from "./controller/UserRejectsAllergenController"
import { Allergen } from "./entity/Allergen"
import { AllergenController } from "./controller/AllergenController"

AppDataSource.initialize().then(async () => {
    amqp.connect('amqps://zqjaujdb:XeTIDvKuWz8bHL5DHdJ9iq6e4CqkfqTh@gull.rmq.cloudamqp.com/zqjaujdb', (error0, connection) => {
        if(error0){
            throw error0
        }

        connection.createChannel(async (error1, channel)=>{
            if (error1){
                throw error1
            }
            const userRatesFoodController = new UserRatesFoodController
            const userRejectsAllergenController = new UserRejectsAllergenController
            const allergenController = new AllergenController

            channel.assertExchange("UserProfile", "topic", {durable: false})

            channel.assertExchange("FoodProfile", "topic", {durable: false})
            channel.assertExchange("Accounts", "topic", {durable: false})
            channel.assertExchange("FoodEdits", "topic", {durable: false})

            channel.assertQueue("UserProfile_UserRatesFood", {durable: false})
            channel.bindQueue("UserProfile_UserRatesFood", "FoodProfile", "user-rates-food.*")

            channel.assertQueue("UserProfile_Accounts", {durable: false})
            channel.bindQueue("UserProfile_Accounts", "Accounts", "user.*")

            channel.assertQueue("UserProfile_Allergen", {durable: false})
            channel.bindQueue("UserProfile_Allergen", "FoodEdits", "allergen.*")

            // create express app
            const app = express()
            app.use(bodyParser.json())
            // register express routes from defined application routes
            Routes.forEach(route => {
                (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                    const result = (new (route.controller as any))[route.action](req, res, next, channel)
                    if (result instanceof Promise) {
                        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

                    } else if (result !== null && result !== undefined) {
                        res.json(result)
                    }
                })
            })

            channel.consume("UserProfile_UserRatesFood", async (msg)=>{
                let action = msg.fields.routingKey.split(".")[1]
                let content = JSON.parse(msg.content.toString())
                if (action=="save"){
                    await userRatesFoodController.create(content)
                    .then(result=>{
                        console.log(result)
                    })
                }
                else if (action=="remove"){
                    await userRatesFoodController.remove(content.userId, content.foodLocalId)
                    .then(result=>{
                        console.log(result)
                    })
                }
            }, {noAck: true})

            channel.consume("UserProfile_Accounts", async (msg)=>{
                let action = msg.fields.routingKey.split(".")[1]
                let content = JSON.parse(msg.content.toString())
                if (action=="save"){
                    console.log("i shouldn't do this")
                }
                else if (action=="remove"){
                    console.log("i should delete all rows with userId = ", content)
                    await userRatesFoodController.removeByUser(content)
                    .then(result=>{
                        console.log(result)
                    })
                    await userRejectsAllergenController.removeByUser(content)
                    .then(result => {
                        console.log(result)
                    })
                }
                else if (action=="removeOne"){
                    await userRatesFoodController.remove(content.userId, content.foodLocalId)
                    .then(result=>{
                        console.log(result)
                    })
                }
            }, {noAck: true})

            channel.consume("UserProfile_Allergen", async (msg)=>{
                let action = msg.fields.routingKey.split(".")[1]
                let content = JSON.parse(msg.content.toString())
                if (action=="save"){
                    await allergenController.save(content)
                    .then(result => {
                        console.log(result)
                    })
                }
                else if (action=="update"){
                    await allergenController.update(content.id, content)
                    .then(result=>{
                        console.log(result)
                    })
                }
                else if (action=="remove"){
                    await allergenController.remove(content.id)
                    .then(result=>{
                        console.log(result)
                    })
                }
            }, {noAck: true})

            // setup express app here
            // ...

            // ******************* Poblado de la tabla de alérgenos *****************
            
            // const allergen = require('../allergen.json')
            // const allergenRepo = AppDataSource.getRepository(Allergen)
            // for (const [code, value] of Object.entries(allergen)){
            //     let name = value["name"]["es"]?value["name"]["es"]:value["name"]["en"]
            //     let wikidata = value["wikidata"]?value["wikidata"]["en"]:null
            //     let newAllergen = {
            //         id: code,
            //         name: name,
            //         wikidata: wikidata
            //     }
            //     allergenRepo.save(newAllergen)
            // }

            // start express server
            app.listen(3003)

            console.log("Express server has started on port 3003. Open http://localhost:3003/profile to see results")

            process.on("beforeExit", ()=>{
                console.log("closing")
                connection.close()
            })
        })
    })
    
}).catch(error => console.log(error))
