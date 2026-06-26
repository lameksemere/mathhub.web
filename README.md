# Math Hub 🎓

An interactive maths learning website for children aged **6–10 years**, covering Multiplication, Division, and Fractions with video lessons and three difficulty levels.

## Live Site

Deploy via GitHub Pages — see setup instructions below.

## Features

- ✅ **Three Topics** — Multiplication, Division, Fractions
- ✅ **Three Difficulty Levels** — Easy (free), Medium & Hard (requires sign-up)
- ✅ **Video Lessons** embedded on every topic page
- ✅ **Instant Answer Checking** with score feedback
- ✅ **Sign Up / Log In** system (localStorage-based, no backend needed)
- ✅ **Responsive Design** — works on mobile, tablet, and desktop
- ✅ **Contact Page** with real email and phone number

## Pages

| File | Description |
|------|-------------|
| `index.html` | Landing page / Home |
| `multiplication.html` | Multiplication topic page |
| `division.html` | Division topic page |
| `fractions.html` | Fractions topic page |
| `about_me.html` | About page |
| `contact_us.html` | Contact page |

## Tech Stack

- **HTML5** — Pure HTML, no frameworks
- **Tailwind CSS** — Loaded via CDN
- **Vanilla JavaScript** — No dependencies
- **Google Fonts** — Quicksand font family
- **Material Symbols** — Google icon set

## Deploying on GitHub Pages

### Step 1 — Create a GitHub Account
Go to [github.com](https://github.com) and sign up if you haven't already.

### Step 2 — Create a New Repository
1. Click the **+** icon → **New repository**
2. Name it `math-hub` (or any name you like)
3. Set it to **Public**
4. **Do NOT** tick "Add a README file"
5. Click **Create repository**

### Step 3 — Upload Your Files
**Option A — Drag & Drop (easiest):**
1. On your new repository page, click **uploading an existing file**
2. Drag ALL the website files into the upload area
3. Scroll down and click **Commit changes**

**Option B — Using Git CLI:**
```bash
git init
git add .
git commit -m "Initial commit - Math Hub website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/math-hub.git
git push -u origin main
```

### Step 4 — Enable GitHub Pages
1. In your repository, click **Settings** (top tab)
2. Scroll to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch and **/ (root)** folder
5. Click **Save**
6. Wait 1–2 minutes, then your site will be live at:
   `https://YOUR_USERNAME.github.io/math-hub/`

### Step 5 — Add Video Files (Optional)
If you have local video files (`Math Antics - Basic Division.mp4`, etc.), upload them to the repository too. Alternatively, replace video tags with YouTube embeds.

## Contact

- **Email:** lameksemere.akamom.org
- **Phone:** +254 743 165 021

---

© 2026 Math Hub by Lamek Semere
