CREATE TABLE polaris_sms(
id UUID PRIMARY KEY,
body TEXT,
from_number TEXT NOT NULL,
to_number TEXT NOT NULL,
data JSONB,
created_at TIMESTAMPTZ default NOW() NOT NULL,
updated_at TIMESTAMPTZ default NOW() not null,
deleted_at TIMESTAMPTZ
);