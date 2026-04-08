from playwright.sync_api import sync_playwright

def run_verification(page):
    # Register a user
    page.goto("http://localhost:3000/auth/register")
    page.get_by_placeholder("John Doe").fill("User One")
    page.get_by_placeholder("johndoe").fill("user1")
    page.get_by_placeholder("name@example.com").fill("user1@example.com")
    page.get_by_placeholder("••••••••").fill("password123")
    page.get_by_role("button", name="Create Account").click()
    page.wait_for_timeout(3000)
    page.screenshot(path="/home/jules/verification/screenshots/dashboard_v1.png")

    # Go to Chat
    page.get_by_role("link", name="Chat").click()
    page.wait_for_timeout(3000)
    page.screenshot(path="/home/jules/verification/screenshots/chat_v1.png")

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
