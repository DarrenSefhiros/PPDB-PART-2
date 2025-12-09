# TODO: Implement Attendance Reset at 6 AM

## Tasks
- [x] Modify src/Datasiswa/Absensi.jsx to prevent check-in before 6 AM
- [x] Modify src/Datasiswa/Absenijin.jsx to prevent leave requests before 6 AM
- [x] Adjust status display in presensi table (src/Datasiswa/Presensi.jsx) and dashboard (src/Components/Dashboard.jsx)
- [ ] Test the changes to ensure presensi starts at 6 AM and check-out at 3 PM

## Information Gathered
- Absensi.jsx handles check-in (before 15:00) and check-out (after 15:00), prevents re-check-in before 15:00 if already checked in.
- Absenijin.jsx handles leave requests, prevents repeated leave on the same day.
- Absenkeluar.jsx handles check-out, only after 15:00 if checked in today.

## Plan
- Add time check in Absensi.jsx handleAbsen: if hour < 6, show warning.
- Add time check in Absenijin.jsx handleIjin: if hour < 6, show warning.
- No changes to Absenkeluar.jsx.

## Dependent Files
- src/Datasiswa/Absensi.jsx
- src/Datasiswa/Absenijin.jsx

## Followup Steps
- Run the app and test presensi at different times.
- Verify that check-in/leave is blocked before 6 AM.
- Verify that after check-in, can't check-in again until 15:00.
- Verify that check-out is only allowed after 15:00.
