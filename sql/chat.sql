CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sender_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
); 

insert into chat (message, sender_id)
VALUES
('Hello everyone! How are you?', 114),
('I am good. Thanks for asking!', 22),
('Lets organize a meet up soon', 171); 