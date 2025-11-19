import User from "../types/user.type";


//pool

export const getAll = async (): Promise<User[]> => {
    //Todo

    return [];
}

export const getById = async (id: number): Promise<User | null> =>{
    //Todo
    return null;
}

export const update = async (id: number, data: Partial<User>): Promise<User | null> =>{
    //Todo
    return null;
}

export const deleteById = async (id: number) => {
    //Todo
}

export const create = async (data: Partial<User>): Promise<User | null> => {
    //Todo
    return null
}
