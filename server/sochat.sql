-- tables
-- Table: Messages
CREATE TABLE Messages (
    message_id int  NOT NULL,
    user_id int  NOT NULL,
    response_message_id int  NULL,
    room_id int  NOT NULL,
    text varchar(550)  NOT NULL,
    datetime timestamp  NOT NULL,
    stars int  NOT NULL,
    CONSTRAINT Messages_pk PRIMARY KEY (message_id)
);

-- Table: Rooms
CREATE TABLE Rooms (
    room_id int  NOT NULL,
    name varchar(150)  NOT NULL,
    description varchar(500)  NOT NULL,
    CONSTRAINT Rooms_pk PRIMARY KEY (room_id)
);

-- Table: RoomsUsers
CREATE TABLE RoomsUsers (
    room_id int  NOT NULL,
    user_id int  NOT NULL
);

-- Table: Users
CREATE TABLE Users (
    user_id int  NOT NULL,
    name varchar(50)  NOT NULL,
    CONSTRAINT Users_pk PRIMARY KEY (user_id)
);

-- foreign keys
-- Reference: Messages_Messages (table: Messages)
ALTER TABLE Messages ADD CONSTRAINT Messages_Messages
    FOREIGN KEY (response_message_id)
    REFERENCES Messages (message_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Messages_Users (table: Messages)
ALTER TABLE Messages ADD CONSTRAINT Messages_Users
    FOREIGN KEY (user_id)
    REFERENCES Users (user_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Rooms_Messages (table: Messages)
ALTER TABLE Messages ADD CONSTRAINT Rooms_Messages
    FOREIGN KEY (room_id)
    REFERENCES Rooms (room_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Rooms_UsersRooms (table: RoomsUsers)
ALTER TABLE RoomsUsers ADD CONSTRAINT Rooms_UsersRooms
    FOREIGN KEY (room_id)
    REFERENCES Rooms (room_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Users_UsersRooms (table: RoomsUsers)
ALTER TABLE RoomsUsers ADD CONSTRAINT Users_UsersRooms
    FOREIGN KEY (user_id)
    REFERENCES Users (user_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

