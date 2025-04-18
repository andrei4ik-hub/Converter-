import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CurrencyRate {
    @PrimaryGeneratedColumn()
    id: number = 0;

    @Column()
    Cur_ID: number = 0;

    @Column()
    Date: string = '';

    @Column()
    Cur_Abbreviation: string = '';

    @Column()
    Cur_Scale: number = 0 ;

    @Column()
    Cur_Name: string = '';

    @Column("float")
    Cur_OfficialRate: number = 0;
}

