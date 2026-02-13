# Brevo setup

1. Create a contacts list in Brevo for website waitlist subscribers.
2. Copy the list ID from Brevo and set it as `BREVO_LIST_ID` in your environment.
3. Create an automation in Brevo:
   - Trigger: **Contact added to list**
   - List: your waitlist list
   - Action: send your welcome email template
