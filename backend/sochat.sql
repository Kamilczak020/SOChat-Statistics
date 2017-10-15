-- tables
-- Table: Messages
CREATE TABLE Messages (
    message_id int  NOT NULL,
    user_id int  NOT NULL,
    room_id int  NOT NULL,
    response_id int  NULL,
    body text NOT NULL,
    date date  NOT NULL,
    stars int  NOT NULL,
    CONSTRAINT Messages_pk PRIMARY KEY (message_id)
);

-- Table: Rooms
CREATE TABLE Rooms (
    room_id int  NOT NULL,
    CONSTRAINT Rooms_pk PRIMARY KEY (room_id)
);

-- Table: RoomsUsers
CREATE TABLE RoomsUsers (
    room_id int  NOT NULL,
    user_id int  NOT NULL,
    CONSTRAINT RoomsUsers_unique UNIQUE (room_id, user_id) NOT DEFERRABLE  INITIALLY IMMEDIATE
);

-- Table: Users
CREATE TABLE Users (
    user_id int  NOT NULL,
    name varchar(50)  NOT NULL,
    CONSTRAINT Users_pk PRIMARY KEY (user_id)
);

-- foreign keys
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

-- End of file.

