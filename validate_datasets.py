import csv
from pathlib import Path
from collections import Counter

DATASET_DIR = Path("dataset")
EXPECTED_COLUMNS = [
    "Subject", "Topic", "Difficulty", "Question",
    "Option1", "Option2", "Option3", "Option4",
    "CorrectAnswer", "Explanation"
]
VALID_DIFFICULTIES = {"Easy", "Medium", "Hard"}

def validate_csv(path):
    problems = []
    try:
        with path.open("r", encoding="utf-8-sig", newline="") as f:
            reader = csv.DictReader(f)
            columns = reader.fieldnames or []
            if columns != EXPECTED_COLUMNS:
                problems.append(f"Wrong columns/order: {columns}")
            rows = list(reader)
    except Exception as exc:
        return 0, [f"Could not read CSV: {exc}"], {}

    if not rows:
        problems.append("CSV has no data rows")

    difficulty_counts = Counter()
    for row_num, row in enumerate(rows, start=2):
        difficulty = (row.get("Difficulty") or "").strip()
        difficulty_counts[difficulty] += 1

        if difficulty not in VALID_DIFFICULTIES:
            problems.append(f"Row {row_num}: invalid Difficulty '{difficulty}'")

        answer = (row.get("CorrectAnswer") or "").strip()
        options = [(row.get(f"Option{i}") or "").strip() for i in range(1, 5)]
        if answer not in options:
            problems.append(f"Row {row_num}: CorrectAnswer does not match any option")

        for col in EXPECTED_COLUMNS:
            if not (row.get(col) or "").strip():
                problems.append(f"Row {row_num}: empty value in {col}")

    expected = {"Easy": 30, "Medium": 30, "Hard": 30}
    if len(rows) != 90:
        problems.append(f"Expected 90 rows, found {len(rows)}")
    if any(difficulty_counts.get(k, 0) != v for k, v in expected.items()):
        problems.append(f"Difficulty counts are {dict(difficulty_counts)}, expected {expected}")

    return len(rows), problems, difficulty_counts

def main():
    if not DATASET_DIR.is_dir():
        print("ERROR: dataset/ folder not found. Run this script from your project root.")
        return

    csv_files = sorted(DATASET_DIR.rglob("*.csv"))
    if not csv_files:
        print("ERROR: No CSV files found under dataset/.")
        return

    print(f"Found {len(csv_files)} CSV files under {DATASET_DIR}/\n")
    passed = 0
    failed = 0
    for path in csv_files:
        count, problems, difficulties = validate_csv(path)
        relative = path.relative_to(DATASET_DIR)
        if problems:
            failed += 1
            print(f"[CHECK] {relative} ({count} rows)")
            for problem in problems[:8]:
                print(f"   - {problem}")
            if len(problems) > 8:
                print(f"   - ... and {len(problems) - 8} more issue(s)")
        else:
            passed += 1
            print(f"[OK] {relative} — {count} rows; Easy 30 / Medium 30 / Hard 30")

    print(f"\nRESULT: {passed} passed, {failed} need attention.")
    if failed:
        print("Do not integrate yet; review the listed issues first.")
    else:
        print("Structural validation passed. This checks format, not whether every question is pedagogically correct.")

if __name__ == "__main__":
    main()
