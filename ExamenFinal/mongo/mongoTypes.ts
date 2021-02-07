export interface UserSchema {
    email: string;
    role: string;
    password: string;
    token: string;
}

export interface CarSchema {
    enrollment: string;
    driver: string;
    available: boolean;
}

export interface JourneySchema {
    id: string;
    client: string;
    driver: string;
    car: string;
}