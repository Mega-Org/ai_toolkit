#!/bin/bash
# Merge templates/vscode/search-exclude.json into .vscode/settings.json.
# Missing keys are inserted as text. Keys already present are never changed,
# so app choices such as TODOS.md: false stay as they are, and comments survive.
# Anything that cannot be placed safely is left untouched: the snippet is
# printed and the script exits 0 so install can continue.
# --check prints ok / absent / unsafe / missing<TAB>key and does not write.

set -euo pipefail

PROJECT_ROOT="${PROJECT_ROOT:-$(pwd)}"
TOOLKIT_DIR="${TOOLKIT_DIR:-$PROJECT_ROOT/ai_toolkit}"
TEMPLATE="$TOOLKIT_DIR/templates/vscode/search-exclude.json"
SETTINGS="$PROJECT_ROOT/.vscode/settings.json"

mode="apply"
case "${1:-}" in
    "") mode="apply" ;;
    --check) mode="check" ;;
    *)
        echo "usage: install-vscode-search.sh [--check]" >&2
        exit 1
        ;;
esac

if [ ! -f "$TEMPLATE" ]; then
    echo "❌ template not found: $TEMPLATE" >&2
    exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
    if [ "$mode" = "check" ]; then
        echo "unsafe"
        exit 0
    fi
    echo "⚠️  python3 not found; .vscode/settings.json was not changed."
    echo "Paste this into the root settings object (add a comma after the previous setting if there is one):"
    echo '    "search.exclude": '"$(cat "$TEMPLATE")"
    exit 0
fi

export SEARCH_EXCLUDE_TEMPLATE="$TEMPLATE"
export SEARCH_EXCLUDE_SETTINGS="$SETTINGS"
export SEARCH_EXCLUDE_MODE="$mode"

python3 - <<'PY'
import json
import os
import sys
from pathlib import Path

template_path = Path(os.environ["SEARCH_EXCLUDE_TEMPLATE"])
settings_path = Path(os.environ["SEARCH_EXCLUDE_SETTINGS"])
mode = os.environ.get("SEARCH_EXCLUDE_MODE", "apply")


class Unsafe(Exception):
    pass


