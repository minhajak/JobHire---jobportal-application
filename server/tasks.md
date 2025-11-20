
### Experience Endpoints
- `POST /api/profile/experience`  
  Add or update a user experience.

- `GET /api/profile/experience/:userId`  
  Get all experiences for a user by `userId`.

- `DELETE /api/profile/experience/:expId`  
  Delete a specific experience by experience ID.

---

### Education Endpoints
- `POST /api/profile/education`  
  Add or update a user education entry.

- `GET /api/profile/education/:userId`  
  Get all education entries for a user by `userId`.

- `DELETE /api/profile/education/:eduId`  
  Delete a specific education entry by education ID.

---

### Resume Endpoints
- `POST /api/profile/resume`  
  Upload or update user's resume file.

- `GET /api/profile/resume/:userId`  
  Get resume data for a specific user by `userId`.

- `GET /api/profile/resume/file/:resId`  
  Get the actual resume PDF file by resume ID.

- `DELETE /api/profile/resume/:resId`  
  Delete the resume for the currently authenticated user.

---

### External Links Endpoints
- `POST /api/profile/links`  
  Add or update external links (limit: max 5–10 links per user).

- `GET /api/profile/links/:userId`  
  Get all links for a user by `userId`.

- `DELETE /api/profile/links/:linkId`  
  Delete a specific link by link ID.

---

### Notes
1. `req.user.userId` will be available from the auth middleware and used to identify the currently authenticated user.  
2. `expId`, `eduId`, `linkId`, and `resId` refer to the respective document IDs in the database.
