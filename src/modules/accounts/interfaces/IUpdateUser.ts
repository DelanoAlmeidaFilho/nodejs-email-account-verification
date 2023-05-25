interface IUpdateUser {
    id: string;
    data: {
        name?: string;
        email?: string;
        password?: string;
        confirmationEmail?: boolean;
    };
}

export { IUpdateUser };
