CREATE TABLE polaris_sms(
    id UUID PRIMARY KEY,
    body TEXT,
    from_number TEXT NOT NULL,
    to_number TEXT NOT NULL,
    data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);