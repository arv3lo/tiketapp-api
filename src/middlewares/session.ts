// in case we need server-side session, use this

// import session from "express-session"
// import MongoStore from "connect-mongo"

// import { DB_URI } from "@/config/db"

// export default session({
//     name: "sid",
//     secret: Bun.env.AUTH_TOKEN_SECRET || "",
//     resave: false,
//     saveUninitialized: false,
//     rolling: true,

//     store: MongoStore.create({
//         mongoUrl: DB_URI,
//         collectionName: "sessions",
//         ttl: 60 * 60 * 24 * 7,
//         autoRemove: "native",
//     }),

//     cookie: {
//         httpOnly: true,
//         secure: Bun.env.NODE_ENV === "production",
//         sameSite: "lax",
//         maxAge: 1000 * 60 * 60 * 24 * 7,
//     }
// })