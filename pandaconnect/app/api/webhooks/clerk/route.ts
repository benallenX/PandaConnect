import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { getRoleFromEmail } from '@/lib/role-utils';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();

  // Get the Webhook secret
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;
    
    // Get the primary email
    const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
    
    if (primaryEmail) {
      // Determine role based on email
      const role = getRoleFromEmail(primaryEmail.email_address);
      
      try {
        // Update user metadata with role using Clerk's Backend API
        const response = await fetch(`https://api.clerk.com/v1/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            public_metadata: {
              role: role
            }
          }),
        });

        if (!response.ok) {
          console.error('Failed to update user role:', await response.text());
        } else {
          console.log(`Successfully assigned role '${role}' to user ${id} with email ${primaryEmail.email_address}`);
        }
      } catch (error) {
        console.error('Error updating user role:', error);
      }
    }
  }

  return new Response('', { status: 200 });
}
