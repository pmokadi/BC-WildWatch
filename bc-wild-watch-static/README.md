# BC Wild Watch

Plain HTML, Tailwind CDN, and JavaScript — plus a Python server that hosts the **website and AI model together**.

## Run locally (website + model)

```powershell
cd api
py -m pip install -r requirements.txt
py server.py
```

Open:

```text
http://127.0.0.1:8080
http://127.0.0.1:8080/predictor.html
```

Put your Teachable Machine export in `my_model/` first (see `my_model/README.md`). Check `http://127.0.0.1:8080/health` — you want `"modelLoaded": true`.

> Opening `index.html` directly in the browser will **not** run predictions (no server). Always use `py server.py` for the Safety Scanner.

## Media

Add images in `media/images/`. Add your background video in `media/videos/` (home page uses `media/videos/Smart_Cities.mp4` unless you change `index.html`).

## Pages

- `index.html` — Home
- `about.html` — About
- `predictor.html` — Safety Scanner (Teachable Machine)
- `sighting.html`, `incident.html`, `contact.html`, `login.html`, `signup.html`

## Demo data

Forms, signups, reports, and predictions are stored in browser `localStorage`.

## Host on the internet

Deploy **once** with Docker on Render, Railway, or Fly.io. See **`DEPLOY.md`**.

The predictor calls `POST /predict` on the same host (`MODEL_API_URL = "/predict"` in `assets/js/app.js`).

## Gemini feedback (optional)

Set `GEMINI_FEEDBACK_API_URL` in `assets/js/app.js` to a **backend proxy** URL (not a raw API key). The proxy should accept `image`, `prediction`, and `confidence`, and return JSON with `name`, `danger_level`, `description`, and `first_aid`.
