import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import bcrypt from 'bcryptjs';
import { NewUserInput } from '../resolver/types/user-input';
import { Role } from '../entity/Role';

@Entity()
@ObjectType()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field((type) => ID)
    id: string;

    @Column()
    @Field({ nullable: false })
    firstName: string;

    @Column()
    @Field({ nullable: true })
    lastName?: string;

    @Column()
    @Field({ nullable: false })
    username: string;
    @Column()
    @Field({ nullable: false })
    email: string;

    @Column()
    @Field({ nullable: false })
    password: string;

    @Column()
    @Field()
    creationDate: Date;


    @ManyToMany(type => Role)
    @JoinTable()
    @Field(type => [Role])
    roles: Role[];
    constructor(data?: NewUserInput) {
        super();
        if(data){
            this.username = data.username;
            this.email = data.email;
            this.password = data.password;
            this.firstName = data.firstName;
            this.lastName = data.lastName;
        }
        
    }

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        // cheack if that password changing or not
        if (this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 4);
            } catch (e) {
                throw new Error('there are some issiue in the hash');
            }
        }
    }
    async isCorrectPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
