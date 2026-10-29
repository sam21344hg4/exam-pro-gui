#!/usr/bin/env python3
"""Import an extracted Coursology test into ExamPro's interactive Qbank player.

Usage:
  py -3 scripts\import_qbank.py --source "E:\medical-library-reverse\qbank-cdp-clean\1884524131"
Run from the ExamPro project folder. Never modifies the extracted source.
"""
import argparse
import html
import json
import re
import shutil
from pathlib import Path

QID_RE = re.compile(r"(?:^|_)q(\d+)(?:_|$)", re.IGNORECASE)
PERCENT_RE = re.compile(r"\s*\(\s*\d+(?:\.\d+)?\s*%\s*\)\s*$")
MARKER_RE = re.compile(r'data-icon\s*=\s*["\x27]check["\x27]|fa-check\b', re.I)


def question_id(name):
    match = QID_RE.search(name)
    return int(match.group(1)) if match else None


def answer_choices(raw):
    choices = []
    marked = []
    for number, answer in enumerate(raw):
        label = chr(ord("A") + number)
        raw_text = html.unescape(str(answer.get("text", "")))
        text = re.sub(r"^\s*" + label + r"\s*[\.\)]\s*", "", raw_text, flags=re.I)
        text = PERCENT_RE.sub("", text).strip()
        text = re.sub(r"\s+", " ", text)
        choices.append({"label": label, "text": text or label})
        if MARKER_RE.search(str(answer.get("html", ""))):
            marked.append(label)
    return choices, marked[0] if len(marked) == 1 else None


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--source", required=True, type=Path, help="Extracted test folder containing questions/")
    ap.add_argument("--project", default=Path(__file__).resolve().parents[1], type=Path)
    ap.add_argument("--test-id", default=None, help="Override test folder identifier")
    ap.add_argument("--dry-run", action="store_true", help="Inspect only; copy nothing")
    args = ap.parse_args()

    source = args.source.resolve()
    project = args.project.resolve()
    if not (source / "questions").is_dir():
        ap.error("Not a test folder: missing questions/ in " + str(source))
    if not (project / "src" / "App.tsx").exists():
        ap.error("Not an ExamPro project: missing src/App.tsx in " + str(project))
    test_id = args.test_id or source.name
    if not re.fullmatch(r"[A-Za-z0-9_-]+", test_id):
        ap.error("test-id may contain only letters, numbers, underscores and hyphens")
    target = project / "public" / "qbank" / test_id
    if target == source or source in target.parents:
        ap.error("Source and destination cannot overlap")

    imported = {}
    skipped = []
    uncertain = []
    for folder in source.joinpath("questions").iterdir():
        if not folder.is_dir():
            continue
        qid = question_id(folder.name)
        if qid is None:
            skipped.append(folder.name + ": no q<ID> suffix")
            continue
        data_file = folder / "question.json"
        if not data_file.exists():
            skipped.append(folder.name + ": missing question.json")
            continue
        try:
            obj = json.loads(data_file.read_text(encoding="utf-8-sig"))
        except (ValueError, UnicodeError) as err:
            skipped.append(folder.name + ": invalid JSON " + str(err))
            continue

        meta = obj.get("metadata") or {}
        if meta.get("qid") is not None and str(meta["qid"]) != str(qid):
            skipped.append(folder.name + ": QID mismatch with metadata")
            continue
        if qid in imported:
            skipped.append(folder.name + ": duplicate QID " + str(qid))
            continue

        options, correct = answer_choices(obj.get("answers") or [])
        if len(options) < 2:
            skipped.append(folder.name + ": fewer than two answer choices")
            continue
        if correct is None:
            uncertain.append(str(qid) + ": correct answer not unambiguously marked")
        if not (folder / "question.html").exists():
            skipped.append(folder.name + ": missing question.html")
            continue

        position = meta.get("index")
        if not isinstance(position, int) or position <= 0:
            position = None

        classification = (obj.get("footer") or {}).get("classification") or {}
        url = "/qbank/{}/questions/{}/".format(test_id, folder.name)
        imported[qid] = {
            "qid": qid,
            "position": position,
            "folder": folder.name,
            "questionUrl": url + "question.html",
            "explanationUrl": url + "explanation.html" if (folder / "explanation.html").exists() else None,
            "options": options,
            "correctAnswer": correct,
            "classification": classification,
            "hints": [{"label": str(h.get("label", "")), "url": url + "exhibits/exhibit-" + str(h.get("id", "")).removeprefix("exhibit-") + "/index.html"} for h in (obj.get("hints") or []) if h.get("id")],
        }

    items = sorted(imported.values(), key=lambda item: (item["position"] is None, item["position"] or 0, item["qid"]))
    if not items:
        raise SystemExit("No importable questions found; no files were modified.")

    print("Test:", test_id, "| QIDs:", len(items), "| uncertain answers:", len(uncertain))
    for issue in skipped + uncertain:
        print("  WARNING:", issue)

    if args.dry_run:
        print("Dry run: no files copied.")
        return

    target.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source / "questions", target / "questions", dirs_exist_ok=True)
    for foldername in ("assets", "media"):
        if (source / foldername).is_dir():
            shutil.copytree(source / foldername, target / foldername, dirs_exist_ok=True)

    catalog_file = project / "public" / "qbank" / "catalog.json"
    catalog_file.parent.mkdir(parents=True, exist_ok=True)
    try:
        catalog = json.loads(catalog_file.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        catalog = {"tests": []}
    tests = [t for t in catalog.get("tests", []) if t.get("id") != test_id]
    tests.append({"id": test_id, "title": "Extracted test " + test_id, "questions": items})
    catalog_file.write_text(json.dumps({"tests": tests}, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Wrote:", catalog_file)
    print("Copied questions and available shared assets to:", target)
    print("Open ExamPro's /qbank route while the Vite server is running.")


if __name__ == "__main__":
    main()
