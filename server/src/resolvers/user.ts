import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import argon2 from "argon2";
import { UniqueConstraintViolationException } from "@mikro-orm/core/dist/exceptions";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@ObjectType()
class FieldError {
    @Field()
    field: String;

    @Field()
    message: String;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@Resolver()
export class UserResolver {

    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { req, em }: MyContext
    ): Promise<User | null> {

        if (!req.session!.userId) {
            return null;
        }

        try {
            const user = await em.findOne(User, { id: req.session!.userId });
            return user;
        } catch (error) {
            console.log(error.message);

            return null;
        }

    }

    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { req, em }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length < 3) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: "username length must be grater than 2"

                    }
                ]
            };
        }

        if (options.password.length < 3) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: "password length must be greater than 2"

                    }
                ]
            };
        }



        const pwd = await argon2.hash(options.password);
        const user = em.create(User, { username: options.username, password: pwd });

        try {
            await em.persistAndFlush(user);
        } catch (error) {
            console.log({ error });

            if (error instanceof UniqueConstraintViolationException) {
                return {
                    errors: [
                        {
                            field: 'username',
                            message: "This username already exists"
                        }
                    ]
                };
            }

            return {
                errors: [
                    {
                        field: 'unknown',
                        message: error.message
                    }
                ]
            };
        }
        req.session!.userId = user.id;
        return {
            user
        };
    };

    @Mutation(() => UserResponse)
    async login(
        @Arg('options') options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username });
        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: "That username does not exist"
                    }
                ]
            };
        }
        const valid = await argon2.verify(user.password, options.password);

        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: "incorrect password"
                    }
                ]
            };
        }
        req.session!.userId = user.id;
        return {
            user
        };

    };
}


