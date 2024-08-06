import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm"
import { UserRejectsAllergen } from "./UserRejectsAllergen"

@Entity()
export class Allergen {

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column({nullable:true})
    description: string

    @Column({nullable: true})
    wikidata: string

    @OneToMany(()=>UserRejectsAllergen, userRejectsAllergen=>userRejectsAllergen.allergen)
    userRejectsAllergen: UserRejectsAllergen[]
}