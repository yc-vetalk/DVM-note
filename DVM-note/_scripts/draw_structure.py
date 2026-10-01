#!/usr/bin/env python3
"""依藥名向 PubChem 查詢 SMILES，用 RDKit 畫成 SVG 結構式。

用法：
  ./.venv/bin/python DVM-note/_scripts/draw_structure.py OUT_DIR "Prednisolone" "Dexamethasone" ...
  名稱可寫成 "顯示名=PubChem查詢名"，例如 "Cortisol=hydrocortisone"
輸出：OUT_DIR/<檔名>.svg，並印出所用的 SMILES 與 PubChem CID 供核對。
"""
import json, re, sys, urllib.parse, urllib.request
from pathlib import Path
from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem.Draw import rdMolDraw2D


def pubchem(name):
    base = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/"
    url = base + urllib.parse.quote(name) + "/property/SMILES,IsomericSMILES,Title/JSON"
    with urllib.request.urlopen(url, timeout=20) as r:
        p = json.load(r)["PropertyTable"]["Properties"][0]
    return p.get("SMILES") or p.get("IsomericSMILES"), p["CID"]


def draw(smiles, label, path, w=420, h=300):
    mol = Chem.MolFromSmiles(smiles)
    AllChem.Compute2DCoords(mol)
    d = rdMolDraw2D.MolDraw2DSVG(w, h)
    o = d.drawOptions()
    o.legendFontSize = 18
    o.bondLineWidth = 2
    o.addStereoAnnotation = False
    d.DrawMolecule(mol, legend=label)
    d.FinishDrawing()
    Path(path).write_text(d.GetDrawingText(), encoding="utf-8")


def main():
    out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
    for arg in sys.argv[2:]:
        label, query = (arg.split("=", 1) + [arg])[:2] if "=" in arg else (arg, arg)
        smi, cid = pubchem(query)
        fn = re.sub(r"[^A-Za-z0-9]+", "_", label).strip("_").lower() + ".svg"
        draw(smi, label, out / fn)
        print(f"{label}\tCID {cid}\t{fn}\t{smi}")


if __name__ == "__main__":
    main()
