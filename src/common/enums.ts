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
