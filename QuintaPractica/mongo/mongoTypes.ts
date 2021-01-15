export interface PostSchema {
    _id: { $oid: string };
    title: string;
    body: string;
    postAuthor: string;
    comments: string[];
}

export interface UserSchema {
    _id: { $oid: string };
    email: string;
    password: string;
    roles: string[];
    token: string;
}

export interface CommentSchema {
    _id: { $oid: string };
    text: string;
    commentAuthor: string;
}
