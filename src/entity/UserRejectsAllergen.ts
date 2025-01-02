import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Unique } from "typeorm"
import { Allergen } from "./Allergen"

@Entity()
@Unique(["userId", "allergenId"])
export class UserRejectsAllergen {

    @PrimaryColumn()
    userId: string

    @PrimaryColumn()
    allergenId: string

    @ManyToOne(()=>Allergen, allergen => allergen.userRejectsAllergen, {onDelete: "CASCADE"})
    @JoinColumn({name: "allergenId"})
    allergen: Allergen
}