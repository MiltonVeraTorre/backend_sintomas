// Interfaz que permite cambiar los Date en string, muy útil cuando se hereda de prisma que tipa las fechas como Date cuando en realidad las guarda como string

export type ChangeDateToString<T> = {
    [P in keyof T]: T[P] extends Date ? string : T[P];
};

export interface HasId {
    id: number;
}

export type OptionalExceptForId<T extends HasId> = Partial<T> & { id: T['id'] };