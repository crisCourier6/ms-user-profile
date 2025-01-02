import { NextFunction, Request, Response } from "express"
import { UserRatesFoodController } from "./UserRatesFoodController"
import { Channel } from "amqplib"
import { AllergenController } from "./AllergenController"
import { UserRejectsAllergenController } from "./UserRejectsAllergenController"


export class MainController{

    private readonly userRatesFoodController = new UserRatesFoodController
    private readonly allergenController = new AllergenController
    private readonly userRejectsAllergenController = new UserRejectsAllergenController
    // user rates food
    async userRatesFoodAll(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.userRatesFoodController.all(response)
    }
    async userRatesFoodAllByUser(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.userRatesFoodController.byUser(request.params.userId, response)
    }
    async userRatesFoodOne(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.userRatesFoodController.one(request.params.userId, request.params.allergenId, response)
    }
    async userRatesFoodSave(request: Request, response: Response, next: NextFunction, channel:Channel) {
        await this.userRatesFoodController.create(request.body)
        .then(result => {
            if (result){
                channel.publish("UserProfile", "user-rates-food.save", Buffer.from(JSON.stringify(request.body)))
            }
            response.send(result)
        })
    }
    async userRatesFoodRemove(request: Request, response: Response, next: NextFunction, channel:Channel){
        await this.userRatesFoodController.remove(request.body.userId, request.body.allergenId)
        .then(result => {
            if (result){
                channel.publish("UserProfile", "user-rates-food.remove", Buffer.from(JSON.stringify(request.body)))
            }
            else{
                response.status(400)
            }
            response.send(result)
        })
    }
    async userRatesFoodRemoveByUser(request: Request, response: Response, next: NextFunction, channel:Channel){
        return this.userRatesFoodController.removeByUser(request.params.userId)
    }
    async userRatesFoodRemoveByFood(request: Request, response: Response, next: NextFunction, channel:Channel){
        return this.userRatesFoodController.removeByFood(request.params.allergenId, response)
    }
    async userRatesFoodRatingsByFood(request: Request, response: Response, next: NextFunction, channel:Channel){
        return this.userRatesFoodController.ratingsByFood(request.params.allergenId, response)
    }
    // allergen
    async allergenAll(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.allergenController.all()
    }
    async allergenOne(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.allergenController.one(request.params.id)
    }
    async allergenSave(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.allergenController.save(request.body)
    }
    async allergenUpdate(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.allergenController.update(request.params.allergenId, request.body)
    }
    async allergenRemove(request: Request, response: Response, next: NextFunction, channel:Channel){
        return this.allergenController.remove(request.params.allergenId)
    }
    // user rejects allergen
    async userRejectsAllergenAll(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.userRejectsAllergenController.all(response)
    }
    async userRejectsAllergenAllByUser(request: Request, response: Response, next: NextFunction, channel:Channel) {
        const userRejectsRows = await this.userRejectsAllergenController.byUser(request.params.userId, response)
        return this.allergenController.getAllbyIds(userRejectsRows)
    }
    async userRejectsAllergenOne(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.userRejectsAllergenController.one(request.params.userId, request.params.allergenId, response)
    }
    async userRejectsAllergenSave(request: Request, response: Response, next: NextFunction, channel:Channel) {
        return this.userRejectsAllergenController.create(request.params.userId, request.body.allergenIdList)
     
    }
    async userRejectsAllergenRemoveByUser(request: Request, response: Response, next: NextFunction, channel:Channel){
        return this.userRejectsAllergenController.removeByUser(request.params.userId)
    }
    async userRejectsAllergenRemoveByAllergen(request: Request, response: Response, next: NextFunction, channel:Channel){
        return this.userRejectsAllergenController.removeByAllergen(request.params.allergenId)
    }
}