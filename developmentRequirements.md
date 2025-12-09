🛠 Website Development Specification: 
Super Admin & Event Organiser

1. 🔐 Auth
1.1 Login
User enters their email.
If new user, email is sent to them with a link to set a password. Have the email automatically populated once they click on the email link, user then clicks “Next” and sets a password.
If returning user, ask for password.
Token generated after login - 1 day session token expiry. 
1.2 Logout
Invalidates token and clears session.
1.3 Forgot Password + Reset
	Email is sent to user with a link to create a new password.

🧭2. Super Admin
Description
The Super Admin manages the entire system — all organisers, events, companies, and users. They can act on behalf of any Event Organiser, view all stats, and manage user levels across all scopes.
Sections
Dashboard Overview – system‑wide KPIs (total events, organisers, companies, users, leads).


Event Organisers Management – view/add/edit/delete organisers.


Events Management – view/add/edit/delete events under any organiser.


Companies Management – view/add/edit/delete companies across events.


Full User Management – manage Super Admins, Organisers, Event Admins, Admins and Users.


Reporting – system‑wide access to all levels of reporting.


Visitor Data Management – import or clear badges per event.

Functionality
1. User & Admin Management
Add/Edit/Delete Super Admins


Add/Edit/Delete Event Organisers


Super Admin can see all Event Organisers in the system.


Can impersonate or “work on behalf” of an organiser.

2. Event Management
Add/Edit/Delete Events for any organiser.

View All Events


Dashboard lists all organisers and their events.


Clicking on an organiser filters to their scope (context switch).


3. Company & Product Management
Add/Edit/Delete Companies (individually or in bulk via Company Excel Template)


Creating a company automatically creates a Admin (invitation email sent).


Add/Edit/Delete Users (individually or in bulk via User Excel Template)


Invitation email sent upon creation.


Add/Edit/Delete Products


4. Visitor (Badge) Data Management
Import Visitor Data via Excel template for a specific event → populates tblBadges.


Clear Existing Badge Data


Deletes badge data for a specific event (DELETE FROM tblBadges WHERE EventID = X).


Requires UI confirmation modal.


5. Reporting & Stats
System-Wide Stats: total events, organisers, companies, users, and leads.


Event Organiser Stats: total events, companies, users, and leads under that organiser.


Event Stats: per event — total companies, users, and leads.


Company Stats: per company — total users and leads.


User Stats: per user — total leads captured.


Excel Exports:


Custom formatting (colours, filters, conditional visibility).


Audio and photo URLs embedded as clickable links for download.


6. Context Switching
Default landing page: “Event Organiser List.”


Selecting an organiser switches scope — all data and actions are filtered under that organiser.


Breadcrumbs reflect scope: Organiser: X > Event: Y > Company: Z.

Navigation dynamically updates based on selected scope.



🧑‍💼 Event Organiser
Description
The Event Organiser manages their own events, companies, event admins, and related users. They cannot see other organisers or events outside their ownership.
Sections
Dashboard Overview – organiser-level KPIs (total events, companies, users, leads).


Events Management – add/edit/delete their own events.


Companies Management – manage companies under their events.


Users & Admins – manage Event Admins and Users.


Visitor Data Management – import/clear badge data per event.


Reporting – export Excel reports for events, companies, and users.



Functionality
1. Event Management
Add/Edit/Delete their own events.

Can view all events they created.

Cannot access other organisers’ events.

2. Company & Product Management
Add/Edit/Delete Companies (individually or in bulk via Company Excel Template)

Adding a Company also creates a Admin and sends invitation email.

Add/Edit/Delete Users (individually or in bulk via User Excel Template)

Sends invitation email on creation.

Manage Products.

3. Event Admin Management
Add/Edit/Delete Event Admins for their events.

Sends invitation email to new event admins.

4. Visitor (Badge) Data Management
Import visitor badge data for specific event (Visitor Excel Template → tblBadges).

Clear visitor badge data for specific events with confirmation.

5. Reporting & Stats Access
Organiser Stats: total events, companies, users, and leads.

Event Stats: event-level metrics.

Company Stats: company-level metrics.

User Stats: individual user performance.

6. Context Switching
Default landing page: “My Events”

Breadcrumb navigation always visible: Event: X > Company: Y > User: Z.

Navigation dynamically adapts per selected event or company scope.

🧾 Notes
UI should include breadcrumb headers and adaptive navigation.

Clear confirmation modals for destructive actions (delete event, company, user, visitor data etc.).