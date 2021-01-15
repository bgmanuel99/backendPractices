import { Collection, Database } from "https://deno.land/x/mongo@v0.12.1/mod.ts";
import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { PostSchema, UserSchema, CommentSchema } from "../mongo/mongoTypes.ts";
import { IContext } from "./resolversTypes.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

interface IAddPostArgs {
    input: {
        title: string;
        body: string;
    }
}

interface IDeletePostArgs {
    postTitle: string;
}

interface IAddCommentArgs {
    input: {
        postTitle: string;
        text: string;
    }
}

interface IDeleteCommentArgs {
    input: {
        postTitle: string;
        commentText: string;
    }
}

interface IAddUserArgs {
    input: {
        email: string;
        password: string;
        roles: string[];
    }
}

interface IDeleteUserArgs {
    email: string;
}

interface ILoginUserArgs {
    input: {
        email: string;
        password: string;
    }
}

export const mutations = {
    addPost: async (parent: any, args: IAddPostArgs, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const postCollection: Collection<PostSchema> = db.collection<PostSchema>("PostCollection")

            const { title, body } = args.input

            if (!context.user.roles.includes("AUTHOR")) throw new GQLError("You are not an author, you cannot add a post to the blog")

            const post: PostSchema | null = await postCollection.findOne({ title: title })
            if(post) throw new GQLError("There is already a post with that title inside the DDBB")
            
            const inserted = await postCollection.insertOne({
                title: title,
                body: body,
                postAuthor: context.user.email,
                comments: []
            })

            if (inserted) return true
            else throw new GQLError("There was a problem inserting the post into the DDBB")
        } catch (e){
            throw new GQLError(e)
        }
    },
    deletePost: async (parent: any, args: IDeletePostArgs, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const postCollection: Collection<PostSchema> = db.collection<PostSchema>("PostCollection")

            const post: PostSchema | null = await postCollection.findOne({ title: args.postTitle })
            if (!post) throw new GQLError("There is no post inside the DDBB with that title")
            
            if (context.user.roles.includes("EDITOR") || (context.user.email === post.postAuthor)) {
                const deleted = await postCollection.deleteOne({ title: args.postTitle })
                
                if (deleted) return true
                else throw new GQLError("There was a problem deleting the post")
            } else {
                throw new GQLError("You are not an editor nor the author of the post, you cannot delete it")
            }
        } catch (e) {
            throw new GQLError(e)
        }
    },
    addComment: async (parent: any, args: IAddCommentArgs, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const postCollection: Collection<PostSchema> = db.collection<PostSchema>("PostCollection")
            const commentCollection: Collection<CommentSchema> = db.collection<CommentSchema>("CommentCollection")

            const { postTitle, text } = args.input

            const post: PostSchema | null = await postCollection.findOne({ title: postTitle })
            if (!post) throw new GQLError("The post you are trying to comment doesnt exitst")

            if (!context.user.roles.includes("USER")) throw new GQLError("You are not a user, you cannot comment a post")
            
            let postComments: string[] = post.comments
            postComments.push(text)
            
            const updateInPost = await postCollection.updateOne(
                { title: postTitle },
                {
                    $set: {
                        comments: postComments
                    }
                }
            )

            if (updateInPost) {
                const inserted = await commentCollection.insertOne({
                    text: text,
                    commentAuthor: context.user.email,
                })

                if (inserted) return true
                else throw new GQLError("There was problem inserting the comment inside the DDBB")
            } else throw new GQLError("There was a problem updating the comment section of the post")
        } catch (e) {
            throw new GQLError(e)
        }
    },
    deleteComment: async (parent: any, args: IDeleteCommentArgs, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const postCollection: Collection<PostSchema> = db.collection<PostSchema>("PostCollection")
            const commentCollection: Collection<CommentSchema> = db.collection<CommentSchema>("CommentCollection")

            const { postTitle, commentText } = args.input

            const post: PostSchema | null = await postCollection.findOne({ title: postTitle })
            if (!post) throw new GQLError("There is no post inside the DDBB with that title")

            const comment: CommentSchema | null = await commentCollection.findOne({ text: commentText })
            if(!comment) throw new GQLError("That comment doesnt exist")
            
            let comments: string[] = post.comments

            if (context.user.roles.includes("EDITOR") || (context.user.email === comment.commentAuthor)) {
                const filteredComments = comments.filter((comment) => comment !== commentText)

                const updated = await postCollection.updateOne(
                    { title: postTitle },
                    {
                        $set: {
                            comments: filteredComments
                        }
                    }
                )

                if (updated) {
                    const deleted = await commentCollection.deleteOne({ text: commentText })

                    if (deleted) return true
                    else throw new GQLError("There was a problem deleting the comment from the DDBB")
                }else throw new GQLError("There was a problem updating the comments of the post")
            } else throw new GQLError("You are not an editor nor the user who wrote this comment, you cannot delete it")
        } catch (e) {
            throw new GQLError(e)
        }
    },
    addUser: async (parent: any, args: IAddUserArgs, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const { email, password, roles } = args.input

            const user: UserSchema | null = await userCollection.findOne({ email: email })
            if (user) throw new GQLError("There is already a user inside the DDBB with that email")
            
            if (roles.length === 0) throw new GQLError("You must provide at least one role for the user")

            for (const role of roles) {
                if(!["ADMIN", "USER", "AUTHOR", "EDITOR"].includes(role)) throw new GQLError("There are roles that doesnt match with the 4 specific ones for the blog")
            }
            
            const inserted = await userCollection.insertOne({
                email: email,
                password: password,
                roles: roles,
                token: "",
            })

            if (inserted) return true
            else throw new GQLError("There was a problem inserting the user into the DDBB")
        } catch (e) {
            throw new GQLError(e)
        }
    },
    login: async (parent: any, args: ILoginUserArgs, context: IContext): Promise<String> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const { email, password } = args.input

            const user: UserSchema | null = await userCollection.findOne({ $and: [{ email: email }, { password: password }] })
            if (!user) throw new GQLError("Wrong email or password")

            const token = v4.generate()
            
            const updatedToken = await userCollection.updateOne({ email: email }, { $set: { token: token} })
                
            if (updatedToken) return token
            else throw new GQLError("There was a problem logging in the user")
        } catch (e) {
            throw new GQLError(e)
        }
    },
    logout: async (parent: any, args: any, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: context.user.email, token: context.user.token })
            if(!user) throw new GQLError("Unexpected error")
            
            const updatedToken = await userCollection.updateOne({ email: context.user.email }, { $set: { token: ""} })

            if (updatedToken) return true
            else throw new GQLError("There was a problem logging out the user")
        } catch (e) {
            throw new GQLError(e)
        }
    },
    deleteUser: async (parent: any, args: IDeleteUserArgs, context: IContext): Promise<Boolean> => {
        try {
            const db: Database = context.db
            const userCollection: Collection<UserSchema> = db.collection<UserSchema>("UserCollection")

            const user: UserSchema | null = await userCollection.findOne({ email: args.email })
            if (!user) throw new GQLError("The user you are trying to delete doesnt exists")
            
            const deleted = await userCollection.deleteOne({ email: args.email })
            
            if (deleted) return true
            else throw new GQLError("There was a problem deleting the account")
        } catch (e) {
            throw new GQLError(e)
        }
    }
};
