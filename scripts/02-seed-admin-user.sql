-- Create an admin user for testing
-- Password: AdminPass123!

INSERT INTO "User" (
    id,
    name,
    email,
    password,
    role,
    "guardianContact",
    "createdAt",
    "updatedAt"
) VALUES (
    'admin-user-001',
    'Admin User',
    'admin@trustride.com',
    '$2a$12$LQv3c1yqBw2LeOiMsiF/NO.gp.fUdkDxaJM5.jW5.8k5.5k5.5k5.5k',
    'admin',
    '+1-555-0199',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Create a regular test user
-- Password: UserPass123!

INSERT INTO "User" (
    id,
    name,
    email,
    password,
    role,
    "guardianContact",
    "createdAt",
    "updatedAt"
) VALUES (
    'test-user-001',
    'Test User',
    'user@trustride.com',
    '$2a$12$LQv3c1yqBw2LeOiMsiF/NO.gp.fUdkDxaJM5.jW5.8k5.5k5.5k5.5k',
    'user',
    '+1-555-0100',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;
