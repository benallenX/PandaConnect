# Email-Based Role Assignment Setup

## Overview
The application automatically assigns user roles based on their email address patterns when they sign up. This eliminates the need for manual role assignment.

## How It Works

1. **User Signs Up**: When a user creates an account with Clerk
2. **Webhook Triggered**: Clerk sends a webhook to `/api/webhooks/clerk`
3. **Role Detection**: The system analyzes the email address to determine the role
4. **Automatic Assignment**: The role is saved to the user's metadata
5. **Dashboard Redirect**: User is automatically redirected to their role-specific dashboard

## Email Patterns

### Admin Roles
Users with these email patterns are assigned the **Admin** role:
- Contains `@admin.` (e.g., `john@admin.school.edu`)
- Starts with `admin@` (e.g., `admin@school.edu`)
- Starts with `principal@` (e.g., `principal@school.edu`)
- Starts with `director@` (e.g., `director@school.edu`)
- Starts with `superintendent@` (e.g., `superintendent@district.edu`)

### Teacher Roles
Users with these email patterns are assigned the **Teacher** role:
- Contains `@apsk12.org` (e.g., `john.smith@apsk12.org`) **[REQUIRED FOR TEACHER DASHBOARD ACCESS]**
- Contains `@teacher.` (e.g., `mary@teacher.school.edu`)
- Starts with `teacher@` (e.g., `teacher@school.edu`)
- Contains `@school.` (e.g., `john@school.edu`)
- Contains `@edu.` (e.g., `mary@edu.district.gov`)
- Ends with `.edu` (e.g., `john.smith@university.edu`)
- Starts with `staff@` (e.g., `staff@school.edu`)

**Important**: Only users with `@apsk12.org` email addresses can access the Teacher Dashboard. All other patterns will be assigned the teacher role but cannot access teacher features.

### Parent Roles
All other email addresses are assigned the **Parent** role by default.

## Customization

To customize the email patterns, edit the file: `lib/role-utils.ts`

```typescript
// Add or modify patterns in these arrays:
const adminPatterns = [
  '@admin.',
  'admin@',
  // Add your custom admin patterns here
];

const teacherPatterns = [
  '@teacher.',
  'teacher@',
  // Add your custom teacher patterns here
];
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Clerk Webhook Secret (get this from Clerk Dashboard > Webhooks)
WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Clerk Secret Key (for updating user metadata)
CLERK_SECRET_KEY=sk_your_clerk_secret_key_here
```

## Webhook Setup in Clerk Dashboard

1. Go to your Clerk Dashboard
2. Navigate to **Webhooks**
3. Click **Add Endpoint**
4. Set the URL to: `https://yourdomain.com/api/webhooks/clerk`
5. Select the `user.created` event
6. Copy the webhook secret to your environment variables

## Manual Role Override

If you need to manually assign roles, you can do so in the Clerk Dashboard:

1. Go to **Users** in Clerk Dashboard
2. Select a user
3. Go to **Metadata** tab
4. Add to **Public metadata**:
   ```json
   {
     "role": "admin"
   }
   ```

## Dashboard URLs

After role assignment, users are automatically redirected to:
- **Admins**: `/dashboard/admin`
- **Teachers**: `/dashboard/teacher`
- **Parents**: `/dashboard/parent`