def load_template():
    try:
        data = json.loads(template_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        print(f"❌ could not read search exclude template: {exc}", file=sys.stderr)
        sys.exit(1)
    if not isinstance(data, dict):
        print("❌ search exclude template must be a JSON object", file=sys.stderr)
        sys.exit(1)
    items = []
    for key, value in data.items():
        if not isinstance(key, str):
            print("❌ search exclude template keys must be strings", file=sys.stderr)
            sys.exit(1)
        items.append((key, value))
    return items


def newline_of(text):
    return "\r\n" if "\r\n" in text else "\n"


def unit_for(indent):
    if indent is not None and "\t" in indent:
        return "\t"
    if indent and len(indent) % 4 != 0:
        return "  "
    return "    "


def indent_at(text, index):
    line_start = text.rfind("\n", 0, index) + 1
    j = line_start
    while j < index and text[j] in " \t":
        j += 1
    if j == index:
        return text[line_start:index]
    return None


def skip_ws_comments(text, i):
    n = len(text)
    while i < n:
        c = text[i]
        if c in " \t\r\n":
            i += 1
            continue
        if c == "/" and i + 1 < n and text[i + 1] == "/":
            i += 2
            while i < n and text[i] != "\n":
                i += 1
            continue
        if c == "/" and i + 1 < n and text[i + 1] == "*":
            end = text.find("*/", i + 2)
            if end < 0:
                raise Unsafe("unclosed block comment")
            i = end + 2
            continue
        break
    return i


def parse_string(text, i):
    if i >= len(text) or text[i] != '"':
        raise Unsafe("expected a string")
    j = i + 1
    n = len(text)
    while j < n:
        if text[j] == "\\":
            if j + 1 >= n:
                raise Unsafe("bad escape in string")
            j += 2
            continue
        if text[j] == '"':
            token = text[i : j + 1]
            try:
                value = json.loads(token)
            except json.JSONDecodeError as exc:
                raise Unsafe("bad string") from exc
            if not isinstance(value, str):
                raise Unsafe("bad string")
            return value, j + 1
        if text[j] == "\n":
            raise Unsafe("unterminated string")
        j += 1
    raise Unsafe("unterminated string")


def skip_container(text, open_index):
    open_ch = text[open_index]
    close_ch = "}" if open_ch == "{" else "]"
    if open_ch not in "{[":
        raise Unsafe("expected { or [")
    i = open_index
    depth = 0
    n = len(text)
    while i < n:
        c = text[i]
        if c == '"':
            _, i = parse_string(text, i)
            continue
        if c == "/" and i + 1 < n and text[i + 1] in "/*":
            nxt = skip_ws_comments(text, i)
            if nxt == i:
                raise Unsafe("could not skip a comment")
            i = nxt
            continue
        if c == open_ch:
            depth += 1
        elif c == close_ch:
            depth -= 1
            if depth == 0:
                return i + 1
        i += 1
    raise Unsafe("unbalanced brackets")


def skip_value(text, i):
    i = skip_ws_comments(text, i)
    if i >= len(text):
        raise Unsafe("missing value")
    c = text[i]
    if c == '"':
        _, end = parse_string(text, i)
        return end
    if c == "{":
        return skip_container(text, i)
    if c == "[":
        return skip_container(text, i)
    if c == "-" or c.isdigit():
        j = i + 1
        while j < len(text) and text[j] in "0123456789eE+-.":
            j += 1
        return j
    for lit in ("true", "false", "null"):
        if text.startswith(lit, i):
            nxt = i + len(lit)
            if nxt >= len(text) or text[nxt] not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_":
                return nxt
    raise Unsafe("unsupported value")


def walk_object(text, brace_index):
    if brace_index >= len(text) or text[brace_index] != "{":
        raise Unsafe("expected {")
    i = brace_index + 1
    props = []
    while True:
        i = skip_ws_comments(text, i)
        if i >= len(text):
            raise Unsafe("unbalanced {")
        if text[i] == "}":
            return props, i
        if text[i] == ",":
            i += 1
            continue
        if text[i] != '"':
            raise Unsafe("expected a property name")
        key_at = i
        key, i = parse_string(text, i)
        i = skip_ws_comments(text, i)
        if i >= len(text) or text[i] != ":":
            raise Unsafe("expected : after a property name")
        i += 1
        i = skip_ws_comments(text, i)
        if i >= len(text):
            raise Unsafe("missing value")
        value_at = i
        value_end = skip_value(text, i)
        props.append(
            {
                "key": key,
                "key_at": key_at,
                "value_at": value_at,
                "value_end": value_end,
            }
        )
        i = value_end


def parse_root(text):
    start = 1 if text.startswith("\ufeff") else 0
    i = skip_ws_comments(text, start)
    if i >= len(text) or text[i] != "{":
        raise Unsafe("settings file has no root object")
    props, close_i = walk_object(text, i)
    after = skip_ws_comments(text, close_i + 1)
    if after < len(text):
        raise Unsafe("unexpected content after the root object")
    return props, close_i


def format_entries(indent, pairs, trailing_comma, nl):
    lines = []
    last = len(pairs) - 1
    for index, (key, value) in enumerate(pairs):
        comma = "," if trailing_comma or index != last else ""
        rendered = json.dumps(value, ensure_ascii=False)
        lines.append(f"{indent}{json.dumps(key, ensure_ascii=False)}: {rendered}{comma}")
    return nl.join(lines)


def render_block(prop_indent, key_indent, pairs, nl):
    entries = format_entries(key_indent, pairs, False, nl)
    return (
        f'{prop_indent}"search.exclude": {{{nl}'
        f"{entries}{nl}"
        f"{prop_indent}}}"
    )


def prop_indent_of(text, props):
    for prop in props:
        indent = indent_at(text, prop["key_at"])
        if indent is not None:
            return indent
    return "    "


def insert_block(text, props, close_i, missing):
    nl = newline_of(text)
    base = prop_indent_of(text, props)
    block = render_block(base, base + unit_for(base), missing, nl)
    comma_at = None
    if props:
        last_end = props[-1]["value_end"]
        cursor = skip_ws_comments(text, last_end)
        if cursor == close_i:
            comma_at = last_end
        elif cursor < len(text) and text[cursor] == ",":
            after_comma = skip_ws_comments(text, cursor + 1)
            if after_comma != close_i:
                raise Unsafe("could not place search.exclude before the final }")
        else:
            raise Unsafe("could not place search.exclude before the final }")
    line_start = text.rfind("\n", 0, close_i) + 1
    prefix = text[line_start:close_i]
    if prefix.strip(" \t") == "" and line_start > 0:
        block_at = line_start
        block_text = block + nl
    else:
        block_at = close_i
        block_text = nl + block + nl
    if comma_at is not None:
        text = text[:comma_at] + "," + text[comma_at:]
        if block_at >= comma_at:
            block_at += 1
    return text[:block_at] + block_text + text[block_at:]


def insert_keys(text, prop, brace_at, child_props, missing):
    nl = newline_of(text)
    key_indent = None
    for child in child_props:
        key_indent = indent_at(text, child["key_at"])
        if key_indent is not None:
            break
    if key_indent is None:
        parent = indent_at(text, prop["key_at"]) or ""
        key_indent = parent + unit_for(parent)
    entries = format_entries(key_indent, missing, bool(child_props), nl)
    at = brace_at + 1
    if text.startswith("\r\n", at) or text.startswith("\n", at):
        at += 2 if text.startswith("\r\n", at) else 1
        payload = entries + nl
    else:
        payload = nl + entries
        nxt = text[at : at + 1]
        if nxt == "}":
            payload += nl
        elif nxt not in ("", " ", "\t", "\r", "\n", "/"):
            payload += " "
    return text[:at] + payload + text[at:]


def merge(text, items):
    props, close_i = parse_root(text)
    excludes = [prop for prop in props if prop["key"] == "search.exclude"]
    if len(excludes) > 1:
        raise Unsafe('more than one root "search.exclude" key')
    if not excludes:
        missing = list(items)
        return insert_block(text, props, close_i, missing), missing
    prop = excludes[0]
    value_at = prop["value_at"]
    if value_at >= len(text) or text[value_at] != "{":
        raise Unsafe('"search.exclude" is not a JSON object')
    child_props, _child_close = walk_object(text, value_at)
    present = {child["key"] for child in child_props}
    missing = [(key, value) for key, value in items if key not in present]
    if not missing:
        return text, []
    updated = insert_keys(text, prop, value_at, child_props, missing)
    return updated, missing


def print_snippet(reason, items):
    nl = "\n"
    block = render_block("    ", "        ", items, nl)
    print(f"⚠️  Left .vscode/settings.json unchanged ({reason}).")
    print("Paste this into the root settings object (add a comma after the previous setting if there is one):")
    print("")
    print(block)


def emit_check(kind, missing):
    if kind == "ok":
        print("ok")
        return
    if kind == "absent":
        print("absent")
        return
    if kind == "unsafe":
        print("unsafe")
        return
    for key, _value in missing:
        print("missing\t" + json.dumps(key, ensure_ascii=False))


def create_settings(items):
    nl = "\n"
    block = render_block("    ", "        ", items, nl)
    text = "{" + nl + block + nl + "}" + nl
    settings_path.parent.mkdir(parents=True, exist_ok=True)
    settings_path.write_bytes(text.encode("utf-8"))
    print("✅ created .vscode/settings.json")


def main():
    items = load_template()
    if not settings_path.exists():
        if mode == "check":
            emit_check("absent", [])
            return
        if not items:
            print("✅ .vscode/settings.json: nothing missing")
            return
        create_settings(items)
        return
    if not settings_path.is_file():
        if mode == "check":
            emit_check("unsafe", [])
            return
        print_snippet("path is not a file", items)
        return
    try:
        text = settings_path.read_bytes().decode("utf-8")
    except UnicodeDecodeError:
        if mode == "check":
            emit_check("unsafe", [])
            return
        print_snippet("file is not UTF-8", items)
        return
    try:
        updated, missing = merge(text, items)
    except Unsafe as exc:
        if mode == "check":
            emit_check("unsafe", [])
            return
        print_snippet(str(exc), items)
        return
    if mode == "check":
        if missing:
            emit_check("missing", missing)
        else:
            emit_check("ok", [])
        return
    if not missing:
        print("✅ .vscode/settings.json: nothing missing")
        return
    if updated != text:
        settings_path.write_bytes(updated.encode("utf-8"))
    names = ", ".join(json.dumps(key, ensure_ascii=False) for key, _value in missing)
    print(f"✅ .vscode/settings.json: added {len(missing)} search.exclude key(s): {names}")


main()
PY
