export enum EVENT_STATUS {
    DRAFT = "draft",
    PUBLISHED = "published",
    CANCELLED = "cancelled"
}

export enum EVENT_TYPE {
    ANIMATION = "animation",
    MEETING = "meeting",
    WORKSHOP = "workshop",
    CONCERT = "concert",
    CONFERENCE = "conference",
    FESTIVAL = "festival",
    OTHER = "other"
}

export enum USER_ROLE {
    ADMIN = "admin",
    ORGANIZER = "organizer", // sponsors and organizers can occupy this role
    ATTENDEE = "attendee",
    ARTIST = "artist",
    SPONSOR = "sponsor",
}

export enum TICKET_STATUS {
    PENDING = "pending",
    PAID = "paid",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
    EXPIRED = "expired"
}

export enum PAYMENT_STATUS {
    PENDING = "pending",
    DONE = "done",
    CANCELLED = "cancelled",
    REFUNDED = "refunded",
}

export enum TICKET_ACTION {
    PAYMENT = "payment",
    CANCELATION = "cancelation",
    TRANSFER = "transfer"
}

export enum ERROR_MESSAGE {
    INVALID_INPUT = "Invalid input",
    INVALID_ID = "Invalid id",
    NOT_FOUND = "Not found",
    NOT_CREATED = "Not created",
    NOT_UPDATED = "Not updated",
    NOT_DELETED = "Not deleted",
    UNKNOWN_ERROR = "Unknown error occurred",
    LOGIN_ERROR = "Identifiant et/ou mot de passe invalide."
}

export enum AUTH_ERROR_MESSAGE {
    NO_TOKEN = "No token provided",
    INVALID_TOKEN = "Invalid token",
    UNAUTHORIZED = "Unauthorized access",
    FORBIDDEN = "Forbidden access"
}

export enum HISTORY_TYPE {
    AUTH_REGISTER = "register",
    AUTH_LOGIN = "login",
    AUTH_LOGOUT = "logout",
    AUTH_PASSWORD_RESET = "password reset",
    ENTRY_CREATION = "entry creation",
    ENTRY_UPDATE = "entry update",
    ENTRY_DELETE = "entry delete",
}

export enum HISTORY_OBJECT {
    USER = "User",
    EVENT = "Event",
    PAYMENT = "Payment",
    SETUP = "Setup",
    CATEGORY = "Category",
    TICKET = "Ticket",
    USER_TICKET_CATEGORY = "TicketCategory",
}


