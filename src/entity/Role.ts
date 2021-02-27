import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field((type) => ID)
    id: string;

    @Column()
    @Field({ nullable: false })
    name: string;

    

}
