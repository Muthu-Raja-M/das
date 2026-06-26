# Browser Storage Troubleshooting Guide

During active development, testing, or deployment updates of the Blue Connect project, developers and testers often encounter issues where the application exhibits unexpected behaviors (such as infinite login redirects or data discrepancies). This document explains why these cache and storage mismatches happen, lists common symptoms, and provides step-by-step guides to clear local storage.

---

## 1. Purpose

Modern single-page applications (SPAs) store persistent state on the client side using browser storage. If the following updates occur on the backend or in the build code:
* **JWT Updates**: Changes to token signatures, signing keys, or token payload structure.
* **RBAC Updates**: Role modifications (e.g., changing a user from "employer" to "admin") that do not match the cached roles in the browser.
* **Authentication Updates**: Modifications to access lifetimes, logout routes, or authentication middleware classes.
* **API Changes**: Refactored URL paths or query parameters.
* **Local/Session Storage Changes**: Updates to the key names used to cache profiles.

The browser will continue to send stale, cached tokens or roles in the API request headers. This results in auth errors because the backend expects the updated format.

---

## 2. Common Symptoms

If browser storage is out-of-sync, you will observe the following symptoms:
1. **`401 Unauthorized` / `Invalid Token`**: The browser sends a stale or expired JWT token that the updated backend rejects.
2. **`403 Forbidden` / `Wrong User Role`**: The client displays a page (such as the admin dashboard) based on cached localStorage values, but the backend rejects the query because the user's role on the server does not match.
3. **Infinite Login Loop**: Navigating to the dashboard redirects you to `/login`, and typing credentials redirects you back to `/login` continuously.
4. **Dashboard Not Loading**: Blank white screens or loading indicators that never resolve.
5. **Old Profile Data**: The application displays old usernames or rate values even after you save updates.
6. **Notifications Not Updating**: Old alert indicators do not clear.

---

## 3. How to Clear Browser Storage (By Browser)

### Google Chrome
1. Click the **three dots** in the top-right corner.
2. Select **Delete browsing data...** (or press `Ctrl + Shift + Delete`).
3. Set Time Range to **"All time"**.
4. Check **"Cookies and other site data"** and **"Cached images and files"**.
5. Click **Delete data**.
6. Alternatively, click the **Lock/Tune icon** next to the URL, select **"Site settings"**, and click **"Clear data"**.

### Microsoft Edge
1. Click the **three dots** in the top-right corner.
2. Choose **Settings** > **Privacy, search, and services**.
3. Under **Clear browsing data**, click **"Choose what to clear"**.
4. Set Time Range to **"All time"**.
5. Select **"Cookies and other site data"** and **"Cached images and files"**.
6. Click **"Clear now"**.

### Mozilla Firefox
1. Click the **Application Menu** (three lines in the top-right).
2. Select **Settings** > **Privacy & Security**.
3. Scroll down to **Cookies and Site Data**, and click **"Clear Data..."**.
4. Check **"Cookies and Site Data"** and **"Cached Web Content"**.
5. Click **Clear**.

---

## 4. Developer Tools Method (Recommended for Developers)

For active developers, clearing storage for a specific local host port is most easily accomplished using browser Developer Tools (`F12`).

1. Open the application (e.g. `http://localhost:5173/`).
2. Press **`F12`** or right-click anywhere and select **Inspect**.
3. Navigate to the **Application** tab (Chrome/Edge) or **Storage** tab (Firefox).
4. In the left panel:
   * **Local Storage**: Expand the category, right-click `http://localhost:5173`, and select **Clear**.
   * **Session Storage**: Expand and clear.
   * **Cookies**: Right-click `http://localhost:5173` and click **Clear**.
   * **IndexedDB**: Expand, select database names, and click **Delete database**.
   * **Cache Storage**: Expand and delete cache keys.
5. Alternatively, select **Clear storage** in the left menu, scroll down, and click **"Clear site data"**.

---

## 5. When Developers Should Clear Storage

You should proactively clear your browser storage after performing any of these tasks:
* **JWT Changes**: Modifying token structure or lifetime settings in `settings.py`.
* **RBAC Changes**: Updating user roles in the database.
* **Database Reset**: Re-migrating or recreating test users.
* **API URL Changes**: Refactoring endpoint structures in `endpoints.js` or views.py.
* **Deployment Updates**: Fetching git merges that contain frontend changes.

---

## 6. Verification

To verify that browser storage is successfully cleared:
1. Open DevTools (`F12`), choose the **Application** tab, click **Local Storage** under the key node, and confirm that the grid is empty.
2. Refresh the page (`Ctrl + F5`). The application should redirect you to `/login` and request fresh credentials.

---

## 7. Frequently Asked Questions

### Q: Why am I still logged in after clearing cache?
* **A**: Cache refers to stored web page assets (JS, HTML). Storing credentials is managed by **Cookies** and **Local Storage**. You must check "Cookies and site data" or clear Local Storage in DevTools.

### Q: Why do I get a 401 error after resetting my database?
* **A**: Your browser still holds a token issued for a user ID that no longer exists in the newly reset database. Log out or clear browser storage to wipe the invalid token.

### Q: Why is my old profile image showing up?
* **A**: Images are cached by the browser's disk cache. Reload the page using **`Ctrl + F5`** to bypass the cache and fetch the new image.

---

## 8. Best Practices

### For Developers
* Include automatic token invalidation blocks in Axios catch sections (already implemented in `axios.js` for `401` errors).
* Use version prefixes in local storage keys (e.g. `blueconnect_v1_token`) to automatically invalidate old tokens on code updates.

### For Testers
* Always test authentication flows in **Incognito/Private Browsing** mode. Closing the private window guarantees that all session storage and tokens are completely wiped.

### For End Users
* Add clear instructions near profile forms explaining that changes may take a page refresh (`Ctrl + F5`) to become visible due to browser asset caching.
