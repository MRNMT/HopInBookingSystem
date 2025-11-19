import Accommodation from "../types/accommodation.type"
//pool

export const getAll = async (): Promise<Accommodation[]> => {
    //Todo

    return [];
}

export const getById = async (id: number): Promise<Accommodation | null> =>{
    //Todo
    return null;
}

export const update = async (id: number, data: Partial<Accommodation>): Promise<Accommodation | null> =>{
    //Todo
    return null;
}

export const deleteById = async (id: number) => {
    //Todo
}

export const create = async (data: Partial<Accommodation>): Promise<Accommodation | null> => {
    //Todo
    return null
}

