import type { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, authorId: string) => {

    const result = await prisma.post.create({
        data : {
            ...data,
            authorId: authorId
        }
    })
    return result;
}

export const PostServices = {
    createPost
}
