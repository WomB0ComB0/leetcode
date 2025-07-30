declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BLUESKY_HANDLE: string;
            BLUESKY_PASSWORD: string;
        }
    }
}

export { }
