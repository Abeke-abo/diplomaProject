# RemoteP ER Diagram

This version is readable in Markdown and can be copied into a diploma document that supports Mermaid.

```mermaid
erDiagram
    USERS ||--o{ REFRESH_TOKENS : owns
    USERS ||--o{ CONTACT_REQUESTS : creates
    USERS ||--o{ CONTACT_REQUEST_COMMENTS : writes
    USERS ||--o{ CONTACT_REQUEST_STATUS_HISTORY : changes

    CONTACT_REQUESTS ||--o{ CONTACT_REQUEST_COMMENTS : has
    CONTACT_REQUESTS ||--o{ CONTACT_REQUEST_STATUS_HISTORY : has
    CONTACT_REQUESTS ||--o{ TELEGRAM_NOTIFICATIONS : logs

    USERS {
        bigint id PK
        varchar name
        varchar email UK
        varchar password_hash
        varchar role
        timestamp created_at
        timestamp updated_at
    }

    REFRESH_TOKENS {
        bigint id PK
        bigint user_id FK
        varchar token_hash UK
        timestamp expires_at
        timestamp revoked_at
        timestamp created_at
    }

    CONTACT_REQUESTS {
        bigint id PK
        bigint user_id FK
        varchar name
        varchar email
        text message
        varchar status
        varchar priority
        timestamp created_at
        timestamp updated_at
    }

    CONTACT_REQUEST_COMMENTS {
        bigint id PK
        bigint contact_request_id FK
        bigint admin_id FK
        text comment
        timestamp created_at
    }

    CONTACT_REQUEST_STATUS_HISTORY {
        bigint id PK
        bigint contact_request_id FK
        bigint changed_by_user_id FK
        varchar old_status
        varchar new_status
        timestamp created_at
    }

    TELEGRAM_NOTIFICATIONS {
        bigint id PK
        bigint contact_request_id FK
        varchar chat_id
        varchar status
        text error_message
        timestamp sent_at
        timestamp created_at
    }

    SERVICES {
        bigint id PK
        varchar title_ru
        varchar title_kz
        text description_ru
        text description_kz
        numeric price_from
        varchar duration_ru
        varchar duration_kz
        varchar icon_key
        int sort_order
        boolean active
        timestamp created_at
        timestamp updated_at
    }

    PORTFOLIO_PROJECTS {
        bigint id PK
        varchar title
        varchar category_ru
        varchar category_kz
        text description_ru
        text description_kz
        varchar image_url
        varchar technologies
        varchar project_url
        int sort_order
        boolean active
        timestamp created_at
        timestamp updated_at
    }
```

## Relationships

- One user can have many refresh tokens.
- One user can create many contact requests.
- One contact request can have many admin comments.
- One contact request can have many status history records.
- One contact request can have many Telegram notification logs.
- `services` and `portfolio_projects` are content tables for the public website.
