## UI / Visual

1. **Profile Icon**
    - Default: icon **outlined**
    - Active (Profile Side Drawer open): icon **filled**

2. **Promotion Card Label**
    - Font size: **14px**
    - Color: **#8492A2**

3. **Hover Image Zoom**
    - Apply image zoom-on-hover (same as promo banner) for:
        - Events & Seminar cards
        - CGSI Insights cards

---

## Carousel Behavior

4. **Events & Seminar + CGSI Insights Carousel**
    - Dot indicator should **not represent each card**
    - Indicator should represent the **number of transitions** (same as Promotion Banner carousel)
    - When reaching the last card:
        - Clicking the right arrow should **snap back to the first card**
    - Goal: make it clearer when the carousel has cycled through all cards

---

## Functional Bugs

5. **Profile Side Drawer**
    - Bug: clicking on menu options does **not update the content**
    - Fix state/navigation handling
    - Note: when drawer is active, profile icon being filled is **correct behavior**

---

## Typography / Color

6. **CGSI Insights Content**
    - Description text (Insights & Research Articles):
        - Font size: **16px**
        - Subtext color: **#8492A2**

---

## Layout

7. **Footer Padding**
    - Footer currently scales content width based on screen width
    - Should follow the **same side padding logic** as header and page body (container-based layout)

---

## Pending Review

8. **Contact Us (Profile Side Drawer)**
    - Additional feedback will be provided after retesting
