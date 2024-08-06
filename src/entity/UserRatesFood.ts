import { Entity, PrimaryColumn, Column, Unique } from "typeorm"

@Entity()
@Unique(["userId", "foodLocalId"])
export class UserRatesFood {

    @PrimaryColumn()
    userId: string

    @PrimaryColumn()
    foodLocalId: string

    @Column()
    rating: string
}