from playwright.sync_api import sync_playwright

def run_verification(page):
    page.goto("http://localhost:3000")
    page.wait_for_timeout(2000)
    page.screenshot(path="/home/jules/verification/screenshots/landing_v2.png")

    page.goto("http://localhost:3000/auth/login")
    page.wait_for_timeout(2000)
    page.screenshot(path="/home/jules/verification/screenshots/login_v2.png")

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
