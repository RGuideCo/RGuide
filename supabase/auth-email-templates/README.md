# RGuide Supabase Auth Email Templates

These are the hosted Supabase Auth templates for the RGuide project.

They are tracked here as the source of truth, but hosted Supabase does not read these files automatically. Apply them in:

`Supabase Dashboard > RGuide > Authentication > Emails > Templates`

## Invite User

Subject:

```txt
Create your RGuide account
```

Body:

Use `invite.html`.

## Confirm Signup

Subject:

```txt
Confirm your RGuide account
```

Body:

Use `confirmation.html`.

## Reset Password

Subject:

```txt
Set your RGuide password
```

Body:

Use `recovery.html`.

Keep `{{ .ConfirmationURL }}` intact. Supabase replaces it with the secure confirmation, invite, or reset link.
