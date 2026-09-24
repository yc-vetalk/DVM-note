#!/usr/bin/env python3
"""Insert or regenerate a per-page '本頁藥物總覽' table into a pharmacology
topic page, sourced from that topic's rows in 藥品索引.html (filtered by
data-topics). Run this as the last step after 藥品索引.html has been updated
for the page (step 5 in SKILL.md) — the table is a live view of those rows,
not a separate thing to author by hand.

Usage:
    python3 .claude/skills/vetpharm-note-builder/scripts/add_drug_table.py \
        "<檔名>.html" "<data-topics 用的主題字串>" [--force]

--force removes and regenerates an existing table (use after editing
藥品索引.html rows for a page that already has a table, e.g. to add a route
that was missing).
"""
import re
import sys

INDEX_PATH = "DVM-note/大三/獸醫藥理學/藥品索引.html"

ROW_RE = re.compile(
    r'<tr data-topics="([^"]+)"[^>]*>\s*'
    r'<td>(.*?)</td>\s*'
    r'<td[^>]*>(.*?)</td>\s*'
    r'<td[^>]*>(.*?)</td>\s*'
    r'<td class="drug-locations">(.*?)</td>\s*'
    r'</tr>'
)
LINK_RE = re.compile(r'<a href="([^"]+)" class="drug-link">([^<]*)</a>')


def parse_index_rows(index_content):
    rows = []
    for m in ROW_RE.finditer(index_content):
        topics = m.group(1).split(" ")
        name_html, mech_html, clin_html, links_html = m.group(2), m.group(3), m.group(4), m.group(5)
        links = LINK_RE.findall(links_html)
        rows.append({
            "topics": topics,
            "name": name_html,
            "mech": mech_html,
            "clin": clin_html,
            "links": links,
        })
    return rows


def build_table_rows(rows, topic, target_file, page_content):
    scored = []
    for r in rows:
        if topic not in r["topics"]:
            continue
        page_links = [(href, text) for href, text in r["links"] if href.startswith(target_file + "#")]
        if not page_links:
            continue
        link_html_parts = []
        positions = []
        for href, text in page_links:
            anchor = href.split("#", 1)[1]
            label = text.split("：", 1)[1] if "：" in text else text
            link_html_parts.append(f'<a href="#{anchor}" class="drug-link">{label}</a>')
            pos = page_content.find(f'id="{anchor}"')
            positions.append(pos if pos >= 0 else 10**9)
        links_cell = "".join(link_html_parts)
        row_html = (
            f'<tr><td>{r["name"]}</td><td>{r["mech"]}</td><td>{r["clin"]}</td>'
            f'<td class="drug-locations">{links_cell}</td></tr>'
        )
        scored.append((min(positions), row_html))
    scored.sort(key=lambda x: x[0])
    return [row for _, row in scored]


def build_section(table_rows, section_num):
    rows_html = "\n            ".join(table_rows)
    return f'''<!-- DRUG TABLE -->
    <div class="section" id="section-drugtable">
      <div class="section-head"><div class="section-num">{section_num}</div><h2>本頁藥物總覽 Drug Summary Table</h2></div>
      <p class="section-desc">本頁提到的藥物一覽，機轉與臨床應用欄位與全站〈<a href="藥品索引.html">藥品索引</a>〉同步；點最後一欄可跳到頁面內對應段落。</p>
      <div class="table-wrap">
        <table>
          <thead><tr><th>藥物</th><th>機轉／標的</th><th>臨床應用與原因</th><th>段落</th></tr></thead>
          <tbody>
            {rows_html}
          </tbody>
        </table>
      </div>
    </div>

'''


def insert_into_page(page_content, section_html):
    # Find the second "<div class=\"section\" id=\"section-" occurrence (i.e. right after abstract)
    matches = list(re.finditer(r'<div class="section" id="section-[a-zA-Z0-9]+">', page_content))
    if len(matches) < 2:
        raise RuntimeError("could not find second section div")
    insert_pos = matches[1].start()
    # back up over a preceding HTML comment line if present
    preceding = page_content[:insert_pos]
    comment_match = re.search(r'(<!--[^\n]*-->\s*\n\s*)$', preceding)
    if comment_match:
        insert_pos = comment_match.start()

    new_content = page_content[:insert_pos] + section_html + page_content[insert_pos:]

    # renumber ALL section-num divs sequentially in document order (1, 2, 3, ...)
    counter = {"i": 0}
    def renumber(m):
        counter["i"] += 1
        return f'<div class="section-num">{counter["i"]}</div>'
    new_content = re.sub(r'<div class="section-num">\d+</div>', renumber, new_content)

    # TOC: insert nav link after nav-abstract
    toc_link = '\n    <a onclick="showSection(\'drugtable\')" id="nav-drugtable"><span class="nav-icon">💊</span> 本頁藥物總覽</a>'
    new_content = re.sub(
        r'(<a class="active" onclick="showSection\(\'abstract\'\)" id="nav-abstract">.*?</a>)',
        r'\1' + toc_link,
        new_content,
        count=1,
    )

    # SECTION_NAMES: insert after abstract entry
    new_content = re.sub(
        r"(abstract: '重點摘要',)",
        r"\1\n  drugtable: '本頁藥物總覽',",
        new_content,
        count=1,
    )

    return new_content


def remove_existing(page_content):
    # remove the drugtable section div (including preceding comment)
    page_content = re.sub(
        r'(<!--[^\n]*DRUG TABLE[^\n]*-->\s*\n\s*)?<div class="section" id="section-drugtable">.*?</div>\s*\n\s*(?=<!--|\s*<div class="section")',
        '', page_content, count=1, flags=re.DOTALL,
    )
    # renumber sequentially (drugtable removed, everything shifts down by 1)
    counter = {"i": 0}
    def renumber(m):
        counter["i"] += 1
        return f'<div class="section-num">{counter["i"]}</div>'
    page_content = re.sub(r'<div class="section-num">\d+</div>', renumber, page_content)
    page_content = re.sub(r'\n?\s*<a onclick="showSection\(\'drugtable\'\)" id="nav-drugtable">.*?</a>', '', page_content)
    page_content = re.sub(r"\n\s*drugtable: '本頁藥物總覽',", '', page_content)
    return page_content


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    target_file = sys.argv[1]  # e.g. "強心配糖體.html"
    topic = sys.argv[2]        # e.g. "強心配糖體" (must match a data-topics value in 藥品索引.html)
    force = "--force" in sys.argv

    with open(INDEX_PATH, encoding="utf-8") as f:
        index_content = f.read()
    rows = parse_index_rows(index_content)

    page_path = f"DVM-note/大三/獸醫藥理學/{target_file}"
    with open(page_path, encoding="utf-8") as f:
        page_content = f.read()

    if 'id="section-drugtable"' in page_content:
        if not force:
            print(f"SKIP: {target_file} already has drug table section (use --force to regenerate)")
            return
        page_content = remove_existing(page_content)

    table_rows = build_table_rows(rows, topic, target_file, page_content)
    if not table_rows:
        print(f"WARNING: no rows found for topic={topic} target_file={target_file}")
        return

    section_html = build_section(table_rows, section_num=2)
    new_content = insert_into_page(page_content, section_html)

    with open(page_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"OK: inserted {len(table_rows)} rows into {target_file}")


if __name__ == "__main__":
    main()
