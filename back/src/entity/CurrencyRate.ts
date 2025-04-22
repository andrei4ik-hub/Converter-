import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class CurrencyRate {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name:"cur_id"})
    curId: number;

    @Column({name:"cur_date"})
    date: string;

    @Column({name:"cur_abbreviation"})
    curAbbreviation: string;

    @Column({name:"cur_scale"})
    curScale: number;

    @Column({name:"cur_name"})
    curName: string;

    @Column("float",{name:"cur_officcial_rate"})
    curOfficialRate: number;
}

