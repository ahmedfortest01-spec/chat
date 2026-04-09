from playwright.sync_api import sync_playwright
import time

def run_verification(page):
    ts = int(time.time())
    username = f"user_{ts}"
    email = f"user_{ts}@example.com"

    # Go to landing page (should redirect to /en)
    print("Visiting landing page...")
    page.goto("http://localhost:3000")
    page.wait_for_url("**/en")

    # Check if html lang is 'en'
    lang = page.locator("html").get_attribute("lang")
    print(f"Detected language: {lang}")
    if lang != "en":
        raise Exception(f"Expected lang 'en', got '{lang}'")

    print(f"Registering as {username}...")
    page.goto("http://localhost:3000/en/auth/register")
    page.get_by_label("Full Name").fill("Test User")
    page.get_by_label("Username").fill(username)
    page.get_by_label("Email Address").fill(email)
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Create Account").click()

    page.wait_for_url("**/en/dashboard")
    print("Registration successful.")

    # Check for RTL in Arabic
    print("Switching to Arabic...")
    page.get_by_label("Toggle language").click()
    page.wait_for_url("**/ar/dashboard")

    lang = page.locator("html").get_attribute("lang")
    direction = page.locator("body").get_attribute("dir")
    print(f"Detected language: {lang}, direction: {direction}")

    if lang != "ar" or direction != "rtl":
        raise Exception(f"Failed to switch to Arabic RTL! lang={lang}, dir={direction}")

    # Check Theme Toggle (Dark/Light)
    # Default is dark, toggle to light
    print("Toggling theme...")
    page.get_by_label("Toggle theme").click()

    # Wait for class to change on html
    # next-themes usually sets class="light" or class="dark" on html
    html_class = page.locator("html").get_attribute("class")
    print(f"HTML class: {html_class}")
    if "light" not in html_class:
        # It might be in the middle of a transition or set differently
        # Let's wait a bit
        time.sleep(1)
        html_class = page.locator("html").get_attribute("class")
        print(f"HTML class after delay: {html_class}")
        if "light" not in html_class:
             raise Exception(f"Expected light theme class on html, got '{html_class}'")

    print("Logout successful.")
    page.get_by_role("button", name="تسجيل الخروج").click() # Arabic Logout
    page.wait_for_url("**/ar/auth/login")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        try:
            run_verification(page)
            print("All verification steps passed!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="error.png")
            exit(1)
        finally:
            context.close()
            browser.close()
