import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { UserRejectsAllergen } from "../entity/UserRejectsAllergen"

export class UserRejectsAllergenController {

    private UserRejectsAllergenRepository = AppDataSource.getRepository(UserRejectsAllergen)

    async all(res: Response) {
        return this.UserRejectsAllergenRepository.find()
    }
    //one(userId: string, allergenId: string)
    // entradas: userId: id del usuario
    //           allergenId: id del alergeno
    // salidas: undefined - si es que no se encuentra el registro
    //          userReject - Registro encontrado
    async one(userId: string, allergenId: string, res: Response) {
        const userReject = await this.UserRejectsAllergenRepository.findOne({
            where: { userId: userId,
                     allergenId: allergenId
                    }
        })

        if (!userReject) {
            return undefined
        }
        return userReject
    }
    // Registros de un usuario en específico
    async byUser(id: string, res: Response){
        const userRejects = await this.UserRejectsAllergenRepository.find({
            where: { userId: id }
        })
        console.log(userRejects)
        if (userRejects === undefined || userRejects.length == 0){
            return []
        }
        return userRejects
    }
    // agregar o actualizar registro. si el usuario retracta su like o dislike, se borra el registro existente
    async create(userId, allergenIdList) {
        await this.removeByUser(userId)
        let addedRows = []
        for (var allergenId of allergenIdList){
            let newReject = await this.UserRejectsAllergenRepository.save({userId, allergenId})
            addedRows.push(newReject)
        }
        if (addedRows.length == 0){
            return []
        }
        return addedRows
    }
    // eliminar todos los registros de un usuario
    async removeByUser(id: string) {
        let userRejectToRemove = await this.UserRejectsAllergenRepository.find({ where: {userId: id }})

        if (userRejectToRemove === undefined || userRejectToRemove.length == 0) {
            return undefined
        }

        return this.UserRejectsAllergenRepository.remove(userRejectToRemove)
    }

    // eliminar todos los registros de un alergeno
    async removeByAllergen(id: string) {
        let userRejectToRemove = await this.UserRejectsAllergenRepository.find({ where: {allergenId: id }})

        if (userRejectToRemove === undefined || userRejectToRemove.length == 0) {
            return undefined
        }

        return this.UserRejectsAllergenRepository.remove(userRejectToRemove)
    }
}