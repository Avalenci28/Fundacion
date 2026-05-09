# TODO: Fix “create/edit/delete not reflecting in DB” (projects)

- [ ] Confirm error logs for admin project endpoints (POST /admin/projects, PUT /admin/projects/:id, DELETE /admin/projects/:id)
- [ ] Fix missing import `Joi` in `backend/controllers/adminProjectController.js` (adminCreateProject/adminUpdateProject)
- [ ] After fix, retest: create/edit/delete project and verify `is_active` changes
- [ ] If still inconsistent, normalize `is_active` boolean parsing in `backend/db/query.js` for projects.update
- [ ] Optional: add debug logging around `projects.create/update/delete` and ensure response matches backend outcome

