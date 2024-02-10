CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE status_enum as ENUM ('active','doing','done');

CREATE TABLE IF NOT EXISTS app_user (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    username TEXT NOT NULL, 
    password TEXT NOT NULL,
    profile_image TEXT,
    bio TEXT
);

CREATE TABLE IF NOT EXISTS task (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    status status_enum NOT NULL,
    description TEXT,
    expiration TIMESTAMP,
    user_id UUID,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES app_user (id)
);

CREATE TABLE IF NOT EXISTS comment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
    content TEXT NOT NULL,
    created_date TIMESTAMP,
    modified_date TIMESTAMP,
    user_id UUID,
    task_id UUID,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES app_user (id),
    CONSTRAINT FK_task_id FOREIGN KEY (task_id) REFERENCES task (id)
);
