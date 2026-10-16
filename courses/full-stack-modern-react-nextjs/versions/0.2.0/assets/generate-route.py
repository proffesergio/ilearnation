"""Generate original static/optional route diagrams, never learner-submitted code.

Run from any directory: python3 path/to/assets/generate-route.py
Check existing assets: python3 path/to/assets/generate-route.py --check
Requires existing Pillow; do not install it automatically.
"""

from pathlib import Path
import sys

from PIL import Image, ImageDraw, ImageFont


ASSETS = Path(__file__).resolve().parent
LABELS = ("Read", "Run", "Edit", "Check", "Reflect")
WIDTH, HEIGHT = 640, 112
BACKGROUND = "#132336"
TEXT = "#f4f0e7"
ACCENT = "#f2c66d"
CENTERS = (64, 192, 320, 448, 576)


def generate():
    """A single dot travels along a static learning route over 2.4 seconds."""
    font = ImageFont.load_default(size=16)
    frames = []
    for index in range(24):
        frame = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
        draw = ImageDraw.Draw(frame)
        draw.line((CENTERS[0], 38, CENTERS[-1], 38), fill=TEXT, width=2)
        for center, label in zip(CENTERS, LABELS):
            draw.ellipse((center - 7, 31, center + 7, 45), fill=BACKGROUND, outline=TEXT, width=2)
            draw.text((center, 69), label, font=font, fill=TEXT, anchor="mm")
        position = round(CENTERS[0] + (CENTERS[-1] - CENTERS[0]) * index / 23)
        draw.ellipse((position - 5, 33, position + 5, 43), fill=ACCENT)
        frames.append(frame)
    # Deliberately omit loop: no Netscape looping extension is written.
    frames[0].save(
        ASSETS / "learning-route.gif",
        save_all=True,
        append_images=frames[1:],
        duration=100,
        disposal=2,
        optimize=False,
    )
    nodes = "\n".join(
        f'  <circle cx="{center}" cy="38" r="7" fill="{BACKGROUND}" stroke="{TEXT}" stroke-width="2"/>'
        f'\n  <text x="{center}" y="74">{label}</text>'
        for center, label in zip(CENTERS, LABELS)
    )
    (ASSETS / "learning-route.svg").write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" width="640" height="112" viewBox="0 0 640 112" role="img" aria-labelledby="route-title route-description">
  <title id="route-title">A small learning route</title>
  <desc id="route-description">Read, run, edit, check, then reflect. Repeat at your own pace.</desc>
  <rect width="640" height="112" rx="12" fill="{BACKGROUND}"/>
  <path d="M64 38H576" stroke="{TEXT}" stroke-width="2"/>
  <g fill="{TEXT}" font-family="sans-serif" font-size="16" text-anchor="middle">
{nodes}
  </g>
</svg>
''',
        encoding="utf-8",
    )


def check():
    with Image.open(ASSETS / "learning-route.gif") as animation:
        assert animation.size == (WIDTH, HEIGHT)
        assert animation.n_frames == 24
        assert "loop" not in animation.info, "Animation must play once"
        duration = 0
        for index in range(animation.n_frames):
            animation.seek(index)
            duration += animation.info.get("duration", 0)
        assert duration == 2400, f"Expected 2400 ms, received {duration}"
    assert (ASSETS / "learning-route.gif").stat().st_size < 100_000
    print("PASS: 640×112, 24 frames, 2400 ms, no loop extension, below 100 KB")


if __name__ == "__main__":
    if len(sys.argv) == 1:
        generate()
    elif sys.argv[1:] != ["--check"]:
        raise SystemExit("Usage: generate-route.py [--check]")
    check()
