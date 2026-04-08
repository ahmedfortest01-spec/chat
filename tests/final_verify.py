from playwright.sync_api import sync_playwright
import time

def run_verification(page):
    ts = int(time.time())
    username = f"user_{ts}"
    email = f"user_{ts}@example.com"

    print(f"Registering as {username}...")
    page.goto("http://localhost:3000/auth/register")
    page.get_by_label("Full Name").fill("Test User")
    page.get_by_label("Username").fill(username)
    page.get_by_label("Email Address").fill(email)
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Create Account").click()

    page.wait_for_url("**/dashboard")
    print("Registration successful.")

    # Check Navbar visibility (since it was missing before)
    navbar = page.get_by_role("navigation")
    if navbar.is_visible():
        print("Navbar is visible.")
    else:
        raise Exception("Navbar NOT visible!")

    print("Logging out via Navbar...")
    navbar.get_by_role("button", name="Logout").click()
    page.wait_for_url("**/auth/login")
    print("Logout successful.")

    print("Logging in...")
    page.get_by_label("Email Address").fill(email)
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Sign In").click()

    page.wait_for_url("**/dashboard")
    print("Login successful.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            run_verification(page)
        finally:
            context.close()
            browser.close()
